import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useInView, type Variants } from 'framer-motion';
import { Product } from '../../types';
import { getMediaUrl } from '../../utils/mediaHelper';

interface ProductComparisonProps {
    product: Product;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ product }) => {
    const bgColor = (product as any).bgColor || '#0b3d2e';
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());

    // Mouse tracking for parallax on the dark card
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [-200, 200], [4, -4]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-4, 4]), springConfig);
    const glowX = useSpring(useTransform(mouseX, [-200, 200], [30, 70]), springConfig);
    const glowY = useSpring(useTransform(mouseY, [-200, 200], [20, 80]), springConfig);

    // Progressive row reveal effect
    useEffect(() => {
        if (!isInView) return;
        comparisonRows.forEach((_, idx) => {
            setTimeout(() => {
                setRevealedRows(prev => new Set(prev).add(idx));
            }, 600 + idx * 200);
        });
    }, [isInView]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const getOthersImage = () => {
        const cat = product.category?.toLowerCase() || '';
        if (cat.includes('muesli')) return '/assets/muesli-display.jpg';
        if (cat.includes('oat')) return '/assets/oats-display.jpg';
        return '/assets/bottle.png';
    };

    const hexToRgb = (hex: string) => {
        const h = hex.replace('#', '');
        return {
            r: parseInt(h.substring(0, 2), 16) || 0,
            g: parseInt(h.substring(2, 4), 16) || 0,
            b: parseInt(h.substring(4, 6), 16) || 0,
        };
    };
    const rgb = hexToRgb(bgColor);

    const comparisonRows = [
        {
            icon: 'fitness_center',
            category: 'Protein Content',
            others: '5-10g Protein',
            highlight: '25g Protein',
        },
        {
            icon: 'inventory_2',
            category: 'Refine Sugar & Preservatives',
            others: 'Yes',
            highlight: 'No',
            highlightColor: true,
        },
        {
            icon: 'sentiment_satisfied',
            category: 'Taste',
            others: 'Boring, Tasteless',
            highlight: 'Sweet and Crunchy Flavor',
        },
        {
            icon: 'restaurant_menu',
            category: 'Ease of Use',
            others: 'Not Munchable Directly',
            highlight: 'Mix, Cook, or Munch Directly',
        },
        {
            icon: 'verified',
            category: 'Guarantee',
            others: 'No Satisfaction Guarantee',
            highlight: '100% Satisfaction Guarantee',
        }
    ];

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.2 }
        }
    };

    const rowVariants: Variants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
    };

    return (
        <section
            ref={sectionRef}
            className="py-[60px] md:py-24 px-4 md:px-12 bg-[#f2f2ec] font-satoshi flex flex-col items-center overflow-hidden relative"
        >
            {/* Inline keyframes for row slide-in and pulse */}
            <style>{`
                @keyframes rowSlideIn {
                    0% { opacity: 0; transform: translateX(-20px); }
                    60% { opacity: 1; transform: translateX(4px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes checkPop {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.06; transform: scale(1); }
                    50% { opacity: 0.12; transform: scale(1.05); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .comparison-row-revealed {
                    animation: rowSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .check-pop {
                    animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .comparison-row-hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .comparison-row-hover:hover {
                    background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.03);
                    transform: translateX(4px);
                }
                .comparison-row-hover:hover .row-icon-box {
                    background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12) !important;
                    transform: scale(1.1);
                }
                .comparison-row-hover:hover .row-icon-box span {
                    color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) !important;
                }
                .winner-shimmer {
                    background: linear-gradient(
                        90deg,
                        ${bgColor} 0%,
                        ${bgColor} 40%,
                        rgba(255,255,255,0.3) 50%,
                        ${bgColor} 60%,
                        ${bgColor} 100%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                }
            `}</style>

            {/* Grain texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Animated decorative aura */}
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl z-[0]"
                style={{ backgroundColor: bgColor, animation: 'glowPulse 4s ease-in-out infinite' }}
            />

            {/* DESKTOP LAYOUT */}
            <motion.div
                className="hidden md:flex w-full max-w-5xl rounded-[40px] shadow-xl flex-col md:flex-row relative mx-auto mt-0 z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={containerVariants}
                style={{ overflow: 'visible' }}
            >
                {/* Left & Center Columns (White part) */}
                <div className="flex-1 bg-white rounded-l-[40px] p-6 md:p-12 pb-6 flex flex-col relative overflow-hidden">
                    {/* Subtle decorative dots pattern */}
                    <div
                        className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage: `radial-gradient(${bgColor} 1px, transparent 1px)`,
                            backgroundSize: '12px 12px',
                        }}
                    />

                    <div className="flex w-full items-center mb-10 relative z-10">
                        <div className="w-1/2 flex justify-start">
                            <div>
                                <motion.div
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-3"
                                    style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`, color: bgColor }}
                                    variants={rowVariants}
                                >
                                    <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                                    Comparison
                                </motion.div>
                                <h3 className="text-[40px] md:text-[50px] font-bold text-[#0b3d2e] uppercase font-anton tracking-wider leading-tight">
                                    Pinobite <br /> Vs Others
                                </h3>
                            </div>
                        </div>

                        <div className="w-1/2 flex justify-center">
                            <motion.div
                                className="h-28 md:h-40 pb-2 relative"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <img
                                    src={getMediaUrl(getOthersImage())}
                                    alt="Others"
                                    className="h-full w-auto object-contain brightness-95 opacity-90 drop-shadow-sm mix-blend-multiply"
                                />
                            </motion.div>
                        </div>
                    </div>

                    <motion.div className="space-y-0 w-full mb-8" variants={containerVariants}>
                        <div className="flex pb-3 mb-2 relative">
                            <div className="w-1/2 text-[14px] font-black text-slate-400 uppercase tracking-[0.15em]">Category</div>
                            <div className="w-1/2 text-center text-[14px] font-black text-slate-400 uppercase tracking-[0.15em]">Others</div>
                            <motion.div
                                className="absolute bottom-0 left-0 h-[2px] rounded-full"
                                style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)` }}
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            />
                        </div>

                        {comparisonRows.map((row, idx) => {
                            const isRevealed = revealedRows.has(idx);
                            return (
                                <div
                                    key={idx}
                                    className="comparison-row-hover flex items-center py-4 border-b border-slate-100/60 last:border-0 rounded-lg px-2 -mx-2 cursor-default"
                                    onMouseEnter={() => setHoveredRow(idx)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        opacity: isRevealed ? 1 : 0,
                                        animation: isRevealed ? `rowSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : 'none',
                                        animationDelay: '0s',
                                    }}
                                >
                                    <div className="w-1/2 flex items-center gap-3">
                                        <div
                                            className="row-icon-box w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                                            style={{
                                                backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`,
                                            }}
                                        >
                                            <span
                                                className="material-symbols-outlined text-[18px] transition-colors duration-300"
                                                style={{ color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` }}
                                            >{row.icon}</span>
                                        </div>
                                        <span className="text-xs md:text-sm font-bold text-slate-700 leading-tight">{row.category}</span>
                                    </div>
                                    <div className="w-1/2 text-center text-xs md:text-sm font-medium text-slate-600 pr-4 flex items-center justify-center gap-2">
                                        <svg
                                            width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            className="text-red-500 shrink-0 transition-transform duration-300"
                                            style={{ transform: hoveredRow === idx ? 'scale(1.2) rotate(90deg)' : 'scale(1) rotate(0deg)' }}
                                        >
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span>{row.others}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Highlighted Right Column — 3D tilt on mouse move */}
                <motion.div
                    className="w-full md:w-[38%] md:transform md:scale-y-[1.06] rounded-b-[40px] md:rounded-[40px] shadow-2xl flex flex-col items-center p-8 md:p-10 text-center z-40 relative overflow-hidden"
                    style={{
                        backgroundColor: '#1a2e38',
                        rotateX,
                        rotateY,
                        transformPerspective: 800,
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Interactive glow that follows mouse */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: useTransform(
                                [glowX, glowY],
                                ([x, y]) =>
                                    `radial-gradient(circle at ${x}% ${y}%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) 0%, transparent 55%)`
                            ),
                        }}
                    />
                    {/* Noise texture */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.04]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* "Winner" ribbon badge with shimmer */}
                    <div
                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] z-20 winner-shimmer text-white"
                    >
                        ★ Winner
                    </div>

                    {/* Product image with floating animation */}
                    <motion.div
                        className="h-32 md:h-44 mb-5 relative z-10"
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                            scale: { type: 'spring', stiffness: 300 },
                        }}
                    >
                        <img
                            src={getMediaUrl(product.image)}
                            alt={product.name}
                            className="h-full w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
                        />
                    </motion.div>

                    <h4
                        className="text-xl md:text-2xl font-black uppercase font-satoshi tracking-tight mb-8 leading-tight relative z-10"
                        style={{ color: 'white' }}
                    >
                        {product.name}
                    </h4>

                    <div className="flex flex-col gap-0 w-full relative z-10">
                        {comparisonRows.map((row, idx) => {
                            const isRevealed = revealedRows.has(idx);
                            return (
                                <motion.div
                                    key={idx}
                                    className="flex flex-col items-center w-full py-4 border-b border-white/[0.06] last:border-0"
                                    whileHover={{ scale: 1.03, x: 4 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                    <div className="flex items-center gap-2 mb-0">
                                        <svg
                                            width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            style={{
                                                color: '#9cd92a',
                                                opacity: isRevealed ? 1 : 0,
                                                transform: isRevealed ? 'scale(1)' : 'scale(0)',
                                                transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.8 + idx * 0.2}s`,
                                            }}
                                        >
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
                                            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span
                                            className={`text-[15px] md:text-base font-bold tracking-tight text-center ${row.highlightColor ? '' : 'text-white'}`}
                                            style={{
                                                ...(row.highlightColor ? { color: '#9cd92a' } : {}),
                                                opacity: isRevealed ? 1 : 0,
                                                transform: isRevealed ? 'translateX(0)' : 'translateX(10px)',
                                                transition: `all 0.4s ease ${0.9 + idx * 0.2}s`,
                                            }}
                                        >
                                            {row.highlight}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Trust seal */}
                    <div className="mt-6 flex items-center gap-2 opacity-40 relative z-10">
                        <span className="material-symbols-outlined text-[16px] text-white">shield</span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em]">Lab Tested & Certified</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* MOBILE LAYOUT (Unified split layout) */}
            <div className="md:hidden flex flex-col items-center w-full z-10">
                {/* Mobile badge */}
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-3"
                    style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`, color: bgColor }}
                >
                    <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                    Comparison
                </div>
                <h3 className="text-[36px] font-bold text-[#0b3d2e] uppercase font-anton tracking-wider leading-tight text-center mb-6">
                    Pinobite <br /> Vs Others
                </h3>

                <div className="w-full rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative border-2 border-white/50">
                    {/* Header Images */}
                    <div className="flex w-full relative">
                        <div className="w-1/2 bg-white pt-6 pb-4 px-2 flex flex-col items-center z-10 border-b-2 border-gray-50">
                            <img
                                src={getMediaUrl(getOthersImage())}
                                alt="Others"
                                className="h-16 object-contain mb-3 brightness-95 opacity-80"
                            />
                        </div>
                        <div className="w-1/2 pt-6 pb-4 px-2 flex flex-col items-center z-10" style={{ backgroundColor: '#1a2e38' }}>
                            <img
                                src={getMediaUrl(product.image)}
                                alt={product.name}
                                className="h-20 object-contain mb-3 drop-shadow-xl"
                            />
                            <span
                                className="font-black text-[11px] uppercase tracking-wide text-center leading-tight"
                                style={{ color: bgColor }}
                            >
                                {product.name}
                            </span>
                        </div>
                    </div>

                    {/* Comparison Rows */}
                    <div className="flex flex-col w-full relative pb-6 bg-white">
                        {/* Background split (creates the two vertical colored bands) */}
                        <div className="absolute inset-0 flex w-full pointer-events-none">
                            <div className="w-1/2 h-full bg-white"></div>
                            <div className="w-1/2 h-full" style={{ backgroundColor: '#1a2e38' }}></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 w-full flex flex-col pt-2">
                            {comparisonRows.map((row, idx) => (
                                <div key={idx} className="flex flex-col w-full mt-2">
                                    {/* Category Pill */}
                                    <div
                                        className="w-[85%] mx-auto rounded-[12px] py-2 px-4 flex items-center justify-center gap-2 shadow-sm"
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-white">{row.icon}</span>
                                        <span className="font-bold text-[13px] text-white tracking-wide text-center leading-tight">{row.category}</span>
                                    </div>
                                    
                                    {/* Values */}
                                    <div className="flex w-full min-h-[50px] items-stretch">
                                        <div className="w-1/2 flex items-center justify-center px-3 py-3 text-center text-[13px] text-slate-600 font-medium leading-snug gap-1.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-red-500 shrink-0">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            {row.others}
                                        </div>
                                        <div className="w-1/2 flex items-center justify-center px-3 py-3 text-center text-[13px] font-bold text-white leading-snug gap-1.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: '#9cd92a' }} className="shrink-0">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
                                                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {row.highlight}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default ProductComparison;
