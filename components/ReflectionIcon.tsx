import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const WinIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: iconRef.current.querySelector('path'),
            scale: [1, 1.1, 1],
            rotate: ['-5deg', '5deg', '0deg'],
            duration: 2500,
            loop: true,
            easing: 'easeInOutSine',
            transformOrigin: '50% 50%',
        });
    }, []);
    return (
        <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" fill="#F8D57E" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
        </svg>
    );
};

const LessonIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: iconRef.current,
            opacity: [0.7, 1, 0.7],
            duration: 2000,
            loop: true,
            easing: 'easeInOutSine'
        });
    }, []);
    return (
         <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" fill="#F8D57E" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
        </svg>
    );
};

const SkippedIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: [iconRef.current.querySelector('.eye-left'), iconRef.current.querySelector('.eye-right')],
            translateX: ['-1px', '1px', '-1px'],
            duration: 3000,
            loop: true,
            easing: 'easeInOutSine',
            delay: anime.stagger(100),
        });
    }, []);
    return (
        <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" fill="#36454F" xmlns="http://www.w3.org/2000/svg">
             <circle className="eye-left" cx="8" cy="12" r="1.5" />
             <circle className="eye-right" cx="16" cy="12" r="1.5" />
        </svg>
    );
};

const OnMyMindIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: iconRef.current.querySelectorAll('circle'),
            translateY: -5,
            opacity: [1, 0],
            scale: [0, 1],
            duration: 2500,
            loop: true,
            easing: 'linear',
            delay: anime.stagger(500),
        });
    }, []);
    return (
        <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" fill="#A9A9A9" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5C9.24 5 7 7.24 7 10c0 2.76 2.24 5 5 5h.5c2.49 0 4.5-2.01 4.5-4.5S14.99 6 12.5 6H12z"/>
            <circle cx="10" cy="14" r="1" />
            <circle cx="12" cy="16" r="0.8" />
            <circle cx="14" cy="15" r="0.6" />
        </svg>
    );
};

const GratefulIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: iconRef.current,
            scale: [1, 1.1, 1],
            duration: 1800,
            loop: true,
            easing: 'easeInOutSine'
        });
    }, []);
    return (
        <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" fill="#DE3163" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    );
};

const ProcrastinatedIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: iconRef.current.querySelectorAll('text'),
            translateY: -4,
            opacity: [1, 0],
            duration: 3000,
            loop: true,
            easing: 'linear',
            delay: anime.stagger(700)
        });
    }, []);
    return (
        <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#A9A9A9"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#36454F"/>
            <text x="16" y="9" fontSize="4" fill="#36454F" style={{fontWeight: 'bold'}}>Z</text>
            <text x="17" y="7" fontSize="3" fill="#36454F" style={{fontWeight: 'bold'}}>z</text>
        </svg>
    );
};

const HighlightIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: iconRef.current.querySelectorAll('path:last-child'),
            opacity: [0, 1, 0],
            scale: [0, 1.2],
            duration: 1500,
            loop: true,
            easing: 'linear',
            delay: anime.stagger(300),
        });
    }, []);
    return (
        <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1.5l2.35 4.75L19.5 7l-4.25 4.15 1 5.35L12 14.25l-4.25 2.25 1-5.35L4.5 7l5.15-.75L12 1.5z" fill="#D5E8D4" stroke="#6C8E6C" strokeWidth="1"/>
            <path transform="translate(4 4)" d="M5.5 0 L 6.5 2 L 8.5 2.5 L 7 4 L 7.5 6 L 5.5 5 L 3.5 6 L 4 4 L 2.5 2.5 L 4.5 2 Z" fill="#FFFFFF" opacity="0"/>
            <path transform="translate(15 15)" d="M5.5 0 L 6.5 2 L 8.5 2.5 L 7 4 L 7.5 6 L 5.5 5 L 3.5 6 L 4 4 L 2.5 2.5 L 4.5 2 Z" fill="#FFFFFF" opacity="0" transform-origin="50% 50%"/>
        </svg>
    );
};

const GrowthIcon: React.FC = () => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        anime({
            targets: iconRef.current.querySelector('.sprout'),
            rotate: ['-10deg', '10deg'],
            duration: 3000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }, []);
    return (
        <svg ref={iconRef} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 3H3v15h18V3zM5 16V5h14v11H5z" fill="#C9C0D9"/>
            <path className="sprout" transform-origin="12px 18px" d="M12 18c-1.1 0-2-.9-2-2 0-1.1.9-2 2-2s2 .9 2 2c0 1.1-.9 2-2 2zm0-6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#6C8E6C"/>
        </svg>
    );
};


export type IconType = 'win' | 'lesson' | 'skipped' | 'onMyMind' | 'grateful' | 'procrastinated' | 'highlight' | 'growth';

const ReflectionIcon: React.FC<{ type: IconType }> = ({ type }) => {
    switch (type) {
        case 'win':
            return <WinIcon />;
        case 'lesson':
            return <LessonIcon />;
        case 'skipped':
            return <SkippedIcon />;
        case 'onMyMind':
            return <OnMyMindIcon />;
        case 'grateful':
            return <GratefulIcon />;
        case 'procrastinated':
            return <ProcrastinatedIcon />;
        case 'highlight':
            return <HighlightIcon />;
        case 'growth':
            return <GrowthIcon />;
        default:
            return null;
    }
};

export default ReflectionIcon;