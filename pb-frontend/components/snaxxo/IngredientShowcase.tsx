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
    productId?: string | number;
}

const DEFAULT_INGREDIENTS: Ingredient[] = [
    {
        name: 'Natural Peanut Butter Unsweetened',
        image: '/ingridents/natural-peanut-butter-unsweetened.png'
    },
    {
        name: 'Rolled Oats',
        image: '/ingridents/rolled-oats.png'
    },
    {
        name: 'Natural Jaggery',
        image: '/ingridents/natural-jaggery.png'
    },
    {
        name: 'Soya Protein',
        image: '/ingridents/soya-protein.png'
    },
    {
        name: 'Rosemary Extract',
        image: '/ingridents/rosemary-extract.png'
    },
    {
        name: 'Cocoa Powder',
        image: '/ingridents/cocoa-powder.png'
    },
    {
        name: 'Nuts & Seed Mix',
        image: '/ingridents/nuts-and-seed-mix.png'
    }
];

const PRODUCT_INGREDIENTS_MAP: Record<string, Ingredient[]> = {
  "29": [
    { name: "Roasted Peanut", image: "/ingridents/Roasted Peanut.png" },
    { name: "Almond", image: "/ingridents/ALMOND.png" },
    { name: "Cashew", image: "/ingridents/cashew.png" },
    { name: "Pistachio", image: "/ingridents/pistachio.png" },
    { name: "Walnut", image: "/ingridents/walnut.png" },
    { name: "Cranberry", image: "/ingridents/cranberry.png" },
    { name: "Blueberry", image: "/ingridents/BLUE BERRY.png" },
    { name: "Raisin", image: "/ingridents/raisin.png" },
    { name: "Brown Sugar", image: "/ingridents/ORGANIC JAGGERY.png" }
  ],
  "30": [
    { name: "Roasted Peanut", image: "/ingridents/Roasted Peanut.png" },
    { name: "Chia Seed", image: "/ingridents/chia-seed.png" },
    { name: "Protein Blend", image: "/ingridents/PROTEIN BLEND.png" },
    { name: "Brown Sugar", image: "/ingridents/ORGANIC JAGGERY.png" },
    { name: "Rosemary Extract", image: "/ingridents/rosemery extract.png" },
    { name: "Vitamin E", image: "/ingridents/VITAMIN E.png" }
  ],
  "31": [
    { name: "Roasted Peanut", image: "/ingridents/Roasted Peanut.png" },
    { name: "Peanut Butter Powder", image: "/ingridents/peanut-butter-powder.png" },
    { name: "Pink Salt", image: "/ingridents/PINK SALT.png" }
  ],
  "32": [
    { name: "Roasted Peanut", image: "/ingridents/Roasted Peanut.png" },
    { name: "Pineapple", image: "/ingridents/pineapple.png" },
    { name: "Protein Blend", image: "/ingridents/PROTEIN BLEND.png" },
    { name: "Brown Sugar", image: "/ingridents/ORGANIC JAGGERY.png" },
    { name: "Rosemary Extract", image: "/ingridents/rosemery extract.png" }
  ],
  "33": [
    { name: "Roasted Peanut", image: "/ingridents/Roasted Peanut.png" },
    { name: "Mango", image: "/ingridents/mango.png" },
    { name: "Chia Seed", image: "/ingridents/chia-seed.png" },
    { name: "Protein Blend", image: "/ingridents/PROTEIN BLEND.png" },
    { name: "Brown Sugar", image: "/ingridents/ORGANIC JAGGERY.png" }
  ],
  "34": [
    { name: "Roasted Peanut", image: "/ingridents/Roasted Peanut.png" },
    { name: "Dark Chocolate Paste", image: "/ingridents/dark-chocolate-paste.png" },
    { name: "Cocoa Powder", image: "/ingridents/COCOA-POWDER.png" },
    { name: "Almond", image: "/ingridents/ALMOND.png" },
    { name: "Pink Salt", image: "/ingridents/PINK SALT.png" },
    { name: "Brown Sugar", image: "/ingridents/ORGANIC JAGGERY.png" }
  ]
};

const IngredientShowcase: React.FC<IngredientShowcaseProps> = ({
    ingredients,
    title = "Ingredient Blend",
    bgColor = "#0b3d2e",
    productId
}) => {
    let items = DEFAULT_INGREDIENTS;
    if (ingredients && ingredients.length > 0) {
        items = ingredients;
    } else if (productId && PRODUCT_INGREDIENTS_MAP[productId.toString()]) {
        items = PRODUCT_INGREDIENTS_MAP[productId.toString()];
    }

    return (
        <section className="py-[60px] md:py-24 bg-[#f2f2ec] font-satoshi flex flex-col items-center overflow-hidden w-full">
            <div className="flex justify-center w-full mb-16 px-4 md:px-12">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-anton uppercase text-textured-any text-center leading-[1.1] tracking-wider py-1 px-4"
                    style={{
                        backgroundColor: bgColor,
                        fontSize: 'clamp(2.4rem, 10vw, 80px)',
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
                className="ingredient-scroll-hide w-full overflow-x-auto pb-12 scroll-smooth snap-x snap-mandatory"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div className={`flex gap-4 md:gap-10 items-start justify-start ${items.length <= 6 ? 'md:justify-center' : 'md:justify-start'} min-w-max px-4 md:px-12`}>
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
                                    style={{ borderRadius: '50%' }}
                                />
                            </div>
                            <span className="text-[16px] font-bold text-[#2d3e40] leading-tight max-w-[110px] md:max-w-[200px] tracking-wide uppercase">
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
