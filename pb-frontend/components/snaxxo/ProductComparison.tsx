import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

interface ProductComparisonProps {
    product: Product;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ product }) => {
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
        <section className="py-24 px-4 md:px-12 bg-[#f2f2ec] font-satoshi flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-xl flex flex-col md:flex-row relative mx-auto mt-0">
                {/* Left & Center Columns (White part) */}
                <div className="flex-1 p-6 md:p-12 pb-6 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                        <div className="flex flex-col items-start md:items-center w-full md:w-auto gap-4">
                            <h3 className="text-4xl md:text-5xl font-bold text-[#0b3d2e] uppercase font-satoshi tracking-tight leading-tight">
                                Pinobite <br /> Vs <br /> Others
                            </h3>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="h-24 md:h-32 mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=200"
                                    alt="Others"
                                    className="h-full w-auto object-contain brightness-95 opacity-80"
                                />
                            </div>
                            <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Others</span>
                        </div>

                        <div className="hidden md:block w-32" />
                    </div>

                    <div className="space-y-0 w-full mb-8">
                        <div className="flex border-b-2 border-[#9cd92a] pb-2 mb-4 relative">
                            <div className="w-1/3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</div>
                            <div className="w-1/3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest invisible md:visible">Others</div>
                            <div className="w-1/2 md:w-1/3 invisible md:block" />
                        </div>

                        {comparisonRows.map((row, idx) => (
                            <div key={idx} className="flex items-center py-4 border-b border-gray-50 last:border-0 group">
                                <div className="w-1/3 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#0b3d2e] transition-colors">{row.icon}</span>
                                    <span className="text-xs md:text-sm font-bold text-gray-700 leading-tight">{row.category}</span>
                                </div>
                                <div className="w-1/3 text-center text-xs md:text-sm font-medium text-gray-500">
                                    {row.others}
                                </div>
                                <div className="w-1/3 invisible md:block" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Highlighted Right Column (Dark part) */}
                <div className="w-full md:w-1/3 bg-[#1f3a47] md:absolute md:top-[-40px] md:bottom-[-40px] md:right-0 md:rounded-[40px] shadow-2xl flex flex-col items-center p-8 md:p-10 text-center z-50 border-4 border-white/10 md:border-white">
                    <div className="h-32 md:h-40 mb-6 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] hover:scale-110 transition-transform cursor-pointer">
                        <img
                            src={product.image}
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

                    <div className="space-y-10 w-full">
                        {comparisonRows.map((row, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                {/* Mobile label show only */}
                                <span className="md:hidden text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{row.category}</span>
                                <span className={`text-sm md:text-base font-bold tracking-tight ${row.highlightColor || 'text-white'}`}>
                                    {row.highlight}
                                </span>
                                {idx < comparisonRows.length - 1 && <div className="md:hidden w-8 h-[1px] bg-white/10 mt-4" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </section>
    );
};

export default ProductComparison;
