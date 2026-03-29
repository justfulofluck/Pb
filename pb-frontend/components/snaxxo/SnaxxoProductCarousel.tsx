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
    onAddToCart,
    onProductClick,
    isLoading,
    onShopClick
}) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [dragDistance, setDragDistance] = React.useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        setDragDistance(0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
        setDragDistance(Math.abs(x - startX));
    };

    const handleProductClick = (e: React.MouseEvent, product: Product) => {
        // High threshold (25px) to support click-dragging without accidentally navigating
        if (dragDistance < 25) {
            onProductClick(product);
        }
    };

    if (isLoading) {
        return (
            <div className="py-12 bg-[#f2f2ec] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    const favoriteProducts = products.filter(p => p.isTopRated).length > 0
        ? products.filter(p => p.isTopRated)
        : products.slice(0, 6);

    return (
        <section className="bg-whiteboard texture-overlay texture-speckles relative overflow-hidden pb-12 w-full lg:hidden">
            <div className="pt-12 pb-16 relative">
                <div className="flex flex-col items-center justify-center relative z-10 px-4">
                    <h2 className="text-textured-green text-6xl md:text-8xl font-normal !normal-case tracking-tight leading-[0.9] font-anton text-center">
                        Customer's<br />Favorite
                    </h2>
                    <div className="w-16 md:w-24 h-1.5 md:h-2 bg-[#0b3d2e] mt-2 rounded-full mb-2"></div>
                    <p className="font-handdrawn text-2xl md:text-3xl text-[#0b3d2e]/70 mt-3 text-center mb-2">
                        Join 100k+ happy healthy eaters! 🥳
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={() => {
                                if (onShopClick) onShopClick();
                                else window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="btn-greenboard text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
                        >
                            SHOP ALL
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`relative z-20 px-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-6 pb-12 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
            >
                {favoriteProducts.map((product) => (
                    <div
                        key={product.id}
                        className="min-w-[260px] md:min-w-[300px] snap-center flex flex-col items-center relative group active:scale-[0.98] transition-all duration-300"
                    >
                        <div className="absolute top-0 left-0 right-0 flex justify-between items-start z-10">
                            <div className="bg-[#ef4444] text-white text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider -rotate-2">
                                15% OFF
                            </div>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-[#008a45] hover:text-red-500 transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px] fill-1">favorite</span>
                            </button>
                        </div>

                        <div
                            className="w-full aspect-square mb-4 cursor-pointer flex items-center justify-center p-2 mt-6"
                            onClick={(e) => handleProductClick(e, product)}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain pointer-events-none transition-transform duration-500 group-hover:scale-105"
                                style={{ mixBlendMode: 'multiply' }}
                                draggable={false}
                            />
                        </div>

                        <div className="flex gap-0.5 mb-2 text-[#f9bc15]">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`material-symbols-outlined text-[16px] ${i < Math.floor(product.rating || 5) ? 'fill-1' : ''}`}>
                                    {i < Math.floor(product.rating || 5) ? 'star' : 'star_outline'}
                                </span>
                            ))}
                            <span className="text-[10px] text-slate-500 font-bold ml-1 self-center">({product.reviewCount || 0} reviews)</span>
                        </div>

                        <h3
                            className="font-extrabold text-center text-slate-900 mb-1 px-1 line-clamp-2 h-[2.8rem] uppercase tracking-tight text-sm leading-[1.3] cursor-pointer hover:text-[#008a45] transition-colors"
                            onClick={(e) => handleProductClick(e, product)}
                        >
                            {product.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-5">
                            <span className="font-black text-xl text-slate-900">₹{product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-slate-400 line-through text-xs font-bold">₹{product.originalPrice}</span>
                            )}
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                            className="btn-greenboard text-white w-full py-3.5 rounded-full font-black text-[12px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] mt-auto flex items-center justify-center gap-1.5"
                        >
                            ADD TO CART
                        </button>
                    </div>
                ))}
                <div className="min-w-[10px] h-full invisible"></div>
            </div>
        </section>
    );
};

export default SnaxxoProductCarousel;
