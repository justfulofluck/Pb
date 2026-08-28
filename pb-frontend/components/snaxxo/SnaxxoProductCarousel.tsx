import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../Toast';
import { getMediaUrl } from '../../utils/mediaHelper';
import { API_BASE_URL } from '../../config';

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
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const { user } = useAuth();
    const { showToast } = useToast();

    // Fetch Wishlist
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) {
                setWishlistIds(new Set());
                return;
            }
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${API_BASE_URL}/api/wishlist/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const ids = new Set<string>(data.map((item: any) => String(item.product)));
                    setWishlistIds(ids);
                }
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            }
        };
        fetchWishlist();
    }, [user]);

    const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        if (!user) {
            showToast('Please log in to save to your wishlist.', 'warning');
            return;
        }
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/api/wishlist/toggle/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: productId })
            });
            if (response.ok) {
                const data = await response.json();
                const newIds = new Set(wishlistIds);
                if (data.status === 'added') {
                    newIds.add(productId);
                    showToast('Added to wishlist!', 'success');
                } else {
                    newIds.delete(productId);
                    showToast('Removed from wishlist', 'info');
                }
                setWishlistIds(newIds);
            }
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            showToast('Failed to update wishlist', 'error');
        }
    };

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
        <section className="bg-whiteboard texture-overlay texture-speckles relative overflow-hidden pb-6 w-full lg:hidden">
            <div className="pt-4 pb-4 relative">
                <div className="flex flex-col items-center justify-center relative z-10 px-4">
                    <div className="bg-[#0b3d2e] text-white font-black text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-sm -rotate-2 mb-2 inline-block shadow-sm">
                        Flavors you Love
                    </div>
                    <h2 className="text-textured-green font-normal uppercase tracking-wide [word-spacing:0.05em] !font-anton text-center text-[40px] sm:text-[52px] leading-[1.05]">
                        Customer's<br />Favorite
                    </h2>
                    <div className="w-20 sm:w-28 h-2 bg-[#0b3d2e] mt-3 rounded-full mb-2"></div>
                    <p className="font-handdrawn text-2xl sm:text-3xl text-[#0b3d2e]/80 mt-1 text-center mb-3">
                        Join 100k+ happy healthy eaters! 🥳
                    </p>
                    <div className="mt-2 mb-6">
                        <button
                            onClick={() => {
                                if (onShopClick) onShopClick();
                                else window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="btn-greenboard text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
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
                className={`relative z-20 px-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-6 pb-4 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
            >
                {favoriteProducts.map((product) => {
                    const discount = product.original_price && product.original_price > product.price
                        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                        : null;
                    const isWishlisted = wishlistIds.has(String(product.id));

                    return (
                        <div
                            key={product.id}
                            className="min-w-[260px] md:min-w-[300px] snap-center flex flex-col items-center relative group active:scale-[0.98] transition-all duration-300"
                        >
                            <div className="absolute top-0 left-0 right-0 flex justify-between items-start z-10">
                                {discount ? (
                                    <div className="bg-[#008a45] text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider -rotate-2">
                                        {discount}% OFF
                                    </div>
                                ) : <div />}
                                <button
                                    onClick={(e) => toggleWishlist(e, String(product.id))}
                                    className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all shadow-sm shrink-0 cursor-pointer active:scale-90 ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-[#008a45] hover:text-red-500'}`}
                                >
                                    <span className={`material-symbols-outlined text-[18px] leading-none select-none ${isWishlisted ? 'fill-1' : ''}`}>favorite</span>
                                </button>
                            </div>

                            <div
                                className="w-full aspect-square mb-4 cursor-pointer flex items-center justify-center p-2 mt-6"
                                onClick={(e) => handleProductClick(e, product)}
                            >
                                <img
                                    src={getMediaUrl(product.image)}
                                    alt={product.name}
                                    className="w-full h-full object-contain pointer-events-none transition-transform duration-500 group-hover:scale-105"
                                    style={{ mixBlendMode: 'multiply' }}
                                    draggable={false}
                                />
                            </div>

                            <div className="flex gap-0.5 mb-2 text-[#f9bc15]">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-[22px] ${i < Math.floor(product.rating || 5) ? 'fill-1' : ''}`}>
                                        {i < Math.floor(product.rating || 5) ? 'star' : 'star_outline'}
                                    </span>
                                ))}
                                <span className="text-[12px] text-slate-500 font-bold ml-1 self-center">({product.reviewCount || 0} reviews)</span>
                            </div>

                            <h3 className="text-[#0b3d2e] !text-[1.4rem] text-center mb-1.5 px-2 line-clamp-2 min-h-[3.5rem] uppercase tracking-normal leading-[1.2] cursor-default w-full overflow-hidden flex-shrink-0 font-anton">
                                {product.name}
                            </h3>

                            <div className="flex flex-col items-center mb-3">
                                <span className="font-black text-lg text-[#0b3d2e]">₹{product.price}</span>
                                {product.original_price && product.original_price > product.price && (
                                    <span className="text-gray-900 line-through text-[17px] font-bold">₹{product.original_price}</span>
                                )}
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                                className="shine-coin btn-greenboard text-white w-[85%] mx-auto py-3.5 rounded-full font-black text-[12px] uppercase tracking-widest transition-all shadow-lg active:scale-95 mt-auto flex items-center justify-center gap-1.5"
                            >
                                {product.stock <= 0 ? 'SOLD OUT' : 'Add to Cart'}
                            </button>
                        </div>
                    );
                })}
                <div className="min-w-[10px] h-full invisible"></div>
            </div>
        </section>
    );
};

export default SnaxxoProductCarousel;
