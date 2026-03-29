
import React from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onProductClick, isLoading }) => {
  // Skeleton loader component matching the new style
  const LoadingSkeleton = () => (
    <div className="flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4"></div>
      <div className="w-3/4 h-5 bg-slate-200 rounded mb-2 mx-auto"></div>
      <div className="w-1/2 h-4 bg-slate-200 rounded mb-2 mx-auto"></div>
      <div className="w-full h-4 bg-slate-200 rounded mb-4 mx-auto"></div>
      <div className="w-full h-12 bg-slate-200 rounded-lg"></div>
    </div>
  );

  return (
    <section id="products" className="py-24 bg-whiteboard texture-overlay texture-speckles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="bg-[#008a45] text-white font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-sm -rotate-2 mb-2 inline-block shadow-sm">
            Our Favorites
          </div>
          <h2 className="text-6xl md:text-8xl text-[#008a45] tracking-tight leading-none mb-4" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
            Customer's Favourite
          </h2>
          <div className="w-24 h-1 bg-[#008a45] rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[4/5] bg-white/50 rounded-2xl mb-4"></div>
                <div className="w-3/4 h-5 bg-white/50 rounded mb-2 mx-auto"></div>
                <div className="w-1/2 h-4 bg-white/50 rounded mx-auto"></div>
              </div>
            ))
          ) : (
            products.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col h-full text-center cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  {/* Image Area */}
                  <div className="relative aspect-[4/5] w-full mb-8 transition-transform duration-500 group-hover:-translate-y-2">
                    {/* Discount Badge */}
                    {discount && (
                      <div className="absolute top-0 left-0 z-20 w-14 h-14 bg-[#d32f2f] rounded-full flex flex-col items-center justify-center text-white leading-none shadow-lg">
                        <span className="text-[14px] font-black">{discount}%</span>
                        <span className="text-[8px] font-black uppercase">OFF</span>
                      </div>
                    )}

                    {/* Heart Icon */}
                    <div className="absolute top-2 right-2 z-20 p-2 text-white/30 group-hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined fill-1 text-2xl">favorite</span>
                    </div>

                    <div className="w-full h-full flex items-center justify-center relative">
                      <img
                        alt={product.name}
                        src={product.image}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                        style={{ mixBlendMode: 'multiply' }}
                      />

                      {/* Sold Out Overlay */}
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-100 shadow-xl">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800 text-center leading-tight">
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

                    <h3 className="text-sm md:text-xl font-bold uppercase tracking-tight text-[#228b44] mb-2 px-2 leading-tight group-hover:opacity-80 transition-all text-center min-h-[2.5rem] md:min-h-[3.5rem] flex items-center justify-center">
                      {product.name}
                    </h3>

                    {/* Bottom Section - Pushed to bottom for alignment */}
                    <div className="mt-auto w-full">
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                        <span className="text-base md:text-2xl font-bold text-[#228b44]">Rs. {product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs md:text-sm font-medium text-slate-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                        disabled={product.stock <= 0}
                        className="w-full bg-[#228b44] text-white py-2 md:py-4 rounded-md font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-md hover:bg-slate-900 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        {product.stock <= 0 ? 'Out of Stock' : (
                          <>
                            ADD TO CART
                            <i className="fa-solid fa-cart-shopping text-[10px] md:text-sm"></i>
                          </>
                        )}
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

export default ProductGrid;
