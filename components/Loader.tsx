
import React, { useEffect, useRef } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';
import { KaryaSuchiLogo } from './Icons.tsx';
import SakuraExplosion from './SakuraExplosion.tsx';

const Loader: React.FC = () => {
    const loaderRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playPopSound = (pitch: number) => {
        if (!audioContextRef.current) {
            try {
                // Lazily create AudioContext
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.");
                return;
            }
        }
        const audioContext = audioContextRef.current;

        // If context is suspended (due to autoplay policies), try to resume it.
        // Sound will not play this time, but might on subsequent interactions if resume is successful.
        if (audioContext.state !== 'running') {
            audioContext.resume().catch(() => {}); // Silently ignore resume errors
            return;
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01); // A bit louder
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

        oscillator.type = 'triangle'; // A bit sharper than sine
        oscillator.frequency.setValueAtTime(pitch, now);
        oscillator.frequency.exponentialRampToValueAtTime(pitch * 0.5, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    };

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
                begin: () => playPopSound(440), // A4
            }, '+=100')
            .add({
                targets: '#logo-path-2',
                // Fix: cast anime to any to resolve property access errors.
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                duration: 500,
                begin: () => playPopSound(554.37), // C#5
            }, '-=200')
            .add({
                targets: '#logo-path-3',
                // Fix: cast anime to any to resolve property access errors.
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                duration: 400,
                easing: 'easeInOutQuad',
                begin: () => playPopSound(659.25), // E5
            }, '-=300')
            .add({
                targets: '#logo-path-4',
                // Fix: cast anime to any to resolve property access errors.
                strokeDashoffset: [(anime as any).setDashoffset, 0],
                duration: 400,
                easing: 'easeInOutQuad',
                begin: () => playPopSound(880), // A5
            }, '-=200')
            .add({
                targets: '.loader-title',
                opacity: 1,
                translateY: 0,
                duration: 500,
                begin: () => playPopSound(523.25), // C5
            }, '-=100')
            .add({
                targets: '.loader-tagline',
                opacity: 1,
                translateY: 0,
                duration: 500,
                begin: () => playPopSound(698.46), // F5
            }, '-=300')
            .add({
                targets: ['.loader-logo', '.loader-title', '.loader-tagline'],
                opacity: 0,
                duration: 1500,
                delay: 500,
                easing: 'easeInQuad',
            });
        
        // Cleanup AudioContext on component unmount
        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };

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