import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface SnaxxoWaveProps {
    className?: string;
    fill?: string;
}

const SnaxxoWave: React.FC<SnaxxoWaveProps> = ({ className, fill = "#FF0000" }) => {
    const groupRef = useRef<SVGGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(true);
    const timelineRef = useRef<gsap.core.Tween | null>(null);

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
        const group = groupRef.current;
        if (!group) return;
        // Skip if not in view to save CPU
        if (!isInView) {
            if (timelineRef.current) {
                timelineRef.current.pause();
            }
            return;
        }

        // The user reference provided a specific starting matrix: matrix(1,0,0,1,215.17300415039062,33.5260009765625)
        // This dictates the starting position.
        // The wave period is 360. To loop seamlessly moving left (standard wave flow), 
        // we animate x from startX to startX - 360.

        const startX = 69.0991;
        const startY = 33.5260009765625;

        // Set initial position
        gsap.set(groupRef.current, { x: startX, y: startY });

        // Animate x by -360 units for a full loop
        timelineRef.current = gsap.to(groupRef.current, {
            x: startX - 360,
            duration: 4, // Adjust speed as needed (was 4s)
            ease: "none",
            repeat: -1
        });

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
                timelineRef.current = null;
            }
        };
    }, [isInView]);

    return (
        <div ref={containerRef} className={`wave-lottie-animation ${className || ''}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 375 36"
                preserveAspectRatio="xMidYMid meet"
                style={{ width: '100%', height: '100%' }}
            >
                <g ref={groupRef}>
                    <path
                        fill={fill}
                        fillOpacity="1"
                        d="M-360,-20.416000366210938 C-390,-25.82699966430664 -420,-25.82699966430664 -450,-20.416000366210938 -450,-20.416000366210938 -450,24.474000930786133 -450,24.474000930786133 C-450,24.474000930786133 450,24.474000930786133 450,24.474000930786133 C450,24.474000930786133 450,-20.416000366210938 450,-20.416000366210938 C420,-15.005000114440918 390,-15.005000114440918 360,-20.416000366210938 C330,-25.82699966430664 300,-25.82699966430664 270,-20.416000366210938 C240,-15.005000114440918 210,-15.005000114440918 180,-20.416000366210938 C150,-25.82699966430664 120,-25.82699966430664 90,-20.416000366210938 C60,-15.005000114440918 30,-15.005000114440918 0,-20.416000366210938 C-30,-25.82699966430664 -60,-25.82699966430664 -90,-20.416000366210938 C-120,-15.005000114440918 -150,-15.005000114440918 -180,-20.416000366210938 C-210,-25.82699966430664 -240,-25.82699966430664 -270,-20.416000366210938 C-300,-15.005000114440918 -330,-15.005000114440918 -360,-20.416000366210938z"
                    />
                    <path
                        fill={fill}
                        fillOpacity="1"
                        transform="translate(360, 0)"
                        d="M-360,-20.416000366210938 C-390,-25.82699966430664 -420,-25.82699966430664 -450,-20.416000366210938 -450,-20.416000366210938 -450,24.474000930786133 -450,24.474000930786133 C-450,24.474000930786133 450,24.474000930786133 450,24.474000930786133 C450,24.474000930786133 450,-20.416000366210938 450,-20.416000366210938 C420,-15.005000114440918 390,-15.005000114440918 360,-20.416000366210938 C330,-25.82699966430664 300,-25.82699966430664 270,-20.416000366210938 C240,-15.005000114440918 210,-15.005000114440918 180,-20.416000366210938 C150,-25.82699966430664 120,-25.82699966430664 90,-20.416000366210938 C60,-15.005000114440918 30,-15.005000114440918 0,-20.416000366210938 C-30,-25.82699966430664 -60,-25.82699966430664 -90,-20.416000366210938 C-120,-15.005000114440918 -150,-15.005000114440918 -180,-20.416000366210938 C-210,-25.82699966430664 -240,-25.82699966430664 -270,-20.416000366210938 C-300,-15.005000114440918 -330,-15.005000114440918 -360,-20.416000366210938z"
                    />
                </g>
            </svg>
        </div>
    );
};

export default SnaxxoWave;
