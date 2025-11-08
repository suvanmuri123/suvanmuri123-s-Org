
import React, { useEffect, useRef } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';
import { Mood, MoodValue } from '../types';

const MascotSVG: React.FC = () => (
    <svg width="100" height="100" viewBox="-50 -50 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="mascot-body" transform="translate(0, 0) scale(1)">
            <path d="M-37.5 12.5C-37.5 -13.425 0 -37.5 25 -37.5C50 -37.5 62.5 -13.425 62.5 12.5C62.5 38.425 38.425 62.5 12.5 62.5C-13.425 62.5 -37.5 38.425 -37.5 12.5Z" transform="translate(-12.5, -12.5)" fill="#FADADD" stroke="#DE3163" strokeWidth="3"/>
        </g>
        
        {/* -- Eyes -- */}
        <g id="mascot-eyes-love" opacity="0">
            <path d="M-15 0 L -5 0 M -10 -5 L -10 5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" transform="translate(-10 0) rotate(45)" />
            <path d="M-15 0 L -5 0 M -10 -5 L -10 5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" transform="translate(10 0) rotate(45)" />
        </g>
        <g id="mascot-eyes-happy" opacity="0">
            <path d="M-5 -2.5 C-2.5 2.5, 2.5 2.5, 5 -2.5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" transform="translate(-10, 0)"/>
            <path d="M-5 -2.5 C-2.5 2.5, 2.5 2.5, 5 -2.5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" transform="translate(10, 0)"/>
        </g>
        <g id="mascot-eyes-neutral" opacity="0">
            <circle cx="-10" cy="0" r="2.5" fill="#36454F"/>
            <circle cx="10" cy="0" r="2.5" fill="#36454F"/>
        </g>
        <g id="mascot-eyes-sad" opacity="0">
            <path d="M-5 2.5 C-2.5 -2.5, 2.5 -2.5, 5 2.5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" transform="translate(-10, 0)"/>
            <path d="M-5 2.5 C-2.5 -2.5, 2.5 -2.5, 5 2.5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" transform="translate(10, 0)"/>
        </g>
        <g id="mascot-eyes-angry" opacity="0">
            <path d="M-15 -5 L -5 5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" transform="translate(-5 0)" />
            <path d="M5 -5 L 15 5" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" transform="translate(5 0)" />
        </g>

        {/* -- Mouths -- */}
        <g id="mascot-mouth-love-happy" opacity="0">
            <path d="M-10 15 C 0 25, 10 25, 20 15" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        <g id="mascot-mouth-smile" opacity="0">
            <path d="M-8 15 C 0 20, 8 20, 16 15" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        <g id="mascot-mouth-neutral" opacity="0">
            <path d="M-10 18 L 10 18" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        <g id="mascot-mouth-sad-angry" opacity="0">
            <path d="M-10 20 C 0 10, 10 10, 20 20" stroke="#36454F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
    </svg>
);

interface MoodMascotProps {
  mood?: MoodValue;
}

const MoodMascot: React.FC<MoodMascotProps> = ({ mood = '😐' }) => {
    const mascotRef = useRef<HTMLDivElement>(null);
    // Fix: Replaced anime.AnimeTimelineInstance with `any` due to type resolution issues.
    const animationInstance = useRef<any | null>(null);

    useEffect(() => {
        if (animationInstance.current) {
            animationInstance.current.pause();
        }
        // Fix: cast anime to any to resolve property access errors.
        (anime as any).remove(mascotRef.current);

        const allParts = ['#mascot-eyes-love', '#mascot-eyes-happy', '#mascot-eyes-neutral', '#mascot-eyes-sad', '#mascot-eyes-angry', '#mascot-mouth-love-happy', '#mascot-mouth-smile', '#mascot-mouth-neutral', '#mascot-mouth-sad-angry'];
        
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any).set(allParts, { opacity: 0 });

        let eyesToShow = '#mascot-eyes-neutral';
        let mouthToShow = '#mascot-mouth-neutral';
        // Fix: Replaced anime.AnimeParams with `any` due to type resolution issues.
        let animationProps: any = {
            translateY: ['-3px', '3px'],
            duration: 2500,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true
        };

        switch (mood) {
            case '😍':
                eyesToShow = '#mascot-eyes-love';
                mouthToShow = '#mascot-mouth-love-happy';
                animationProps = {
                    scale: [1, 1.05, 1],
                    translateY: ['-8px', '0px', '-8px'],
                    rotate: ['-5deg', '5deg'],
                    duration: 1200, easing: 'easeInOutSine', direction: 'alternate', loop: true
                };
                break;
            case '😊':
                eyesToShow = '#mascot-eyes-happy';
                mouthToShow = '#mascot-mouth-love-happy';
                animationProps = {
                    translateY: ['-6px', '6px'],
                    rotate: ['-3deg', '3deg'],
                    duration: 1800, easing: 'easeInOutSine', direction: 'alternate', loop: true
                };
                break;
            case '🙂':
                 eyesToShow = '#mascot-eyes-neutral';
                 mouthToShow = '#mascot-mouth-smile';
                 animationProps = {
                    translateY: ['-4px', '4px'],
                    scale: [1, 1.02, 1],
                    duration: 2200, easing: 'easeInOutSine', direction: 'alternate', loop: true
                 };
                 break;
            case '😐':
                // default is neutral
                break;
            case '😟':
                eyesToShow = '#mascot-eyes-sad';
                mouthToShow = '#mascot-mouth-sad-angry';
                 animationProps = {
                    translateY: ['0px', '5px', '0px'],
                    scaleY: [1, 0.98, 1],
                    duration: 3000, easing: 'easeInOutSine', loop: true
                };
                break;
            case '😠':
                eyesToShow = '#mascot-eyes-angry';
                mouthToShow = '#mascot-mouth-sad-angry';
                 animationProps = {
                    translateX: ['-2px', '2px'],
                    duration: 150, easing: 'easeInOutSine', direction: 'alternate', loop: true
                };
                break;
        }
        
        // Fix: cast anime to any to resolve property access errors.
        const timeline = (anime as any).timeline();
        timeline.add({
            targets: mascotRef.current,
            scale: [1, 0.9, 1],
            duration: 300,
            easing: 'spring(1, 80, 10, 0)'
        })
        .add({
            targets: [eyesToShow, mouthToShow],
            opacity: 1,
            duration: 200,
            easing: 'linear'
        }, '-=200').add({
            targets: mascotRef.current,
            ...animationProps
        });

        animationInstance.current = timeline;

        return () => {
            if (animationInstance.current) {
                animationInstance.current.pause();
            }
        };
    }, [mood]);

    return (
        <div ref={mascotRef} className="flex flex-col items-center justify-center">
            <MascotSVG />
            <p className="text-text-secondary/80 mt-2 text-center text-xs hidden sm:block">Koko, your mood mascot!</p>
        </div>
    );
};

export default MoodMascot;
