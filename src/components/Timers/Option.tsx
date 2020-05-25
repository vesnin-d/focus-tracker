import React, { FC } from 'react';
import Icon from '../Icon';

export interface Props {
    title: string;
    onClick: () => void;
}

const Option: FC<Props> = ({
    title,
    onClick
}) => (
    <div 
        className='timer-option'
    >
        <div 
            className='timer-option-icon'
            onClick={onClick}
        >
            <Icon
                iconType='timer'
            />
        </div>
        <div className='timer-option-title'>
            {title}
        </div>
    </div>
);

export default Option;