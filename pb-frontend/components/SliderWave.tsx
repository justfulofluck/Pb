import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SliderWave: React.FC = () => {
    const waveRef = useRef<SVGGElement>(null);

    // Adapted path to tile seamlessly by ensuring it ends at Y=160 (matching start M0,160)
    // Replaced L1440,224 with a continuous slope C... 1440,160
    const pathD = "M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,218.7C672,224,768,192,864,154.7C960,117,1056,75,1152,85.3C1248,96,1344,160,1440,160L1440,320L0,320Z";

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Pan horizontally by exactly one full cycle (1440 viewBox units)
        const tl1 = gsap.to(waveRef.current, {
            x: -1440,
            duration: 20,
            repeat: -1,
            ease: "none"
        });

        return () => {
            tl1.kill();
        };
    }, []);

    return (
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-30 pointer-events-none">
            <svg
                className="relative block w-full h-[60px] md:h-[120px] lg:h-[180px] scale-[1.01]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0b3d2e" stopOpacity="1" />
                        <stop offset="100%" stopColor="#f2f2ec" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <g ref={waveRef}>
                    <path fill="url(#waveGradient)" d={pathD} />
                    <path fill="url(#waveGradient)" d={pathD} transform="translate(1440, 0)" />
                </g>
            </svg>
        </div>
    );
};

export default SliderWave;
