import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { getMediaUrl } from '../../utils/mediaHelper';

interface ProductComparisonProps {
    product: Product;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ product }) => {
    const getOthersImage = () => {
        const cat = product.category?.toLowerCase() || '';
        if (cat.includes('muesli')) {
            return '/assets/muesli-display.jpg';
        }
        if (cat.includes('oat')) {
            return '/assets/oats-display.jpg';
        }
        return '/assets/peanut-butter-display.jpg';
    };

    const comparisonRows = [
        {
            icon: 'fitness_center',
            category: 'Protein Content',
            others: '5-10g Protein',
            highlight: '25g Protein'
        },
        {
            icon: 'inventory_2',
            category: 'Refine Sugar & Preservatives',
            others: 'Yes',
            highlight: 'No',
            highlightColor: 'text-[#9cd92a]'
        },
        {
            icon: 'sentiment_satisfied',
            category: 'Taste',
            others: 'Boring, Tasteless',
            highlight: 'Sweet and Crunchy Flavor'
        },
        {
            icon: 'restaurant_menu',
            category: 'Ease of Use',
            others: 'Not Munchable Directly',
            highlight: 'Mix, Cook, or Munch Directly'
        },
        {
            icon: 'verified',
            category: 'Guarantee',
            others: 'No Satisfaction Guarantee',
            highlight: '100% Satisfaction Guarantee'
        }
    ];

    return (
        <section className="py-[60px] md:py-24 px-4 md:px-12 bg-[#f2f2ec] font-satoshi flex flex-col items-center overflow-hidden">
            {/* DESKTOP LAYOUT */}
            <div className="hidden md:flex w-full max-w-5xl bg-white rounded-[40px] shadow-xl flex-col md:flex-row relative mx-auto mt-0">
                {/* Left & Center Columns (White part) */}
                <div className="flex-1 p-6 md:p-12 pb-6 flex flex-col">
                    <div className="flex w-full items-center mb-12">
                        <div className="w-1/2 flex justify-start">
                            <h3 className="text-[40px] md:text-[50px] font-bold text-[#0b3d2e] uppercase font-anton tracking-wider leading-tight">
                                Pinobite <br /> Vs Others
                            </h3>
                        </div>

                        <div className="w-1/2 flex justify-center">
                            <div className="h-32 md:h-48 pb-2">
                                <img
                                    src={getMediaUrl(getOthersImage())}
                                    alt="Others"
                                    className="h-full w-auto object-contain brightness-95 opacity-90 drop-shadow-sm mix-blend-multiply"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-0 w-full mb-8">
                        <div className="flex border-b-2 border-[#9cd92a] pb-2 mb-4 relative">
                            <div className="w-1/2 text-[18px] font-black text-gray-500 uppercase tracking-widest">Category</div>
                            <div className="w-1/2 text-center text-[18px] font-black text-gray-500 uppercase tracking-widest">Others</div>
                        </div>

                        {comparisonRows.map((row, idx) => (
                            <div key={idx} className="flex items-center py-4 border-b border-gray-50 last:border-0 group">
                                <div className="w-1/2 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#0b3d2e] transition-colors">{row.icon}</span>
                                    <span className="text-xs md:text-sm font-bold text-gray-700 leading-tight">{row.category}</span>
                                </div>
                                <div className="w-1/2 text-center text-xs md:text-sm font-medium text-gray-500 pr-4">
                                    {row.others}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Highlighted Right Column (Dark part) */}
                <div className="w-full md:w-1/3 bg-[#1f3a47] md:transform md:scale-y-[1.1] rounded-b-[40px] md:rounded-[40px] shadow-2xl flex flex-col items-center p-8 md:p-10 text-center z-40 border-4 border-white/10 md:border-white">
                    <div className="h-32 md:h-40 mb-6 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] hover:scale-110 transition-transform cursor-pointer">
                        <img
                            src={getMediaUrl(product.image)}
                            alt={product.name}
                            className="h-full w-auto object-contain"
                        />
                    </div>

                    <h4
                        className="text-xl md:text-2xl font-black uppercase font-satoshi tracking-tight mb-8 leading-tight"
                        style={{ color: 'white' }}
                    >
                        {product.name}
                    </h4>

                    <div className="flex flex-col gap-6 md:gap-0 md:space-y-10 w-full">
                        {comparisonRows.map((row, idx) => (
                            <div key={idx} className="flex flex-col items-center w-full">
                                {/* Mobile label show only */}
                                <span className="md:hidden text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 text-center">{row.category}</span>
                                <span className={`text-[15px] md:text-base font-bold tracking-tight text-center ${row.highlightColor || 'text-white'}`}>
                                    {row.highlight}
                                </span>
                                {idx < comparisonRows.length - 1 && <div className="md:hidden w-12 h-[1px] bg-white/10 mt-6" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MOBILE LAYOUT (Unified split layout) */}
            <div className="md:hidden flex flex-col items-center w-full z-10">
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
                                className="h-20 object-contain mb-3 brightness-95 opacity-80"
                            />
                        </div>
                        <div className="w-1/2 bg-[#1f3a47] pt-6 pb-4 px-2 flex flex-col items-center z-10 border-b-2 border-[#1f3a47]">
                            <img
                                src={getMediaUrl(product.image)}
                                alt={product.name}
                                className="h-20 object-contain mb-3 drop-shadow-xl"
                            />
                            <span className="text-[#9cd92a] font-black text-[11px] uppercase tracking-wide text-center leading-tight">
                                {product.name}
                            </span>
                        </div>
                    </div>

                    {/* Comparison Rows */}
                    <div className="flex flex-col w-full relative pb-6 bg-white">
                        {/* Background split (creates the two vertical colored bands) */}
                        <div className="absolute inset-0 flex w-full pointer-events-none">
                            <div className="w-1/2 h-full bg-white"></div>
                            <div className="w-1/2 h-full bg-[#1f3a47]"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 w-full flex flex-col pt-2">
                            {comparisonRows.map((row, idx) => (
                                <div key={idx} className="flex flex-col w-full mt-2">
                                    {/* Category Pill */}
                                    <div className="w-[85%] mx-auto bg-[#9cd92a] rounded-[12px] py-2 px-4 flex items-center justify-center gap-2 shadow-sm border border-[#8cc627]">
                                        <span className="material-symbols-outlined text-[18px] text-[#0b3d2e]">{row.icon}</span>
                                        <span className="font-bold text-[13px] text-[#0b3d2e] tracking-wide text-center leading-tight">{row.category}</span>
                                    </div>
                                    
                                    {/* Values */}
                                    <div className="flex w-full min-h-[50px] items-stretch">
                                        <div className="w-1/2 flex items-center justify-center px-3 py-3 text-center text-[13px] text-gray-700 font-medium leading-snug">
                                            {row.others}
                                        </div>
                                        <div className="w-1/2 flex items-center justify-center px-3 py-3 text-center text-[13px] font-bold text-white leading-snug">
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
