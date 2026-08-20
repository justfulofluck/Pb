import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface MultiLayerWaveProps {
    fill?: string;
    className?: string;
    flipped?: boolean;
    inverseBg?: string;
}

const MultiLayerWave: React.FC<MultiLayerWaveProps> = ({ fill = "#0b3d2e", className, flipped = false, inverseBg }) => {
    const layer1Ref = useRef<SVGGElement>(null);
    const bob1Ref = useRef<SVGGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(true);

    const pathData = "M0 100 C 150 20, 250 180, 400 100 C 550 20, 650 180, 800 100 L 800 500 L 0 500 Z";
    const inversePathData = "M0 0 L 800 0 L 800 100 C 650 180, 550 20, 400 100 C 250 180, 150 20, 0 100 Z";

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
                <defs>
                    <pattern id="noisePattern" patternUnits="userSpaceOnUse" width="400" height="400">
                        <image href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E" width="400" height="400" preserveAspectRatio="none" />
                    </pattern>
                </defs>
                {/* Single Layer - sharp and clean */}
                <g ref={bob1Ref}>
                    <g ref={layer1Ref}>
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <g key={i} transform={`translate(${i * 800}, 0)`}>
                                {inverseBg ? (
                                    <path d={inversePathData} fill={inverseBg} />
                                ) : (
                                    <>
                                        <path d={pathData} fill={fill} stroke={fill} strokeWidth="2" />
                                        <path d={pathData} fill="url(#noisePattern)" style={{ mixBlendMode: 'overlay' }} />
                                    </>
                                )}
                            </g>
                        ))}
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default MultiLayerWave;
