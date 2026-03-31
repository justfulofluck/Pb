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

    return null;
};

export default SliderWave;
