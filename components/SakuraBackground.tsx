import React from 'react';

const RealisticPetalSVG: React.FC<{ id: number, [key: string]: any }> = ({ id, ...props }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <radialGradient id={`petal-gradient-${id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.7}} />
                <stop offset="100%" style={{stopColor: '#FFB7C5', stopOpacity: 0.8}} />
            </radialGradient>
        </defs>
        <path d="M12 2C6 7 4 14 6 18C8 22 12 22 12 22C12 22 16 22 18 18C20 14 18 7 12 2Z" fill={`url(#petal-gradient-${id})`} />
    </svg>
);


const SakuraBackground: React.FC = () => {
    const numPetals = 60;
    const petals = Array.from({ length: numPetals }).map((_, i) => {
        const fallDuration = Math.random() * 15 + 10; // 10 to 25 seconds
        const swayDuration = Math.random() * 5 + 4; // 4 to 9 seconds
        const flutterDuration = Math.random() * 6 + 4; // 4 to 10 seconds
        const swayAmount = `${(Math.random() - 0.5) * 20}vw`;
        const size = Math.random() * 15 + 10; // 10px to 25px
        const opacity = Math.random() * 0.4 + 0.5; // 0.5 to 0.9
        const blur = (25 - size) / 8; // Smaller petals get more blur

        return (
            <div
                key={i}
                className="petal-container"
                style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${fallDuration}s`,
                    animationDelay: `${Math.random() * 15}s`,
                }}
            >
                <div
                    className="petal-sway"
                    style={{
                        animationDuration: `${swayDuration}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        // @ts-ignore
                        '--sway-amount': swayAmount,
                    }}
                >
                    <div
                        className="petal-flutter"
                        style={{
                           animationDuration: `${flutterDuration}s`
                        }}
                    >
                        <RealisticPetalSVG
                            id={i}
                            style={{
                                width: size,
                                height: size,
                                opacity,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                filter: `blur(${blur}px)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    });

    return <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">{petals}</div>;
};

export default SakuraBackground;