
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSlide } from '../types';

const DEMO_SLIDES: HeroSlide[] = [
    {
        id: '1',
        category: '01',
        headline: 'CREAMY PEANUT BUTTER',
        image: '/assets/heroslider2/pb-peanut-jar.png',
        cta: 'SPREAD THE LOVE',
        bgColor: '#fff7ed',
        accentColor: '#c2410c',
        blobColor: '#fb923c',
        backgroundImage: '/assets/heroslider2/pb-peanut-bg.png',
        isActive: true,
        order: 1
    },
    {
        id: '2',
        category: '02',
        headline: 'ROASTED ALMOND BUTTER',
        image: '/assets/heroslider2/pb-almond-jar.png',
        cta: 'GO NUTS FOR ALMOND',
        bgColor: '#fefce8',
        accentColor: '#854d0e',
        blobColor: '#eab308',
        backgroundImage: '/assets/heroslider2/pb-almond-bg.png',
        isActive: true,
        order: 2
    },
    {
        id: '3',
        category: '03',
        headline: 'DARK COCOA SPREAD',
        image: '/assets/heroslider2/pb-chocolate-jar.png',
        cta: 'CHOCOLATE REIMAGINED',
        bgColor: '#fdf2f8',
        accentColor: '#831843',
        blobColor: '#ec4899',
        backgroundImage: '/assets/heroslider2/pb-chocolate-bg.png',
        isActive: true,
        order: 3
    }
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 1
    }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 1
    })
};

export const HeroSliderVersion2: React.FC<{ slides?: HeroSlide[] }> = ({ slides = DEMO_SLIDES }) => {
    const [page, setPage] = useState([0, 0]); // [index, direction]
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const [current, direction] = page;
    const activeSlide = slides[current];

    const paginate = (newDirection: number) => {
        const nextIndex = (current + newDirection + slides.length) % slides.length;
        setPage([nextIndex, newDirection]);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        setMousePos({ x, y });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-white select-none"
        >
            {/* 50/50 Masked Split Layout */}
            <div className="absolute inset-0 flex flex-col md:flex-row">

                {/* LEFT PANEL MASK */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden border-r border-black/5 z-10">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 flex items-center justify-center p-8 md:p-20"
                        >
                            {/* Paper Texture Background */}
                            <div
                                className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
                                style={{
                                    backgroundImage: 'url(/assets/heroslider2/paper-texture.png)',
                                    backgroundSize: 'cover'
                                }}
                            />

                            <div className="relative z-20 max-w-lg w-full">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mb-4"
                                >
                                    <span className="font-handdrawn text-4xl md:text-6xl text-slate-800 opacity-20">
                                        {activeSlide.category}
                                    </span>
                                    <div className="font-handdrawn text-2xl text-primary mt-[-10px]">
                                        PinoBite Premium
                                    </div>
                                </motion.div>

                                <motion.h1
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="font-bebas text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight mb-6 text-slate-900"
                                >
                                    {activeSlide.headline}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-lg md:text-xl text-slate-600 mb-10 max-w-md font-display"
                                >
                                    Crafted with only the finest ingredients to fuel your body and delight your senses. Experience the true taste of goodness.
                                </motion.p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-primary text-white font-bold tracking-widest rounded-full shadow-xl shadow-primary/20"
                                >
                                    {activeSlide.cta}
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT PANEL MASK */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden z-0">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0"
                        >
                            <motion.div
                                style={{
                                    x: -mousePos.x * 20,
                                    y: -mousePos.y * 20,
                                    scale: 1.1
                                }}
                                className="w-full h-full"
                            >
                                <img
                                    src={activeSlide.backgroundImage}
                                    alt="Background"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* CENTER JAR MASK/LAYER */}
            <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={{
                            enter: (d: number) => ({
                                x: d > 0 ? '120%' : '-120%',
                                opacity: 0,
                                scale: 0.8,
                                rotate: d > 0 ? 15 : -15
                            }),
                            center: {
                                x: 0,
                                opacity: 1,
                                scale: 1,
                                rotate: 0
                            },
                            exit: (d: number) => ({
                                x: d < 0 ? '120%' : '-120%',
                                opacity: 0,
                                scale: 0.8,
                                rotate: d < 0 ? 15 : -15
                            })
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: {
                                type: "spring",
                                stiffness: 60,  // Much slower
                                damping: 20,    // Stable stop
                                mass: 1.5,      // Feels heavier
                                delay: 0.15     // Stagger after background
                            },
                            rotate: { duration: 1.2, ease: "easeOut" },
                            scale: { duration: 1.2, ease: "easeOut" },
                            opacity: { duration: 0.6 }
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                x: mousePos.x * 40,
                                y: mousePos.y * 40,
                                rotate: mousePos.x * 5
                            }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="w-[300px] md:w-[500px] lg:w-[600px]"
                        >
                            <img
                                src={activeSlide.image}
                                alt="Jam Jar"
                                className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
                            />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-10 right-10 z-40 flex items-center space-x-8 text-slate-400 font-bold tracking-tighter">
                <button
                    onClick={() => paginate(-1)}
                    className="group flex flex-col items-end"
                >
                    <span className="text-[10px] tracking-[0.2em] mb-1 opacity-50 group-hover:opacity-100 transition-opacity uppercase">Previous</span>
                    <span className="text-2xl text-slate-800 font-bebas group-hover:text-primary transition-colors">FLAVOR</span>
                </button>
                <div className="w-[1px] h-10 bg-slate-200" />
                <button
                    onClick={() => paginate(1)}
                    className="group flex flex-col items-start"
                >
                    <span className="text-[10px] tracking-[0.2em] mb-1 opacity-50 group-hover:opacity-100 transition-opacity uppercase">Next</span>
                    <span className="text-2xl text-slate-800 font-bebas group-hover:text-primary transition-colors">FLAVOR</span>
                </button>
            </div>

            {/* Social Links */}
            <div className="absolute top-10 right-10 z-40 hidden md:flex flex-col space-y-4 text-slate-400">
                <a href="#" className="hover:text-primary transition-colors"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="hover:text-primary transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="#" className="hover:text-primary transition-colors"><i className="fab fa-youtube"></i></a>
            </div>

            {/* Progress Dots */}
            <div className="absolute bottom-10 left-10 z-40 flex space-x-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPage([idx, idx > current ? 1 : -1])}
                        className={`h-1 transition-all duration-300 ${current === idx ? 'w-8 bg-primary' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSliderVersion2;
