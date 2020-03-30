import React, { useState } from 'react';
import './App.scss';
import Timer from './components/Timer/index.tsx';
import TaskInput from './components/TaskInput';

function App() {
  const [completedTasks, setComplatedTasks] = useState([]);
  const [task, setTask] = useState('');

  const markComplete = () => {
    setComplatedTasks([
      ...completedTasks,
      task
    ]);
    setTask('');
  };

  return (
    <div className='app'>
       <div className='main'>
        <Timer
          onEnd={() => console.log('end')}
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
       </div>
    </div>
  );
}

export default App;
