import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './Toast';
import { API_BASE_URL } from '../config';
import { formatPrice } from '../utils/formatters';
import { analytics } from '../utils/analytics';
import { getMediaUrl } from '../utils/mediaHelper';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onProductClick, isLoading }) => {
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

  const toggleWishlist = useCallback(async (e: React.MouseEvent, productId: string) => {
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
        
        setWishlistIds(prev => {
          const next = new Set(prev);
          if (data.status === 'added') {
            next.add(productId);
          } else {
            next.delete(productId);
          }
          return next;
        });

        if (data.status === 'added') {
          showToast('Added to wishlist!', 'success');
          const p = products.find(prod => String(prod.id) === productId);
          if (p) analytics.trackWishlistAction(p, 'add');
        } else {
          showToast('Removed from wishlist', 'info');
          const p = products.find(prod => String(prod.id) === productId);
          if (p) analytics.trackWishlistAction(p, 'remove');
        }
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
      showToast('Failed to update wishlist', 'error');
    }
  }, [user, products, showToast]);

  // Skeleton loader component matching the new style
  const LoadingSkeleton = React.memo(() => (
    <div className="animate-pulse">
      <div className="w-full aspect-[4/5] bg-white/50 rounded-2xl mb-4"></div>
      <div className="w-3/4 h-5 bg-white/50 rounded mb-2 mx-auto"></div>
      <div className="w-1/2 h-4 bg-white/50 rounded mx-auto"></div>
    </div>
  ));

  return (
    <section id="products" className="py-24 bg-whiteboard texture-overlay texture-speckles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="bg-[#008a45] text-white font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-sm -rotate-2 mb-2 inline-block shadow-sm">
            Our Favorites
          </div>
          <h2 className="text-6xl md:text-8xl text-[#008a45] tracking-tight leading-none mb-4 font-anton">
            Customer's Favourite
          </h2>
          <div className="w-24 h-1 bg-[#008a45] rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
          {isLoading ? (
            [1, 2, 3, 4].map((n) => <LoadingSkeleton key={`skeleton-${n}`} />)
          ) : (
            products.map((product) => {

              const isWishlisted = wishlistIds.has(String(product.id));

              return (
                <div
                  key={product.id}
                  className="group flex flex-col h-full text-center cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  {/* Image Area */}
                  <div className="relative aspect-[4/5] w-full mb-8 transition-transform duration-500 group-hover:-translate-y-2">
                    {/* Heart Icon */}
                    <button
                      onClick={(e) => toggleWishlist(e, String(product.id))}
                      className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90"
                    >
                      <span className={`material-symbols-outlined text-[18px] transition-colors ${isWishlisted ? '!text-red-500 fill-1' : '!text-slate-300'}`}>favorite</span>
                    </button>

                    <div className="w-full h-full flex items-center justify-center relative">
                      <img
                        alt={product.name}
                        src={getMediaUrl(product.image)}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                        style={{ mixBlendMode: 'multiply' }}
                      />

                      {/* Sold Out Overlay */}
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-14 h-14 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-100 shadow-xl">
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-slate-800 text-center leading-tight">
                              SOLD<br />OUT
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col items-center w-full">
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="flex text-[#f9bc15] text-[10px] md:text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`fa-solid fa-star ${star <= (product.rating || 5) ? '' : 'text-slate-200'}`}></i>
                        ))}
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 ml-1">({product.reviewCount || 0} reviews)</span>
                    </div>

                    <h3 className="!text-[16px] md:!text-xl font-bold uppercase tracking-tight text-[#228b44] mb-1 px-1 !leading-[1.1] group-hover:opacity-80 transition-all text-center min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
                      {product.name}
                    </h3>

                    {/* Bottom Section - Pushed to bottom for alignment */}
                    <div className="mt-auto w-full">
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                        <span className="text-lg md:text-2xl font-bold text-[#228b44]">{formatPrice(product.price)}</span>

                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                          analytics.trackAddToCart(product);
                        }}
                        disabled={product.stock <= 0}
                        className="w-[95%] mx-auto btn-greenboard py-1.5 md:py-4 rounded-lg font-bold !text-[9px] md:!text-sm uppercase tracking-[0.2em] active:scale-95 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center relative overflow-hidden"
                      >
                        {product.stock <= 0 ? 'Out of Stock' : 'ADD TO CART'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section >
  );
};

export default React.memo(ProductGrid);
