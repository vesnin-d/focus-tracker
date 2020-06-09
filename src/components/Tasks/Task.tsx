import React, { FC } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

export interface Props {
    title: string;
    isCompleted: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
}

const Task: FC<Props> = ({ title, isCompleted, isDisabled, onClick }) => {
    return (
        <div className={classNames(
            'task',
            {
                disabled: isDisabled
            }
        )} onClick={onClick}>
            <Icon 
                iconType={isCompleted ? 'check_box' : 'check_box_outline_blank'} 
            />&nbsp;<span className='task-title'>{title}</span>
        </div>
    );
};

export default Task;
