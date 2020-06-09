import React, { FC, useState } from 'react';
import TaskItem from './Task';
import { Task } from '../../types';
import TaskInput from '../TaskInput';
import './index.scss';
import Icon from '../Icon';
import { getFormattedTimeFromSeconds } from '../../utils';

export interface Props {
    tasks: Task[] | null;
    markCompleted: (task: Task) => void;
    setCurrentTask: (task: Task) => void;
    addTask: (title: string) => void;
    currentTask?: Task;
}

const Tasks: FC<Props> = ({ tasks = [], markCompleted, addTask, setCurrentTask, currentTask }) => {
    const [displayAllTasks, setDisplayAllTasks] = useState(false);
    const activeTask = currentTask;

    return <div className='tasks'>
        {
            displayAllTasks && tasks ?
                <>
                    <div className='tasks-list'>
                        {
                            tasks.map((task) => {
                                const totalTimeSpent = getFormattedTimeFromSeconds(
                                    task.timeRecords ?
                                        task.timeRecords.reduce((total, tr) => total += tr.duration, 0) :
                                        0
                                );

                                return (<div 
                                    className='task-list-item'
                                    key={task.id}
                                >
                                    <TaskItem
                                        title={task.title}
                                        isCompleted={task.isCompleted}
                                        isDisabled={task.isUpdating}
                                        onClick={!task.isCompleted ? () => markCompleted(task) : undefined}
                                    />
                                    <div className='task-time-spent'>
                                        <div className='task-time-spent-header'>Time Spent:</div>
                                        {`${totalTimeSpent.minutes}:${totalTimeSpent.seconds}`}
                                    </div>
                                    <button 
                                        className='outline task-picker' 
                                        onClick={() => {
                                            setCurrentTask(task);
                                            setDisplayAllTasks(false);
                                        }}
                                        title='Set as current task'
                                    >
                                        <Icon iconType='input'/>
                                    </button>
                                </div>);
                            })
                        }
                    </div>
                    <button className='outline' onClick={() => setDisplayAllTasks(false)}>
                        <Icon iconType='arrow_back'/>&nbsp;Back to current task
                    </button>
                </> : <>
                    <TaskInput
                        onSubmit={addTask}
                    />
                    {
                        activeTask && <TaskItem
                            title={activeTask.title}
                            isCompleted={activeTask.isCompleted}
                            isDisabled={activeTask.isUpdating}
                            onClick={!activeTask.isCompleted ? () => markCompleted(activeTask) : undefined}
                        />
                    }
                    {
                        !!tasks?.length && <button className='outline' onClick={() => setDisplayAllTasks(true)}>
                            View all tasks
                        </button>
                    }
                </>
        }
    </div>;
};

export default Tasks;
