
import React, { useEffect, useRef } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';
import { KaryaSuchiLogo } from './Icons';
import SakuraExplosion from './SakuraExplosion';

const Loader: React.FC = () => {
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fix: cast anime to any to resolve property access errors.
        const timeline = (anime as any).timeline({
            easing: 'easeInOutSine',
        });

        // Set initial states
        // Fix: cast anime to any to resolve property access errors.
        (anime as any).set(['#logo-path-1', '#logo-path-2', '#logo-path-3', '#logo-path-4'], {
             strokeDashoffset: (anime as any).setDashoffset,
             opacity: 1
        });
        // Fix: cast anime to any to resolve property access errors.
        (anime as any).set(['.loader-title', '.loader-tagline', '.loader-logo'], {
            opacity: 0,
        });
        // Fix: cast anime to any to resolve property access errors.
        (anime as any).set('.loader-title, .loader-tagline', {
            translateY: 20
        });

        timeline
            .add({
                targets: '.loader-logo',
                opacity: 1,
                duration: 200
            })
            .add({
                targets: '#logo-path-1',
                // Fix: cast anime to any to resolve property access errors.
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                duration: 500,
            }, '+=100')
            .add({
                targets: '#logo-path-2',
                // Fix: cast anime to any to resolve property access errors.
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                duration: 500,
            }, '-=200')
            .add({
                targets: '#logo-path-3',
                // Fix: cast anime to any to resolve property access errors.
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                duration: 400,
                easing: 'easeInOutQuad',
            }, '-=300')
            .add({
                targets: '#logo-path-4',
                // Fix: cast anime to any to resolve property access errors.
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                duration: 400,
                easing: 'easeInOutQuad',
            }, '-=200')
            .add({
                targets: '.loader-title',
                opacity: 1,
                translateY: 0,
                duration: 500,
            }, '-=100')
            .add({
                targets: '.loader-tagline',
                opacity: 1,
                translateY: 0,
                duration: 500,
            }, '-=300')
            .add({
                targets: ['.loader-logo', '.loader-title', '.loader-tagline'],
                opacity: 0,
                duration: 1500,
                delay: 500,
                easing: 'easeInQuad',
            });

    }, []);

    return (
        <div ref={loaderRef} className="flex flex-col items-center justify-center h-screen bg-primary overflow-hidden">
            <SakuraExplosion />
            <div className="loader-logo">
                <KaryaSuchiLogo className="w-24 h-24 text-highlight"/>
            </div>
            <h1 className="loader-title text-4xl font-bold text-text-primary mt-4">KaryaSuchi</h1>
            <p className="loader-tagline text-md text-text-secondary mt-2">Tasks made easy, life made clear</p>
        </div>
    );
};

export default Loader;
