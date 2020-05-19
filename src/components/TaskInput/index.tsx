import React, { FC, useState } from 'react';

export interface Props {
    onSubmit: (task: string) => void;
}

const TaskInput: FC<Props> = ({ onSubmit }) => {
    const [ value, setValue ] = useState('');

    return <input 
        type='text' 
        value={value}
        onChange={(ev) => setValue(ev.currentTarget.value)}
        onKeyDown={(ev) => {
            if(ev.key === 'Enter' ) {
                const trimmed = value.trim();

                trimmed && onSubmit(trimmed); 
            }   
        }}
        placeholder='What are you doing right now?'
    />;
};

export default TaskInput;