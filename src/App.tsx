import React, { useState, useReducer, useEffect } from 'react';
import { getTimestampInSeconds } from './utils';
import './App.scss';
import Timer from './components/Timer';
import TaskInput from './components/TaskInput';
import LoginForm from './components/LoginForm';
import { fetchTimer, createTimer, pauseTimer, resumeTimer } from './network';

export interface AppState {
  authData: {
    token: string;
    userId: string;
  },
  currentTimer: any;
}

export function reducer(state: AppState, action: any) {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        authData: action.payload
      };
    case 'SET_CURRENT_TIMER':
      return {
        ...state,
        currentTimer: action.payload
      }; 
  }

  return state;
}

const initialState = {
  authData: localStorage.getItem('authData') ? 
    JSON.parse(localStorage.getItem('authData')!) : null,
  currentTimer: null  
};

function App() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [task, setTask] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const markComplete = () => {
    setCompletedTasks([
      ...completedTasks,
      task
    ]);
    setTask('');
  };

  useEffect(() => {
    if (localStorage.getItem('currentTimer')) {
      fetchTimer(
        localStorage.getItem('currentTimer')!, 
        state.authData.token
      ).then(({ data }) => {
        dispatch({
          type: 'SET_CURRENT_TIMER',
          payload: data.timer
        });
      });
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

  return (
    <div className='app'>
       <div className='main'>
       {
          !showLogin && !state.authData && <button 
            type='button' 
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
       }
        <Timer
          currentTimer={state.currentTimer}
          onPause={
            () => {
              pauseTimer(
                state.currentTimer._id, 
                state.authData.token
              ).then(
                ({ data }) => {
                  dispatch({
                    type: 'SET_CURRENT_TIMER',
                    payload: data.pauseTimer
                  });
                }
              )
            }
          }
          onEnd={() => console.log('end')}
          onStart={() => {
            if(state.authData && state.authData.token) {
              if (state.currentTimer) {
                resumeTimer(
                  state.currentTimer._id, 
                  state.authData.token
                ).then(
                  ({ data }) => {
                    dispatch({
                      type: 'SET_CURRENT_TIMER',
                      payload: data.createTimer
                    });
                  }
                );
              } else {
                createTimer(
                  getTimestampInSeconds(), 
                  state.authData.token
                ).then(
                  ({ data }) => {
                    dispatch({
                      type: 'SET_CURRENT_TIMER',
                      payload: data.createTimer
                    });
                  }
                );
              }
            }
          }}
        />
        {
          task ? <div className='task'>
            <i 
              className='material-icons icon'
              onClick={markComplete}
            >check_box_outline_blank</i>&nbsp;{task}
          </div> : <TaskInput
            onSubmit={(value) => setTask(value)}
          />
        }
        {
          completedTasks.map((ct) => <div className='completed'>
            <i className='material-icons icon'>check_box</i>&nbsp;{ct}
          </div>)
        }
        {
          showLogin && <LoginForm 
            onLogin={(token, userId) => {
              setShowLogin(false);
              dispatch({
                type: 'LOGIN',
                payload: {
                  token,
                  userId
                }
              });
            }}
          />
        }
       </div>
    </div>
  );
}

export default App;
