
import React, { useEffect, useRef } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';

const LiveBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const numOrbs = 15;
    const orbs = Array.from({ length: numOrbs });

    useEffect(() => {
        if (!containerRef.current) return;

        const orbElements = containerRef.current.children;
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({
            targets: orbElements,
            translateX: () => (anime as any).random(-window.innerWidth / 2, window.innerWidth / 2),
            translateY: () => (anime as any).random(-window.innerHeight / 2, window.innerHeight / 2),
            scale: () => (anime as any).random(0.5, 2.5),
            duration: () => (anime as any).random(20000, 40000),
            delay: (anime as any).stagger(200),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
        });
    }, []);

    const colors = ['#FADADD', '#DE3163', '#FFF0F5', '#EAE1D6', '#D8D1E5'];

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-primary">
            <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
                 {orbs.map((_, i) => {
                    const size = (anime as any).random(50, 250);
                    return (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: size,
                                height: size,
                                backgroundColor: colors[i % colors.length],
                                opacity: (anime as any).random(10, 40) / 100,
                                filter: 'blur(40px)',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default LiveBackground;
