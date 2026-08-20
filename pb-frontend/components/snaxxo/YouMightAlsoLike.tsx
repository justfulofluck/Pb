import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../../types';
import { getMediaUrl } from '../../utils/mediaHelper';
import { formatPrice } from '../../utils/formatters';

interface YouMightAlsoLikeProps {
  products: Product[];
  currentProductId: string;
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  bgColor?: string;
}

const YouMightAlsoLike: React.FC<YouMightAlsoLikeProps> = ({
  products,
  currentProductId,
  onProductClick,
  onAddToCart,
  bgColor = '#008a45',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Mouse drag scroll states
  const [isDown, setIsDown] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDown(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    el.style.scrollBehavior = 'auto';
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    const el = scrollRef.current;
    if (el) {
      el.style.scrollBehavior = '';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  // Filter out the current product and show others, bulletproof against non-arrays
  const relatedProducts = Array.isArray(products) 
    ? products.filter((p) => p && p.id !== currentProductId) 
    : [];

  // Update scroll indicators
  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState);
      return () => el.removeEventListener('scroll', updateScrollState);
    }
  }, [relatedProducts]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 280;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  if (relatedProducts.length === 0) return null;

  // Helper to create a safe rgba tint from any color format
  const colorWithAlpha = (color: string | undefined | null, alpha: number): string => {
    if (!color || typeof color !== 'string') return `rgba(0, 138, 69, ${alpha})`;
    
    // If it's a hex color, convert to rgba
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // If it's hsla/hsl, replace or add alpha
    if (color.startsWith('hsla') || color.startsWith('hsl')) {
      const match = color.match(/[\d.]+/g);
      if (match && match.length >= 3) {
        return `hsla(${match[0]}, ${match[1]}%, ${match[2]}%, ${alpha})`;
      }
    }
    // Fallback
    return `rgba(0, 138, 69, ${alpha})`;
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: '#f2f2ec',
        paddingTop: '60px',
        paddingBottom: '60px',
      }}
    >
      {/* Section Heading */}
      <div className="text-center mb-8 md:mb-16">
        <h2
          className="font-normal tracking-normal [word-spacing:0.05em] leading-[1.1] !font-anton uppercase text-textured-any text-[40px] lg:text-[100px] lg:leading-[110px] lg:-mb-[12px] lg:pb-[12px] lg:font-bold"
          style={{ backgroundColor: bgColor, textTransform: 'uppercase' }}
        >
          You Might Also Like
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-x-auto pb-4 select-none ymall-scroll"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: isDown ? 'grabbing' : 'grab',
        }}
      >
        <style>{`
          .ymall-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        {/* Centered Scrollable Track */}
        <div className="flex justify-center min-w-full w-max mx-auto gap-5 sm:gap-8 md:gap-10 lg:gap-12 px-6">

          {relatedProducts.map((p) => {
            const imageUrl = getMediaUrl(p.image);
            const isWished = wishlist.has(p.id);
            const hasDiscount = p.original_price && p.original_price > p.price;

            return (
              <div
                key={p.id}
                className="flex-shrink-0 w-[170px] sm:w-[210px] md:w-[235px] lg:w-[245px] cursor-pointer group"
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  onProductClick(p);
                }}
              >
                {/* Image Container */}
                <div className="relative mb-3 flex items-center justify-center h-[180px] sm:h-[220px] md:h-[265px] lg:h-[280px]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-xl pointer-events-none"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8 sm:w-12 sm:h-12 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill={i < Math.round(p.rating) ? '#fcc02a' : '#e5e7eb'}
                      stroke="none"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-[10px] sm:text-[12px] md:text-[13px] text-[#333] ml-1 font-bold font-satoshi pointer-events-none">
                    {p.reviewCount} reviews
                  </span>
                </div>

                {/* Product Name */}
                <p
                  className="text-[12px] sm:text-[14px] md:text-[15px] text-center uppercase tracking-normal mb-1.5 text-[#111] leading-snug px-1 line-clamp-2 select-none pointer-events-none"
                  style={{ 
                    fontFamily: 'var(--font-satoshi, "Inter", sans-serif)',
                    fontWeight: 900
                  }}
                >
                  {p.name}
                </p>

                {/* Price */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 pointer-events-none">
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-[#222] font-satoshi">
                    {formatPrice(p.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] sm:text-[12px] md:text-[13px] text-[#555] line-through font-semibold font-satoshi">
                      {formatPrice(p.original_price)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasDraggedRef.current) return;
                      onAddToCart(p);
                    }}
                    className="shine-coin px-5 py-2 sm:px-8 sm:py-2.5 rounded-full text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-[0.08em] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                    style={{
                      backgroundColor: '#008a45',
                      color: '#ffffff',
                      fontFamily: 'var(--font-satoshi, "Inter", sans-serif)',
                      fontWeight: 800
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default YouMightAlsoLike;
