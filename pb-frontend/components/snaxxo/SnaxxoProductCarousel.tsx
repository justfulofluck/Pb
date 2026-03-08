import React from 'react';
import { Product } from '../../types';

interface SnaxxoProductCarouselProps {
    products: Product[];
    onProductClick: (p: Product) => void;
    onAddToCart: (p: Product) => void;
    isLoading?: boolean;
    onShopClick?: () => void;
}

const SnaxxoProductCarousel: React.FC<SnaxxoProductCarouselProps> = ({
    products,
    onProductClick,
    onAddToCart,
    isLoading,
    onShopClick
}) => {
    if (isLoading) {
        return (
            <div className="py-12 bg-[#f2f2ec] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Filter products to show only favorites or top rated
    const favoriteProducts = products.filter(p => p.isTopRated).length > 0
        ? products.filter(p => p.isTopRated)
        : products.slice(0, 6);

    return (
        <section className="bg-[#f2f2ec] relative overflow-hidden pb-12 w-full lg:hidden">
            {/* Header */}
            <div className="pt-12 pb-16 relative">
                <div className="flex flex-col items-center justify-center relative z-10 px-4">
                    <h2 className="text-[#008a45] font-black text-5xl md:text-8xl uppercase tracking-[0.05em] text-center" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                        Customer's &nbsp; Favorite
                    </h2>
                    <div className="w-16 md:w-24 h-1.5 md:h-2 bg-[#008a45] mt-1 rounded-full"></div>
                    <p className="font-handdrawn text-3xl md:text-1xl text-slate-500 mt-2 text-center">
                        Join 100k+ happy healthy eaters! 🥳
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => {
                                if (onShopClick) {
                                    onShopClick();
                                } else {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            className="bg-[#008a45] text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#007038] shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        >
                            SHOP ALL
                        </button>
                    </div>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative z-20 px-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-6 pb-12">
                {favoriteProducts.map((product) => (
                    <div
                        key={product.id}
                        className="min-w-[260px] md:min-w-[300px] snap-center flex flex-col items-center relative group active:scale-[0.98] transition-all duration-300"
                    >
                        {/* Discount / Heart */}
                        <div className="absolute top-0 left-0 right-0 flex justify-between items-start z-10">
                            <div className="bg-[#ef4444] text-white text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider -rotate-2">
                                15% OFF
                            </div>
                            <button className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-[#008a45] hover:text-red-500 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[20px] fill-1">favorite</span>
                            </button>
                        </div>

                        {/* Image */}
                        <div
                            className="w-full aspect-square mb-4 cursor-pointer flex items-center justify-center p-2 mt-6"
                            onClick={() => onProductClick(product)}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain pointer-events-none transition-transform duration-500 group-hover:scale-105"
                                style={{ mixBlendMode: 'multiply' }}
                            />
                        </div>

                        {/* Ratings */}
                        <div className="flex gap-0.5 mb-2 text-[#f9bc15]">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`material-symbols-outlined text-[16px] ${i < Math.floor(product.rating || 5) ? 'fill-1' : ''}`}>
                                    {i < Math.floor(product.rating || 5) ? 'star' : 'star_outline'}
                                </span>
                            ))}
                            <span className="text-[10px] text-slate-500 font-bold ml-1 self-center">({product.reviewCount || 0} reviews)</span>
                        </div>

                        {/* Name */}
                        <h3
                            className="font-extrabold text-center text-slate-900 mb-1 px-1 line-clamp-2 h-[2.8rem] uppercase tracking-tight text-sm leading-[1.3] cursor-pointer"
                            onClick={() => onProductClick(product)}
                        >
                            {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-5">
                            <span className="font-black text-xl text-slate-900">₹{product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-slate-400 line-through text-xs font-bold">₹{product.originalPrice}</span>
                            )}
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                            className="bg-[#008a45] text-white w-full py-3.5 rounded-full font-black text-[12px] uppercase tracking-widest shadow-lg hover:bg-[#007038] transition-all hover:scale-[1.02] active:scale-[0.98] mt-auto flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            ADD TO CART
                        </button>
                    </div>
                ))}

                {/* Visual padding at end for scroll overflow */}
                <div className="min-w-[10px] h-full invisible"></div>
            </div>
        </section>
    );
}

export default SnaxxoProductCarousel;
