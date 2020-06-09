import React, { FC, useEffect } from 'react';
import './index.scss';
import { TimerDescriptor } from '../../types';
import { getFormattedTimeFromSeconds } from '../../utils';
import ProgressRing from '../ProgressRing';
import Icon from '../Icon';

export interface Props {
    currentTimer: TimerDescriptor;
    onStart: () => void;
    onPause: () => void;
    onCancel: () => void;
    onTick: () => void;
}

const Timer: FC<Props> = ({ currentTimer, onTick, onStart, onPause, onCancel }) => {
    useEffect(() => {
        if (currentTimer.isRunning) {
            const intervalId = setInterval(
                () => onTick(),
                1000
            );

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [currentTimer.isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

    const timeLeft = getFormattedTimeFromSeconds(currentTimer.remains);

    return <div className='timer'>
        <ProgressRing
            radius={160}
            stroke={5}
            progress={(currentTimer.remains / currentTimer.duration) * 100}
        />
        <div className='timer-time'>
            <span className='timer-minutes'>
                {timeLeft.minutes}
            </span>
            :
            <span className='timer-seconds'>
                {timeLeft.seconds}
            </span>
        </div>
        <div className='timer-buttons'>
            {
                currentTimer.isRunning ? <button 
                    title='Pause'
                    onClick={onPause}
                    className='timer-button'
                >
                    <Icon iconType='pause'/>
                </button> : <button 
                    title='Start'
                    onClick={onStart}
                    className='timer-button'
                >
                    <Icon iconType='play_arrow'/>
                </button>
            }
            {
                (currentTimer.isRunning || currentTimer.remains !== currentTimer.duration) && <button 
                    onClick={onCancel}
                    title='Reset' 
                    className='timer-button'
                >
                    <Icon iconType='close'/>
                </button>
            }
        </div>
    </div>;
} 

export default Timer;
