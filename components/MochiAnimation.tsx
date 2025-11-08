

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const MochiSVG: React.FC = () => (
    <svg width="40" height="40" viewBox="-20 -20 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="mochi-character">
            <path d="M-15 5C-15 -5.37 0 -15 10 -15C20 -15 25 -5.37 25 5C25 15.37 15.37 25 5 25C-5.37 25 -15 15.37 -15 5Z" transform="translate(-5, -5)" fill="#FADADD" stroke="#DE3163" strokeWidth="2"/>
            <g className="mochi-eyes-open">
                <circle cx="0" cy="0" r="1.5" fill="#36454F"/>
                <circle cx="8" cy="0" r="1.5" fill="#36454F"/>
            </g>
            <g className="mochi-eyes-sleep" opacity="0">
                 <path d="M-2 -1 C-1 1, 1 1, 2 -1" stroke="#36454F" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                 <path d="M6 -1 C7 1, 9 1, 10 -1" stroke="#36454F" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </g>
        </g>
    </svg>
);

interface MochiAnimationProps {
    isActive: boolean;
    count: number;
}

const MochiAnimation: React.FC<MochiAnimationProps> = ({ isActive, count }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const goToSleep = () => {
        anime.remove('.mochi-instance');

        anime({
            targets: '.mochi-instance',
            translateX: () => anime.random(-40, 40),
            translateY: () => 58 + anime.random(-5, 5),
            rotate: 0,
            scale: 1,
            duration: 800,
            delay: anime.stagger(50),
            easing: 'easeOutQuint',
            begin: () => {
                anime({ targets: '.mochi-eyes-open', opacity: 0, duration: 200, delay: anime.stagger(50, {start: 200}) });
                anime({ targets: '.mochi-eyes-sleep', opacity: 1, duration: 200, delay: anime.stagger(50, {start: 200}) });
            },
            complete: () => {
                anime({
                    targets: '.mochi-instance',
                    scale: [1, 0.98, 1.01, 1],
                    duration: 2500,
                    easing: 'easeInOutSine',
                    loop: true,
                    direction: 'alternate',
                    delay: anime.stagger(150),
                });
            }
        });
    };

    const wakeUpAndPlay = () => {
        anime.remove('.mochi-instance');
        const path = anime.path('#orbit-path');

        anime({
            targets: '.mochi-instance',
            scale: () => [0, anime.random(8, 12) / 10], // Random final size
            rotate: () => anime.random(-20, 20),
            delay: anime.stagger(100),
            duration: 700,
            easing: 'spring(1, 80, 10, 0)',
             begin: () => {
                anime({ targets: '.mochi-eyes-sleep', opacity: 0, duration: 50, easing: 'linear' });
                anime({ targets: '.mochi-eyes-open', opacity: 1, duration: 50, easing: 'linear' });
            },
            complete: () => {
                anime({
                    targets: '.mochi-instance',
                    translateX: path('x'),
                    translateY: path('y'),
                    rotate: path('angle'),
                    easing: 'easeInOutSine',
                    duration: () => anime.random(10000, 18000),
                    loop: true,
                    delay: anime.stagger(200),
                });
            }
        });
    };

    useEffect(() => {
        // A short delay to allow React to render new mochis before animating them
        const timeoutId = setTimeout(() => {
            if (isActive) {
                wakeUpAndPlay();
            } else {
                goToSleep();
            }
        }, 50);

        return () => {
            clearTimeout(timeoutId);
            anime.remove('.mochi-instance');
        };
    }, [isActive, count]);
    
    const mochis = Array.from({ length: count });

    return (
        <div ref={containerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="absolute w-full h-full" viewBox="-65 -65 130 130">
                <path id="orbit-path" d="M0 -58 A 58 58 0 1 1 -0.01 -58 Z" fill="none" stroke="none" />
            </svg>
            {mochis.map((_, i) => (
                 <div key={i} className="mochi-instance absolute">
                    <MochiSVG />
                </div>
            ))}
        </div>
    );
};

export default MochiAnimation;