import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MultiLayerWaveProps {
    fill?: string;
    className?: string;
    flipped?: boolean;
}

const MultiLayerWave: React.FC<MultiLayerWaveProps> = ({ fill = "#228b44", className, flipped = false }) => {
    const layer1Ref = useRef<SVGGElement>(null);
    const layer2Ref = useRef<SVGGElement>(null);
    const layer3Ref = useRef<SVGGElement>(null);
    const bob1Ref = useRef<SVGGElement>(null);
    const bob2Ref = useRef<SVGGElement>(null);
    const bob3Ref = useRef<SVGGElement>(null);

    const pathData = "M0 60 C 150 -10, 250 130, 400 60 C 550 -10, 650 130, 800 60 L 800 400 L 0 400 Z";

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const tl1 = gsap.to(layer1Ref.current, {
            x: "-50%",
            duration: 18,
            repeat: -1,
            ease: "none"
        });

        const tl2 = gsap.to(layer2Ref.current, {
            x: "-50%",
            duration: 24,
            repeat: -1,
            ease: "none"
        });

        const tl3 = gsap.to(layer3Ref.current, {
            x: "-50%",
            duration: 30,
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

        const bob2 = gsap.to(bob2Ref.current, {
            y: 6,
            scaleY: 1.05,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "center bottom"
        });

        const bob3 = gsap.to(bob3Ref.current, {
            y: -5,
            scaleY: 1.03,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "center bottom"
        });

        return () => {
            tl1.kill();
            tl2.kill();
            tl3.kill();
            bob1.kill();
            bob2.kill();
            bob3.kill();
        };
    }, []);

    return (
        <div className={`relative overflow-hidden w-full h-48 ${className || ''}`} style={flipped ? { transform: 'scaleY(-1)' } : {}}>
            <svg
                viewBox="0 0 1600 200"
                preserveAspectRatio="none"
                className="absolute top-0 left-0 w-[200%] h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Layer 3 - back, lightest */}
                <g ref={bob3Ref}>
                    <g ref={layer3Ref}>
                        <path d={pathData} fill={fill} opacity="0.3" />
                        <path d={pathData} fill={fill} opacity="0.3" transform="translate(800, 0)" />
                    </g>
                </g>

                {/* Layer 2 - middle */}
                <g ref={bob2Ref}>
                    <g ref={layer2Ref}>
                        <path d={pathData} fill={fill} opacity="0.5" />
                        <path d={pathData} fill={fill} opacity="0.5" transform="translate(800, 0)" />
                    </g>
                </g>

                {/* Layer 1 - front, full opacity */}
                <g ref={bob1Ref}>
                    <g ref={layer1Ref}>
                        <path d={pathData} fill={fill} />
                        <path d={pathData} fill={fill} transform="translate(800, 0)" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default MultiLayerWave;
