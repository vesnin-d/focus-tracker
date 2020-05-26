import React, { useState, useReducer, useEffect, useCallback } from 'react';
import './App.scss';
import Timers from './components/Timers';
import { TimerDescriptor, Task } from './types';
import Tasks from './components/Tasks';
import LoginForm from './components/LoginForm';
import WelcomeBanner from './components/WelcomeBanner';
import Header from './components/Header';
import { 
  createTask,
  createTimeRecord,
  markTaskCompleted,
  fetchCurrentUser
} from './network';
import { reducer, ACTIONS } from './reducer';

const initialState = {
  authData: localStorage.getItem('authData') ? 
    JSON.parse(localStorage.getItem('authData')!) : null,
  currentTimer: null,
  currentUser: null,
  tasks: []
};

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if(state.authData) {
            fetchCurrentUser(state.authData.token)
                .then(
                    (user) => dispatch({
                        type: ACTIONS.USER.SET_CURRENT,
                        payload: user
                    }),
                    () => dispatch({
                        type: ACTIONS.USER.LOGOUT
                    })
                );
        }
    }, []);

    useEffect(() => {
        if(state.authData) {
            localStorage.setItem('authData', JSON.stringify(state.authData));
        }
    }, [state.authData]);

    useEffect(() => {
        if(state.currentTimer) {
            localStorage.setItem('currentTimer', state.currentTimer.id);
        }
    }, [state.currentTimer]);

    const markCompleted = (task: Task) => {
        markTaskCompleted(
            task.id!, 
            state.authData!.token
        ).then((ct) => dispatch({
            type: ACTIONS.TASK.UPDATE,
            payload: ct
        }));
    };

    const addTask = useCallback((title: string) => {
        createTask(title, state.authData!.token)
            .then((task) => {
                dispatch({
                    type: ACTIONS.TASK.ADD,
                    payload: task
                });
                dispatch({
                    type: ACTIONS.TASK.SET_CURRENT,
                    payload: task.id
                });
            });
    }, [state.authData]);

    const addTimeRecord = useCallback((timer: TimerDescriptor) => {
        createTimeRecord(
            timer.duration, 
            state.currentTaskId,
            state.authData!.token
        );
    }, [state.authData, state.currentTaskId]);

    const onLogin = useCallback((token, userId) => {
        setShowLogin(false);
        dispatch({
            type: ACTIONS.USER.LOGIN,
            payload: {
                token,
                userId
            }
        });

        fetchCurrentUser(token)
            .then(
                (user) => dispatch({
                    type: ACTIONS.USER.SET_CURRENT,
                    payload: user
                }),
                () => dispatch({
                    type: ACTIONS.USER.LOGOUT
                })
            );
  }, [dispatch, setShowLogin]);

  return (
    <div className='app'>
        <Header
            user={state.currentUser}
            triggerLogin={() => setShowLogin(true)}
            triggerLogout={() =>  dispatch({
                type: ACTIONS.USER.LOGOUT
            })}
        />
        {
            state.authData || showLogin ? <div className='main'>
                {
                    showLogin ? <LoginForm 
                        onLogin={onLogin}
                    /> : <>
                        <Timers
                            onTimerCompleted={addTimeRecord}
                        />
                        <Tasks 
                            tasks={state.tasks} 
                            markCompleted={markCompleted}
                            addTask={addTask}
                        />
                    </>
                }
           </div> : <WelcomeBanner />
        }
    </div>
  );
}

export default App;
