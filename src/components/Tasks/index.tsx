import React, { FC, useState } from 'react';
import TaskItem from './Task';
import { Task } from '../../types';
import TaskInput from '../TaskInput';
import './index.scss';
import Icon from '../Icon';

export interface Props {
    tasks: Task[] | null;
    markCompleted: (task: Task) => void;
    addTask: (title: string) => void;
}

const Tasks: FC<Props> = ({ tasks = [], markCompleted, addTask }) => {
    const [displayAllTasks, setDisplayAllTasks] = useState(false);
    const [activeTask] = tasks;

    return <div className='tasks'>
        {
            displayAllTasks && tasks ?
                <>
                    <div className='tasks-list'>
                        {
                            tasks.map((task) => (<TaskItem
                                key={task.id}
                                title={task.title}
                                isCompleted={task.isCompleted}
                                onClick={!task.isCompleted ? () => markCompleted(task) : undefined}
                            />))
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
                            onClick={!activeTask.isCompleted ? () => markCompleted(activeTask) : undefined}
                        />
                    }
                    <button className='outline' onClick={() => setDisplayAllTasks(true)}>
                        View all tasks
                    </button>
                </>
        }
    </div>;
};

export default Tasks;
