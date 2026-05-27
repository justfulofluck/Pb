import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getMediaUrl } from '@/utils/mediaHelper';

interface Ingredient {
    name: string;
    image: string;
}

interface IngredientShowcaseProps {
    ingredients?: Ingredient[];
    title?: string;
    bgColor?: string;
}

const DEFAULT_INGREDIENTS: Ingredient[] = [
    {
        name: 'Natural Peanut Butter Unsweetened',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=300'
    },
    {
        name: 'Rolled Oats',
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=300'
    },
    {
        name: 'Natural Jaggery',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300'
    },
    {
        name: 'Soya Protein',
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=300'
    },
    {
        name: 'Rosemary Extract',
        image: 'https://images.unsplash.com/photo-1544154471-700676a08605?auto=format&fit=crop&w=300'
    },
    {
        name: 'Cocoa Powder',
        image: 'https://images.unsplash.com/photo-1589415668102-1f31f9e2fca9?auto=format&fit=crop&w=300'
    },
    {
        name: 'Nuts & Seed Mix',
        image: 'https://images.unsplash.com/photo-1536627217148-d4a522b0fe0d?auto=format&fit=crop&w=300'
    }
];

const IngredientShowcase: React.FC<IngredientShowcaseProps> = ({
    ingredients,
    title = "Ingredient Blend",
    bgColor = "#0b3d2e"
}) => {
    const items = (ingredients && ingredients.length > 0) ? ingredients : DEFAULT_INGREDIENTS;
    const [activeIdx, setActiveIdx] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to index on mobile
    const scrollToIdx = (idx: number) => {
        setActiveIdx(idx);
        const el = scrollRef.current?.children[idx] as HTMLElement | undefined;
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    return (
        <section
            className="relative py-16 md:py-24 bg-[#f2f2ec] font-satoshi overflow-hidden w-full"
        >
            {/* Subtle bg texture blob */}
            <div
                className="absolute top-[-80px] right-[-80px] w-[340px] h-[340px] rounded-full opacity-[0.07] pointer-events-none"
                style={{ backgroundColor: bgColor, filter: 'blur(80px)' }}
            />

            {/* ── Section heading ── */}
            <div className="flex flex-col items-center mb-10 md:mb-16 px-5">
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-satoshi text-xs font-black uppercase tracking-[0.25em] mb-3"
                    style={{ color: bgColor, opacity: 0.6 }}
                >
                    What's inside
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="font-anton uppercase text-textured-any text-center leading-[1.05] tracking-wider py-1 px-4"
                    style={{
                        backgroundColor: bgColor,
                        fontSize: 'clamp(2.4rem, 10vw, 5rem)',
                        width: 'fit-content',
                    }}
                >
                    {title}
                </motion.h2>
            </div>

            {/* ── MOBILE: Snap-scroll cards ── */}
            <div className="block md:hidden px-4">
                {/* Scrollable card row */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}
                    onScroll={(e) => {
                        const el = e.currentTarget;
                        const cardW = el.scrollWidth / items.length;
                        const idx = Math.round(el.scrollLeft / cardW);
                        setActiveIdx(Math.min(idx, items.length - 1));
                    }}
                >
                    <style>{`.ing-scroll::-webkit-scrollbar{display:none}`}</style>
                    {items.map((item, idx) => {
                        const isActive = idx === activeIdx;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.92 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.04 }}
                                viewport={{ once: true }}
                                onClick={() => scrollToIdx(idx)}
                                className="snap-center flex-shrink-0 flex flex-col items-center relative overflow-hidden"
                                style={{
                                    width: '72vw',
                                    maxWidth: '280px',
                                    borderRadius: '28px',
                                    background: isActive ? bgColor : '#fff',
                                    boxShadow: isActive
                                        ? `0 12px 40px ${bgColor}55`
                                        : '0 4px 16px rgba(0,0,0,0.07)',
                                    transition: 'background 0.35s ease, box-shadow 0.35s ease',
                                    padding: '28px 20px 24px',
                                }}
                            >
                                {/* Number badge */}
                                <div
                                    className="absolute top-4 left-4 w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-black"
                                    style={{
                                        background: isActive ? 'rgba(255,255,255,0.15)' : `${bgColor}18`,
                                        color: isActive ? '#fff' : bgColor,
                                    }}
                                >
                                    {String(idx + 1).padStart(2, '0')}
                                </div>

                                {/* Image */}
                                <div
                                    className="w-[130px] h-[130px] flex items-center justify-center mb-5 overflow-hidden"
                                    style={{ borderRadius: '50%', background: isActive ? 'rgba(255,255,255,0.12)' : `${bgColor}10` }}
                                >
                                    <img
                                        src={getMediaUrl(item.image)}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        style={{ borderRadius: '50%' }}
                                    />
                                </div>

                                {/* Name */}
                                <span
                                    className="text-[15px] font-black uppercase tracking-wide text-center leading-tight"
                                    style={{ color: isActive ? '#fff' : '#1e2d2e' }}
                                >
                                    {item.name}
                                </span>

                                {/* Pill tag */}
                                <div
                                    className="mt-3 px-3 py-[5px] rounded-full text-[10px] font-black uppercase tracking-widest"
                                    style={{
                                        background: isActive ? 'rgba(255,255,255,0.18)' : `${bgColor}15`,
                                        color: isActive ? '#fff' : bgColor,
                                    }}
                                >
                                    Natural
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Dot pagination */}
                <div className="flex justify-center gap-2 mt-5">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIdx(idx)}
                            className="transition-all duration-300"
                            style={{
                                width: idx === activeIdx ? '22px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: idx === activeIdx ? bgColor : `${bgColor}30`,
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── DESKTOP: Horizontal scroll (original feel, upgraded) ── */}
            <div className="hidden md:block">
                <style>{`.ingredient-scroll-hide::-webkit-scrollbar { display: none; }`}</style>
                <div
                    className="ingredient-scroll-hide w-full overflow-x-auto pb-12 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                    <div className="flex gap-6 lg:gap-8 items-stretch justify-start min-w-max px-12">
                        {items.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center snap-center group"
                                style={{
                                    minWidth: '180px',
                                    maxWidth: '200px',
                                    background: '#fff',
                                    borderRadius: '28px',
                                    padding: '28px 18px 24px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                                    cursor: 'default',
                                }}
                                whileHover={{
                                    y: -6,
                                    boxShadow: `0 16px 48px ${bgColor}33`,
                                }}
                            >
                                {/* Number */}
                                <span
                                    className="self-start text-[11px] font-black uppercase tracking-[0.2em] mb-3 px-2 py-1 rounded-full"
                                    style={{ background: `${bgColor}12`, color: bgColor }}
                                >
                                    {String(idx + 1).padStart(2, '0')}
                                </span>

                                {/* Image circle */}
                                <div
                                    className="w-[120px] h-[120px] xl:w-[140px] xl:h-[140px] mb-5 overflow-hidden group-hover:scale-105 transition-transform duration-500"
                                    style={{ borderRadius: '50%', background: `${bgColor}10` }}
                                >
                                    <img
                                        src={getMediaUrl(item.image)}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <span
                                    className="text-[13px] xl:text-[15px] font-black uppercase tracking-wide leading-tight"
                                    style={{ color: '#1e2d2e' }}
                                >
                                    {item.name}
                                </span>

                                {/* Pill */}
                                <div
                                    className="mt-3 px-3 py-[4px] rounded-full text-[10px] font-black uppercase tracking-widest"
                                    style={{ background: `${bgColor}14`, color: bgColor }}
                                >
                                    Natural
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IngredientShowcase;
