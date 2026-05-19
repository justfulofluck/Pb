import React, { useRef, useState, useEffect } from 'react';
import { UsageIdea } from '../types';
import { getMediaUrl } from '../utils/mediaHelper';

interface UsageIdeasProps {
    ideas: UsageIdea[];
    bgColor?: string;
}

const UsageIdeas: React.FC<UsageIdeasProps> = ({ ideas, bgColor = '#0b3d2e' }) => {
    // Fallback premium placeholder ideas if no custom ideas are uploaded
    const defaultPlaceholderIdeas: UsageIdea[] = [
        {
            id: 'placeholder-1',
            productId: 'placeholder',
            title: 'Spread It',
            description: 'Slather generously on fresh toast, warm waffles, or fruit slices.',
            image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=800&auto=format&fit=crop',
            order: 0
        },
        {
            id: 'placeholder-2',
            productId: 'placeholder',
            title: 'Drizzle It',
            description: 'Pour over oatmeal bowls, greek yogurt, or fluffy pancake stacks.',
            image: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?q=80&w=800&auto=format&fit=crop',
            order: 1
        },
        {
            id: 'placeholder-3',
            productId: 'placeholder',
            title: 'Blend It',
            description: 'Add a rich scoop into your daily smoothies or protein shakes.',
            image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop',
            order: 2
        }
    ];

    const displayIdeas = ideas && ideas.length > 0 ? ideas : defaultPlaceholderIdeas;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [displayIdeas]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.7;
        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const isGridOnDesktop = displayIdeas.length <= 3;

    const scrollContainerClasses = isGridOnDesktop
        ? "usage-ideas-scroll flex gap-5 md:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth lg:grid lg:grid-cols-3 lg:gap-8 lg:max-w-5xl lg:mx-auto lg:overflow-x-visible lg:justify-center"
        : "usage-ideas-scroll flex gap-5 md:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth";

    const cardClasses = isGridOnDesktop
        ? "flex-none w-[270px] md:w-[300px] lg:w-auto group/card snap-center lg:snap-align-none usage-idea-card"
        : "flex-none w-[270px] md:w-[300px] lg:w-[320px] group/card snap-center usage-idea-card";

    return (
        <section className="py-16 md:py-24 px-0 overflow-hidden bg-[#f2f2ec]">
            {/* Constrained Header Container */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 md:mb-16">
                {/* Section Header with dynamic brand color & chalkboard texture */}
                <div className="flex justify-center">
                    <h2
                        className="font-anton uppercase text-textured-any text-center leading-[1.1] tracking-wider py-1 px-4"
                        style={{
                            backgroundColor: bgColor,
                            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                            width: 'fit-content',
                        }}
                    >
                        Usage Ideas
                    </h2>
                </div>
            </div>

            {/* Slider/Grid Container - Full Bleed Edge-To-Edge */}
            <div className="w-full relative group">
                {/* Cards Scroll/Grid Area */}
                <div
                    ref={scrollRef}
                    className={scrollContainerClasses}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    <style>{`
                        .usage-ideas-scroll::-webkit-scrollbar { display: none; }
                        
                        .usage-idea-inner {
                            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        
                        .usage-idea-card:hover .usage-idea-inner {
                            transform: translateY(-8px);
                            box-shadow: 0 20px 30px -5px rgba(0, 0, 0, 0.10), 0 10px 15px -5px var(--hover-shadow-color, rgba(0,0,0,0.1));
                        }
                        
                        .usage-idea-image-wrapper {
                            overflow: hidden;
                        }
                        
                        .usage-idea-card img {
                            transition: transform 0.7s ease;
                        }
                        
                        .usage-idea-card:hover img {
                            transform: scale(1.05);
                        }
                    `}</style>

                    {displayIdeas.sort((a, b) => a.order - b.order).map((idea, idx) => (
                        <div
                            key={idea.id || idx}
                            className={cardClasses}
                            style={{ '--hover-shadow-color': `${bgColor}40` } as React.CSSProperties}
                        >
                            <div className="bg-white rounded-[40px] p-4 flex flex-col h-full usage-idea-inner border border-slate-100 shadow-sm">
                                {/* Image Card */}
                                <div className="usage-idea-image-wrapper rounded-[32px] overflow-hidden mb-5 aspect-square w-full relative bg-slate-50">
                                    <img
                                        src={getMediaUrl(idea.image)}
                                        alt={idea.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                {/* Text */}
                                <div className="px-2 pb-6 pt-2 text-left flex-1 flex flex-col">
                                    <h3 
                                        className="font-anton uppercase tracking-wide text-3xl md:text-[34px] mb-0 leading-[1.1] text-[#121c2d]"
                                    >
                                        {idea.title}
                                    </h3>
                                    <p className="font-satoshi text-slate-600 text-[15px] md:text-[16px] font-medium leading-snug mt-1.5">
                                        {idea.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UsageIdeas;
