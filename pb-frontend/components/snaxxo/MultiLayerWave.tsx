import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface MultiLayerWaveProps {
    fill?: string;
    className?: string;
    flipped?: boolean;
}

const MultiLayerWave: React.FC<MultiLayerWaveProps> = ({ fill = "#0b3d2e", className, flipped = false }) => {
    const layer1Ref = useRef<SVGGElement>(null);
    const bob1Ref = useRef<SVGGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(true);

    const pathData = "M0 100 C 150 20, 250 180, 400 100 C 550 20, 650 180, 800 100 L 800 500 L 0 500 Z";

    // Track visibility - pause animation when off-screen
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Skip animations if not in view to save CPU
        if (!isInView) return;

        const tl1 = gsap.to(layer1Ref.current, {
            x: -800,
            duration: 18,
            repeat: -1,
            ease: "none"
        });

        // Bobbing / scaling animations for dynamic wave feel
        const bob1 = gsap.to(bob1Ref.current, {
            y: -8,
            scaleY: 1.08,
            skewX: 1.5,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "center bottom"
        });

        return () => {
            tl1.kill();
            bob1.kill();
        };
    }, [isInView]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden w-full h-full ${className || ''}`} style={flipped ? { transform: 'scaleY(-1)' } : {}}>
            <svg
                viewBox="0 0 1600 240"
                preserveAspectRatio="none"
                className="absolute top-0 left-0 w-[400%] md:w-[200%] h-full pointer-events-none overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Single Layer - sharp and clean */}
                <g ref={bob1Ref}>
                    <g ref={layer1Ref}>
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <path key={i} d={pathData} fill={fill} stroke={fill} strokeWidth="2" transform={`translate(${i * 800}, 0)`} />
                        ))}
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default MultiLayerWave;
