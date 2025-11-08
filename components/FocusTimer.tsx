
import React, { useEffect, useRef } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';
import { PlayIcon, PauseIcon, ArrowPathIcon } from './Icons';
import MochiAnimation from './MochiAnimation';

interface FocusTimerProps {
    timeRemaining: number;
    isActive: boolean;
    isBreak: boolean;
    mochiCount: number;
    toggleTimer: () => void;
    resetTimer: () => void;
    totalDuration: number;
}

const FocusTimer: React.FC<FocusTimerProps> = ({
    timeRemaining,
    isActive,
    isBreak,
    mochiCount,
    toggleTimer,
    resetTimer,
    totalDuration
}) => {
    const progressRef = useRef<SVGCircleElement>(null);
    const dialRef = useRef<HTMLButtonElement>(null);
    const resetRef = useRef<HTMLButtonElement>(null);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);
    
    useEffect(() => {
        const progress = (totalDuration - timeRemaining) / totalDuration;
        const circumference = 2 * Math.PI * 45; // 2 * pi * r

        if (progressRef.current) {
            // Fix: cast anime to any to resolve call signature errors.
            (anime as any)({
                targets: progressRef.current,
                strokeDashoffset: circumference * (1 - progress),
                easing: 'linear',
                duration: 1000 // Animate over 1s to smooth out the tick
            });
        }
    }, [timeRemaining, totalDuration]);

    const handleToggle = () => {
        if (dialRef.current) {
            // Fix: cast anime to any to resolve call signature errors.
            (anime as any)({
                targets: dialRef.current,
                scale: [1, 0.95, 1],
                duration: 300,
                easing: 'easeInOutQuad'
            });
        }
        toggleTimer();
    };

    const handleReset = () => {
        if (resetRef.current) {
            // Fix: cast anime to any to resolve call signature errors.
            (anime as any)({
                targets: resetRef.current,
                scale: [1, 0.95, 1],
                duration: 300,
                easing: 'easeInOutQuad'
            });
        }
        resetTimer();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const circumference = 2 * Math.PI * 45;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-3xl font-bold mb-6 text-text-primary">Focus Timer</h2>
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-accent" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        ref={progressRef}
                        className="text-highlight"
                        strokeWidth="7"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-5xl sm:text-6xl font-bold text-text-primary tabular-nums">{formatTime(timeRemaining)}</span>
                    <span className="text-lg text-text-secondary mt-2">{isBreak ? 'Break Time' : 'Focus Time'}</span>
                </div>
                <MochiAnimation isActive={isActive} count={mochiCount} />
            </div>
            <div className="flex items-center space-x-6 mt-8">
                <button ref={dialRef} onClick={handleToggle} className="flex items-center justify-center w-24 h-24 bg-highlight rounded-full text-white hover:opacity-90 transition-opacity shadow-lg focus:outline-none">
                    {isActive ? <PauseIcon className="w-10 h-10"/> : <PlayIcon className="w-10 h-10 ml-1"/>}
                </button>
                <button ref={resetRef} onClick={handleReset} className="flex items-center justify-center w-16 h-16 bg-white rounded-full text-text-secondary hover:bg-accent transition-colors shadow-lg focus:outline-none">
                    <ArrowPathIcon className="w-7 h-7"/>
                </button>
            </div>
        </div>
    );
};

export default FocusTimer;
