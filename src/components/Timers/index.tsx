import React, { FC, useState, useEffect, useCallback } from 'react';
import './index.scss';
import { TimerDescriptor } from '../../types';
import { getFormattedTimeFromSeconds } from '../../utils';
import Timer from '../Timer';
import Option from './Option';

export interface Props {
    onTimerCompleted: (timer: TimerDescriptor ) => void;
}

const timerOptions = [
    {
        title: '15 sec',
        duration: 15
    },
    {
        title: '20 min',
        duration: 20 * 60
    },
    {
        title: '25 min',
        duration: 25 * 60
    }
];

const Timers: FC<Props> = ({ onTimerCompleted }) => {
    const [currentTimer, setCurrentTimer] = useState<TimerDescriptor | null>(null);
    const [originalDocumentTitle] = useState(document.title);

    useEffect(() => {
        if(!currentTimer) {
            document.title = originalDocumentTitle;
            return;
        }

        const timeLeft = getFormattedTimeFromSeconds(currentTimer.remains);
        document.title = `${timeLeft.minutes}:${timeLeft.seconds} Left on your timer`;

        return () => {
            document.title = originalDocumentTitle;
        };
        
    }, [currentTimer, originalDocumentTitle]);

    useEffect(() => {
        if(currentTimer && currentTimer.isCompleted) {
            onTimerCompleted(currentTimer);
        }
    }, [currentTimer, onTimerCompleted]);

    const handleTimerOptionClick = useCallback((option) => {
        setCurrentTimer({
            duration: option.duration,
            remains: option.duration,
            isRunning: true,
            isCompleted: false
        });
    }, [setCurrentTimer]);

    const handleTimerTick = useCallback(() => {
        setCurrentTimer((ct) => {
            if (ct) {
                return ct.remains > 0 ? {
                    ...ct,
                    remains: ct.remains - 1
                } : {
                    ...ct,
                    isRunning: false,
                    isCompleted: true
                };
            }

            return ct;
        });
    }, [setCurrentTimer]);

    return <div className='timers'>
        {
            currentTimer ? <>
            {
                currentTimer.isCompleted ? <div className='timers-completion'>
                    <h4>
                        Your timer has ended. Want to start another one with the same diration?
                    </h4>
                    <div className='timers-completion-controls'>
                        <div 
                            className='timers-completion-control'
                            onClick={() => handleTimerOptionClick({
                                duration: currentTimer.duration
                            })}
                        >
                            Yep
                        </div>
                        <div 
                            className='timers-completion-control'
                            onClick={() => setCurrentTimer(null)}
                        >
                            Nope
                        </div>
                    </div>
                </div> : <Timer
                    currentTimer={currentTimer}
                    onStart={() => setCurrentTimer({
                        ...currentTimer,
                        isRunning: true
                    })}
                    onPause={() => setCurrentTimer({
                        ...currentTimer,
                        isRunning: false
                    })}
                    onTick={handleTimerTick}
                    onCancel={() => setCurrentTimer(null)}
                />
            }
            </> : <>
                <div className='timer-options'>
                    {
                        timerOptions.map((option) => (<Option
                            key={option.title}
                            title={option.title}
                            onClick={() => handleTimerOptionClick(option)}
                        />))
                    }
                </div>
                <h2 className='timers-header'>Set a timer</h2>
            </>
        }
    </div>;
};

export default Timers;
