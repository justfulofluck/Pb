import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import MultiLayerWave from './MultiLayerWave';

// Responsive size scaling based on screen width
const getScale = () => {
    const w = window.innerWidth;
    if (w < 480) return 0.45;    // phone
    if (w < 768) return 0.55;    // large phone
    if (w < 1024) return 0.7;    // tablet
    return 1;                     // desktop
};

const BASE_BENEFITS = [
    { text: "NO CHOLESTROL", color: "#0081ff", shape: "heart", rotation: -15, width: 220, height: 220 },
    { text: "NO TRANS FAT", color: "#fff", textColor: "#e54d2e", shape: "drop", rotation: 25, width: 190, height: 220 },
    { text: "HEALTHY FATS", color: "#d4a373", textColor: "#432818", shape: "peanut", rotation: -10, width: 280, height: 160 },
    { text: "GLUTEN FREE", color: "#008a45", textColor: "#fff", shape: "splat", rotation: 12, width: 250, height: 220 },
    { text: "NON GMO", color: "#84cc16", textColor: "#fff", shape: "hourglass", rotation: -5, width: 190, height: 250 }
];

const BenefitHighlights: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [scale, setScale] = useState(getScale());

    // Scale benefits based on screen size
    const benefits = BASE_BENEFITS.map(b => ({
        ...b,
        width: Math.round(b.width * scale),
        height: Math.round(b.height * scale)
    }));

    useEffect(() => {
        const handleResize = () => setScale(getScale());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

        const engine = Engine.create();
        const world = engine.world;

        // Start with zero gravity (badges float in place)
        engine.gravity.y = 0;

        const width = containerRef.current.clientWidth || window.innerWidth;
        const height = containerRef.current.clientHeight || 700;

        // --- Wave-shaped ground ---
        const waveHeight = 179;
        const waveTop = height - waveHeight;

        const cubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
            const u = 1 - t;
            return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
        };

        const getWaveY = (xNorm: number) => {
            let svgY: number;
            if (xNorm <= 0.5) {
                const t = xNorm / 0.5;
                svgY = cubicBezier(t, 60, -10, 130, 60);
            } else {
                const t = (xNorm - 0.5) / 0.5;
                svgY = cubicBezier(t, 60, -10, 130, 60);
            }
            const yInWave = (svgY / 160) * waveHeight;
            return waveTop + yInWave + 40;
        };

        const groundBodies: Matter.Body[] = [];
        const segments = 60;
        for (let i = 0; i <= segments; i++) {
            const xNorm = i / segments;
            const x = xNorm * width;
            const y = getWaveY(xNorm);
            groundBodies.push(Bodies.circle(x, y, 30, { isStatic: true, friction: 0.8 }));
        }
        groundBodies.push(Bodies.rectangle(width / 2, height + 100, width * 2, 300, { isStatic: true }));

        // --- Walls ---
        const wallThickness = 80;
        const leftWall = Bodies.rectangle(-wallThickness / 2 + 1, height / 2, wallThickness, height * 3, { isStatic: true });
        const rightWall = Bodies.rectangle(width + wallThickness / 2 - 1, height / 2, wallThickness, height * 3, { isStatic: true });
        const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2 + 1, width * 2, wallThickness, { isStatic: true });

        Composite.add(world, [...groundBodies, leftWall, rightWall, ceiling]);

        // --- Badge physics bodies ---
        const badgeBodies = benefits.map((benefit, i) => {
            const x = (width / (benefits.length + 1)) * (i + 1);
            const y = 60 + (i * 40);

            const body = Bodies.rectangle(x, y, benefit.width * 0.85, benefit.height * 0.85, {
                restitution: 0.4,
                friction: 0.3,
                frictionAir: 0.015,
                angle: benefit.rotation * (Math.PI / 180),
                chamfer: { radius: 8 }
            });
            // Freeze velocity so it floats until gravity kicks in
            Body.setVelocity(body, { x: 0, y: 0 });

            return { body, benefit };
        });

        Composite.add(world, badgeBodies.map(b => b.body));

        // --- Mouse interaction (desktop) ---
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) {
            const mouse = Mouse.create(containerRef.current);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.08,
                    damping: 0.1,
                    render: { visible: false }
                }
            });
            Composite.add(world, mouseConstraint);
        } else {
            // Touch drag support for mobile
            let dragBody: Matter.Body | null = null;

            const getTouchPos = (e: TouchEvent) => {
                const rect = containerRef.current!.getBoundingClientRect();
                const touch = e.touches[0] || e.changedTouches[0];
                return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
            };

            const onTouchStart = (e: TouchEvent) => {
                const pos = getTouchPos(e);
                // Find closest body to touch point
                for (const { body } of badgeBodies) {
                    const dx = body.position.x - pos.x;
                    const dy = body.position.y - pos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        dragBody = body;
                        break;
                    }
                }
            };

            const onTouchMove = (e: TouchEvent) => {
                if (!dragBody) return;
                e.preventDefault();
                const pos = getTouchPos(e);
                Body.setPosition(dragBody, pos);
                Body.setVelocity(dragBody, { x: 0, y: 0 });
            };

            const onTouchEnd = () => {
                dragBody = null;
            };

            containerRef.current.addEventListener('touchstart', onTouchStart, { passive: true });
            containerRef.current.addEventListener('touchmove', onTouchMove, { passive: false });
            containerRef.current.addEventListener('touchend', onTouchEnd, { passive: true });

            // Mark that we have touch listeners to clean up
            hasTouchListeners = true;
            touchCleanup = () => {
                if (containerRef.current) {
                    containerRef.current.removeEventListener('touchstart', onTouchStart);
                    containerRef.current.removeEventListener('touchmove', onTouchMove);
                    containerRef.current.removeEventListener('touchend', onTouchEnd);
                }
            };
        }

        // Clamp velocity
        Events.on(engine, 'beforeUpdate', () => {
            badgeBodies.forEach(({ body }) => {
                const maxSpeed = 15;
                if (body.speed > maxSpeed) {
                    Body.setSpeed(body, maxSpeed);
                }
            });
        });

        // Sync physics to DOM
        Events.on(engine, 'afterUpdate', () => {
            badgeBodies.forEach(({ body }, i) => {
                const ref = badgeRefs.current[i];
                if (ref) {
                    const x = body.position.x - (benefits[i].width / 2);
                    const y = body.position.y - (benefits[i].height / 2);
                    ref.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
                }
            });
        });

        const runner = Runner.create();
        Runner.run(runner, engine);

        // --- 3 SECOND DELAY: then enable gravity ---
        const dropTimeout = setTimeout(() => {
            engine.gravity.y = 1;
            // Give each badge a tiny nudge so they start moving
            badgeBodies.forEach(({ body }) => {
                Body.applyForce(body, body.position, { x: 0, y: 0.01 });
            });
        }, 3000);

        // --- GYROSCOPE support (mobile: tilt device to move gravity) ---
        let gyroHandler: ((e: DeviceOrientationEvent) => void) | null = null;
        let gyroTimeoutRef: ReturnType<typeof setTimeout> | null = null;
        let hasTouchListeners = false;
        let touchCleanup: (() => void) | null = null;

        if (isTouchDevice) {
            gyroHandler = (e: DeviceOrientationEvent) => {
                const gamma = e.gamma || 0; // left-right tilt (-90..90)
                const beta = e.beta || 0;   // front-back tilt (-180..180)

                // Map tilt to gravity direction
                // gamma: positive = tilted right, negative = tilted left
                // beta: ~90 is upright, <90 is tilted forward, >90 is tilted back
                const gravityX = gamma / 30; // Normalize, cap at ~3
                const gravityY = Math.max(0.2, (beta - 20) / 40); // Always some downward pull

                engine.gravity.x = Math.max(-3, Math.min(3, gravityX));
                engine.gravity.y = Math.max(0.2, Math.min(3, gravityY));
            };

            // Request permission on iOS 13+
            const requestGyro = async () => {
                if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                    try {
                        const perm = await (DeviceOrientationEvent as any).requestPermission();
                        if (perm === 'granted') {
                            window.addEventListener('deviceorientation', gyroHandler!);
                        }
                    } catch {
                        // Permission denied, fallback to no gyro
                    }
                } else {
                    window.addEventListener('deviceorientation', gyroHandler!);
                }
            };

            // Only start gyro after the 3s drop delay
            gyroTimeoutRef = setTimeout(requestGyro, 3000);
        }

        // Shared cleanup for all cases
        return () => {
            // Clean up touch listeners if present
            if (hasTouchListeners && touchCleanup) {
                touchCleanup();
            }
            clearTimeout(dropTimeout);
            if (gyroTimeoutRef) {
                clearTimeout(gyroTimeoutRef);
            }
            if (gyroHandler) {
                window.removeEventListener('deviceorientation', gyroHandler);
            }
            Runner.stop(runner);
            Engine.clear(engine);
        };
    }, [scale]);

    const renderShape = (benefit: typeof BASE_BENEFITS[0]) => {
        switch (benefit.shape) {
            case 'heart':
                return (
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" fill={benefit.color}>
                        <path d="M100 180 C100 180 20 140 20 80 C20 40 60 20 100 60 C140 20 180 40 180 80 C180 140 100 180 100 180 Z" stroke="white" strokeWidth="4" />
                    </svg>
                );
            case 'drop':
                return (
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" fill={benefit.color}>
                        <path d="M100 20 C100 20 30 100 30 140 C30 180 100 180 170 140 C170 100 100 20 100 20 Z" stroke="#e54d2e" strokeWidth="4" />
                    </svg>
                );
            case 'peanut':
                return (
                    <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-xl" fill={benefit.color}>
                        <path d="M50 75 C50 30 100 20 150 50 C200 20 250 30 250 75 C250 120 200 130 150 100 C100 130 50 120 50 75 Z" stroke="#432818" strokeWidth="4" />
                    </svg>
                );
            case 'splat':
                return (
                    <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-xl" fill={benefit.color}>
                        <path d="M20 80 Q20 40 60 40 Q80 20 100 40 Q120 20 140 40 Q180 40 180 80 Q180 120 140 120 Q120 140 100 120 Q80 140 60 120 Q20 120 20 80 Z" stroke="#84cc16" strokeWidth="4" />
                    </svg>
                );
            case 'hourglass':
                return (
                    <svg viewBox="0 0 150 200" className="w-full h-full drop-shadow-xl" fill={benefit.color}>
                        <path d="M20 30 Q75 10 130 30 L 110 90 Q75 110 40 90 Z M 40 110 Q75 90 110 110 L 130 170 Q75 190 20 170 Z" stroke="white" strokeWidth="4" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Responsive section height
    const sectionHeight = scale < 0.6 ? '450px' : scale < 0.8 ? '550px' : '700px';
    const fontSize = scale < 0.6 ? '1rem' : scale < 0.8 ? '1.3rem' : '1.75rem';

    return (
        <section
            className="bg-whiteboard texture-overlay texture-speckles"
            style={{ position: 'relative', overflow: 'hidden', minHeight: sectionHeight, display: 'flex', alignItems: 'center' }}
        >
            {/* Physics container */}
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden',
                    zIndex: 10,
                    touchAction: 'none' // Prevents scroll interference on mobile drag
                }}
            >
                {benefits.map((benefit, i) => (
                    <div
                        key={i}
                        ref={el => badgeRefs.current[i] = el}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: benefit.width,
                            height: benefit.height,
                            willChange: 'transform',
                            cursor: 'grab',
                        }}
                    >
                        <div style={{ position: 'absolute', inset: 0 }}>
                            {renderShape(benefit)}
                        </div>
                        <div style={{
                            position: 'relative',
                            zIndex: 10,
                            textAlign: 'center',
                            padding: '0 16px',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%'
                        }}>
                            <span style={{
                                display: 'block',
                                fontWeight: 900,
                                fontSize: fontSize,
                                lineHeight: 1.1,
                                letterSpacing: '-0.05em',
                                color: benefit.textColor || 'white'
                            }}>
                                {benefit.text}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Wave */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                pointerEvents: 'none',
                zIndex: 5
            }}>
                <MultiLayerWave fill="#f9c45a" />
            </div>
        </section>
    );
};

export default BenefitHighlights;
