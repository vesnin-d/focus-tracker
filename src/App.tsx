import React, { useState, useReducer, useEffect, useCallback } from 'react';
import './App.scss';
import Timer from './components/Timer';
import TaskInput from './components/TaskInput';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import { 
  createTask,
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
       <div className='main'>
        {
          task ? <div className='task'>
            <i 
              className='material-icons icon'
              onClick={markComplete}
            >check_box_outline_blank</i>&nbsp;{task.title}
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
        {
          showLogin && <LoginForm 
            onLogin={onLogin}
          />
        }
       </div>
    </div>
  );
}

export default App;
