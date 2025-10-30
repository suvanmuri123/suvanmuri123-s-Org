import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const RealisticPetalSVG: React.FC<{ id: number, [key: string]: any }> = ({ id, ...props }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <radialGradient id={`petal-gradient-explosion-${id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#FFB7C5', stopOpacity: 0.9}} />
            </radialGradient>
        </defs>
        <path d="M12 2C6 7 4 14 6 18C8 22 12 22 12 22C12 22 16 22 18 18C20 14 18 7 12 2Z" fill={`url(#petal-gradient-explosion-${id})`} />
    </svg>
);


const SakuraExplosion: React.FC = () => {
    const explosionRef = useRef<HTMLDivElement>(null);
    const numPetals = 100;

    useEffect(() => {
        if (!explosionRef.current) return;

        const petals = explosionRef.current.children;
        anime.set(petals, {
            opacity: 1,
            scale: 0,
        });

        anime({
            targets: petals,
            translateX: () => anime.random(-window.innerWidth / 1.5, window.innerWidth / 1.5),
            translateY: () => anime.random(-window.innerHeight / 1.5, window.innerHeight / 1.5),
            scale: () => anime.random(1.5, 3.5),
            rotate: () => anime.random(-720, 720),
            opacity: [1, 0],
            duration: 3000,
            delay: anime.stagger(15),
            easing: 'easeOutExpo',
        });
    }, []);

    return (
        <div ref={explosionRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            {Array.from({ length: numPetals }).map((_, i) => (
                <div key={i} className="absolute">
                     <RealisticPetalSVG
                        id={i}
                        style={{
                           width: anime.random(20, 40),
                           height: 'auto',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default SakuraExplosion;