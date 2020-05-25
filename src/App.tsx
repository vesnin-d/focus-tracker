import React, { useState, useReducer, useEffect, useCallback } from 'react';
import './App.scss';
import Timers from './components/Timers';
import { TimerDescriptor } from './types';
import TaskInput from './components/TaskInput';
import LoginForm from './components/LoginForm';
import WelcomeBanner from './components/WelcomeBanner';
import Header from './components/Header';
import { 
  createTask,
  createTimeRecord,
  updateTimeRecordDuration,
  markTaskCompleted,
  fetchCurrentUser
} from './network';
import { reducer, ACTIONS } from './reducer';

const initialState = {
  authData: localStorage.getItem('authData') ? 
    JSON.parse(localStorage.getItem('authData')!) : null,
  currentTimer: null,
  currentUser: null
};

function App() {
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [task, setTask] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentTimer, setCurrentTimer] = useState<any>(null);

  const markComplete = () => {
    markTaskCompleted(
      task._id, 
      state.authData!.token
    ).then((ct) => {
      setCompletedTasks([
        ...completedTasks,
        task
      ]);
      setTask(null);
    });
  };

  const addTask = useCallback((title: string) => {
    createTask(title, state.authData!.token)
      .then((task) => {
        setTask(task)
      });
  }, [state.authData]);

  const addTimeRecord = useCallback((timer: TimerDescriptor) => {
    createTimeRecord(timer.duration - timer.remains, state.authData!.token)
      .then(setCurrentTimer);
  }, [state.authData, setCurrentTimer]);

  const updateTimeRecord = useCallback((timer: TimerDescriptor) => {
      if(currentTimer) {
        updateTimeRecordDuration(currentTimer.id, timer.duration - timer.remains, state.authData!.token)
            .then((timer) => {
            console.log(timer);
            });
      }
  }, [state.authData, currentTimer]);

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
      localStorage.setItem('currentTimer', state.currentTimer._id);
    }
  }, [state.currentTimer]);

  const onLogin = useCallback((token, userId) => {
    setShowLogin(false);
    dispatch({
      type: 'LOGIN',
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
                        {
                            task ? <div className='task'>
                                <i 
                                    className='material-icons icon'
                                    onClick={markComplete}
                                >
                                    check_box_outline_blank
                                </i>&nbsp;{task.title}
                                </div> : <TaskInput
                                    onSubmit={addTask}
                                />
                        }
                        {
                            completedTasks.map((ct) => <div 
                                key={ct._id}
                                className='completed'
                            >
                                <i className='material-icons icon'>check_box</i>&nbsp;{ct.title}
                            </div>)
                        }
                    </>
                }
           </div> : <WelcomeBanner />
        }

    </div>
  );
}

export default App;
