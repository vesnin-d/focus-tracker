import React, { FC, useState, useEffect, useCallback } from 'react';
import './index.scss';
import { getTimestampInSeconds } from '../../utils';

export interface TimerDescriptor {
    isRunning: boolean;
    startedAt: number;
    remains: number;
}

export interface Props {
    currentTimer?: TimerDescriptor;
    onStart: () => void;
    onPause: () => void;
    onCancel?: () => void;
    onEnd: () => void;
    onTick?: () => void;
}

const TIMER_START_VALUE = 25 * 60 * 1000;

const Timer: FC<Props> = ({ currentTimer, onEnd, onStart, onPause }) => {
    const [ time, setTime ] = useState(
        currentTimer ? currentTimer.remains * 1000 : TIMER_START_VALUE
    );
    const [ isRunning, setIsRunning ] = useState(
        currentTimer ? currentTimer.isRunning : false
    );

    useEffect(() => {
        if(currentTimer) {
            console.log(currentTimer.startedAt + currentTimer.remains, getTimestampInSeconds());
            setTime(
                ((
                    currentTimer.startedAt + currentTimer.remains
                ) - getTimestampInSeconds()) * 1000
            );
            setIsRunning(currentTimer.isRunning);
        }
    }, [currentTimer]);
    
    useEffect(() => {
        if (isRunning) {
            const intervalId = setInterval(
                () => {
                    setTime(time => {
                        if(time > 1000) {
                            return time - 1000
                        }
                        clearInterval(intervalId);
                        return 0;
                    });
                },
                1000
            );

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [isRunning]);

    useEffect(() => {
        if (time === 0) {
            return onEnd();
        }
    }, [time, onEnd]);

    const start = useCallback(() => {
        setIsRunning(true);
        onStart();
    }, [setIsRunning, onStart]);

    const pause = useCallback(() => {
        setIsRunning(false);
        onPause();
    }, [setIsRunning, onPause]);

    const reset = useCallback(() => {
        setTime(TIMER_START_VALUE);
        setIsRunning(false);
    }, [setIsRunning, setTime]);
    
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor(time / 1000 - (minutes * 60));

    return <div className='timer'>
        <div className='timer-time'>
            <span className='timer-minutes'>
                {minutes >= 10 ? minutes : `0${minutes}`}
            </span>
            :
            <span className='timer-seconds'>
                {seconds >= 10 ? seconds : `0${seconds}`}
            </span>
        </div>
        <div className='timer-buttons'>
            {
                isRunning ? <button 
                    title='Pause'
                    onClick={pause}
                    className='timer-button'
                >
                    <i className='material-icons'>pause</i>
                </button> : <button 
                    title='Start'
                    onClick={start}
                    className='timer-button'
                >
                    <i className='material-icons'>play_arrow</i>
                </button>
            }
            {
                (isRunning || time !== TIMER_START_VALUE) && <button 
                    onClick={reset}
                    title='Reset' 
                    className='timer-button'
                >
                    <i className='material-icons'>close</i>
                </button>
            }
        </div>
    </div>;
} 

export default Timer;
