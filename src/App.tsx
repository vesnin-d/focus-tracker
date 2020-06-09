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
    currentTaskId: localStorage.getItem('currentTaskId') ?? null,
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
        if(state.currentTaskId) {
            localStorage.setItem('currentTaskId', state.currentTaskId);
        }
    }, [state.currentTaskId]);

    const markCompleted = (task: Task) => {
        dispatch({
            type: ACTIONS.TASK.UPDATE,
            payload: {
                ...task,
                isUpdating: true
            }
        });

        markTaskCompleted(
            task.id!, 
            state.authData!.token
        ).then((ct) => {
            dispatch({
                type: ACTIONS.TASK.UPDATE,
                payload: ct
            });
        });
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

    const setCurrentTask = useCallback((task: Task) =>
        dispatch({
            type: ACTIONS.TASK.SET_CURRENT,
            payload: task.id
        }), [dispatch]);

    const addTimeRecord = useCallback((timer: TimerDescriptor) => {
        createTimeRecord(
            timer.duration, 
            state.currentTaskId,
            state.authData!.token
        ).then((tr) => {
            dispatch({
                type: ACTIONS.TASK.UPDATE,
                payload: tr.task
            });
        });
    }, [state.authData, state.currentTaskId, dispatch]);

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
                                setCurrentTask={setCurrentTask}
                                currentTask={state.tasks.find(task => task.id === state.currentTaskId)}
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
