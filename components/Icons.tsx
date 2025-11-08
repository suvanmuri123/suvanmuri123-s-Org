
import React, { useRef, useEffect } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const iconRef = useRef<SVGSVGElement>(null);
    const handleMouseEnter = () => {
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({ targets: iconRef.current, rotate: 90, scale: 1.2, duration: 300, easing: 'easeOutBack' });
    };
    const handleMouseLeave = () => {
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({ targets: iconRef.current, rotate: 0, scale: 1, duration: 300, easing: 'easeOutBack' });
    };
    return (
        <svg ref={iconRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
};

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const iconRef = useRef<SVGSVGElement>(null);
    // Fix: Replaced anime.AnimeInstance with `any` due to type resolution issues.
    const animation = useRef<any | null>(null);
    const handleMouseEnter = () => {
        if (animation.current) animation.current.pause();
        // Fix: cast anime to any to resolve call signature errors.
        animation.current = (anime as any)({
            targets: iconRef.current,
            rotate: ['-10deg', '10deg', '-5deg', '5deg', '0deg'],
            duration: 400,
            easing: 'easeInOutSine'
        });
    };
    return (
        <svg ref={iconRef} onMouseEnter={handleMouseEnter} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    );
};

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const iconRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!iconRef.current) return;
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({
            targets: iconRef.current.querySelectorAll('.sparkle'),
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            duration: 1800,
            loop: true,
            easing: 'easeInOutSine',
            delay: (anime as any).stagger(300)
        });
    }, []);
    return (
        <svg ref={iconRef} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" opacity="0.5" />
            <path className="sparkle" d="M15 6l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z" />
            <path className="sparkle" d="M8 11l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z" />
        </svg>
    );
};

export const KaryaSuchiLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path id="logo-path-1" d="M85 50C85 25.1472 64.8528 5 40 5C27.6033 5 16.5111 10.1569 9.28932 18.4015" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path id="logo-path-2" d="M15 50C15 74.8528 35.1472 95 60 95C72.3967 95 83.4889 89.8431 90.7107 81.5985" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path id="logo-path-3" d="M75 50C75 30.67 59.33 15 40 15C30.3291 15 21.8453 19.3301 16.4819 26.3372" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.7"/>
        <path id="logo-path-4" d="M25 50C25 69.33 40.67 85 60 85C69.6709 85 78.1547 80.6699 83.5181 73.6628" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.7"/>
    </svg>
);

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </svg>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const iconRef = useRef<SVGSVGElement>(null);
    // Fix: cast anime to any to resolve call signature errors.
    const handleMouseEnter = () => { (anime as any)({ targets: iconRef.current, scale: 1.1, duration: 200, easing: 'easeOutSine' }); };
    // Fix: cast anime to any to resolve call signature errors.
    const handleMouseLeave = () => { (anime as any)({ targets: iconRef.current, scale: 1, duration: 200, easing: 'easeOutSine' }); };
    return (
        <svg ref={iconRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
    );
};

export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const iconRef = useRef<SVGSVGElement>(null);
    // Fix: cast anime to any to resolve call signature errors.
    const handleMouseEnter = () => { (anime as any)({ targets: iconRef.current, scale: 1.1, duration: 200, easing: 'easeOutSine' }); };
    // Fix: cast anime to any to resolve call signature errors.
    const handleMouseLeave = () => { (anime as any)({ targets: iconRef.current, scale: 1, duration: 200, easing: 'easeOutSine' }); };
    return (
        <svg ref={iconRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
    );
};

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const iconRef = useRef<SVGSVGElement>(null);
    // Fix: Replaced anime.AnimeInstance with `any` due to type resolution issues.
    const animation = useRef<any | null>(null);
    const handleMouseEnter = () => {
        if (animation.current) animation.current.pause();
        // Fix: cast anime to any to resolve call signature errors.
        animation.current = (anime as any)({
            targets: iconRef.current,
            rotate: '+=360',
            duration: 700,
            easing: 'easeInOutSine'
        });
    };
    return (
        <svg ref={iconRef} onMouseEnter={handleMouseEnter} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-3.181-4.991v4.99" />
        </svg>
    );
};

export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const iconRef = useRef<SVGSVGElement>(null);
    const handleMouseEnter = () => {
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({ targets: iconRef.current.querySelector('.logout-arrow'), translateX: 3, duration: 300, easing: 'easeOutQuad' });
    };
    const handleMouseLeave = () => {
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({ targets: iconRef.current.querySelector('.logout-arrow'), translateX: 0, duration: 300, easing: 'easeOutQuad' });
    };
    return (
        <svg ref={iconRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3h12" />
            <g className="logout-arrow">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3h12" />
            </g>
        </svg>
    );
};
