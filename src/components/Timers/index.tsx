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
        title: 'half min',
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
    const [originalDocumentTitle] = useState(document.title);
    const [currentTimer, setCurrentTimer] = useState<TimerDescriptor | null>(null);

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
        
    }, [currentTimer]);

    useEffect(() => {
        if(currentTimer && currentTimer.isCompleted) {
            onTimerCompleted(currentTimer);
        }
    }, [currentTimer]);

    const handleTimerOptionClick = useCallback((option) => {
        setCurrentTimer({
            duration: option.duration,
            remains: option.duration,
            isRunning: true,
            isCompleted: false
        });
    }, [setCurrentTimer]);

    const handleTimerTick = useCallback(() => {    
        setCurrentTimer((currentTimer) => {
            return currentTimer!?.remains > 0 ? {
                ...currentTimer as TimerDescriptor,
                remains: (currentTimer as any).remains - 1
            } : {
                ...currentTimer as TimerDescriptor,
                isRunning: false,
                isCompleted: true
            }
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
