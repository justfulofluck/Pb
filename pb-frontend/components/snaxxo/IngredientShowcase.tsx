import React from 'react';
import { motion } from 'framer-motion';

interface Ingredient {
    name: string;
    image: string;
}

interface IngredientShowcaseProps {
    ingredients?: Ingredient[];
    title?: string;
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
    title = "The Powerful Natural Ingredient Blend"
}) => {
    const items = (ingredients && ingredients.length > 0) ? ingredients : DEFAULT_INGREDIENTS;

    return (
        <section className="py-20 px-4 md:px-12 bg-[#fff1f1] font-satoshi flex flex-col items-center overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-anton text-[#0b3d2e] uppercase tracking-wide text-center mb-16"
            >
                {title.replace("The Powerful Natural ", "")}
            </motion.h2>

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
                            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-white shadow-xl shadow-pink-200/50 flex items-center justify-center p-4 md:p-6 mb-4 group-hover:scale-105 transition-transform duration-500 relative ring-1 ring-pink-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-[#2d3e40] leading-tight max-w-[110px] md:max-w-[140px] tracking-wide">
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
