import React, { FC } from 'react';
import Icon from '../Icon';

export interface Props {
    title: string;
    isCompleted: boolean;
    onClick?: () => void;
}

const Task: FC<Props> = ({ title, isCompleted, onClick }) => {
    return (
        <div className='task' onClick={onClick}>
            <Icon 
                iconType={isCompleted ? 'check_box' : 'check_box_outline_blank'} 
            />&nbsp;<span className='task-title'>{title}</span>
        </div>
    );
};

export default Task;
