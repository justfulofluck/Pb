import React from 'react';
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
        image: 'https://images.unsplash.com/photo-16154852d0694-3998b368735d?auto=format&fit=crop&w=300'
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

    return (
        <section className="py-20 px-4 md:px-12 bg-[#f2f2ec] font-satoshi flex flex-col items-center overflow-hidden">
            <div className="flex justify-center w-full mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-anton uppercase text-textured-any text-center leading-[1.1] tracking-wider py-1 px-4"
                    style={{
                        backgroundColor: bgColor,
                        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                        width: 'fit-content',
                    }}
                >
                    {title}
                </motion.h2>
            </div>

            <style>{`
                .ingredient-scroll-hide::-webkit-scrollbar { display: none; }
            `}</style>
            <div
                className="ingredient-scroll-hide w-full overflow-x-auto pb-12 px-6 md:px-12 scroll-smooth snap-x snap-mandatory"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div className="flex gap-4 md:gap-10 items-start justify-start md:justify-center min-w-max">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center min-w-[120px] md:min-w-[160px] group snap-center"
                        >
                            <div className="w-36 h-36 md:w-56 md:h-56 mb-4 group-hover:scale-105 transition-transform duration-500 relative flex items-center justify-center p-6">
                                <img
                                    src={getMediaUrl(item.image)}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-[14px] md:text-[18px] font-bold text-[#2d3e40] leading-tight max-w-[110px] md:max-w-[200px] tracking-wide">
                                {item.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IngredientShowcase;
