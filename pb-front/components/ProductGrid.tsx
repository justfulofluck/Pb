
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
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Customer's Favourite</h2>
           <p className="text-slate-500 font-medium text-lg">The most loved nutrition staples by our community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {isLoading ? (
             [...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)
          ) : (
            products.map((product) => (
              <div 
                key={product.id}
                className="group flex flex-col"
              >
                {/* Image Area - Square as per screenshot */}
                <div 
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-50"
                  onClick={() => onProductClick(product)}
                >
                   <img 
                     alt={product.name} 
                     src={product.image} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   
                   {/* Price Badge - Bottom Right as per screenshot */}
                   <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                      <span className="font-black text-slate-900 text-sm">₹{product.price.toFixed(0)}</span>
                   </div>

                   {/* Best Seller Tag - Top Left */}
                   {product.isTopRated && (
                     <div className="absolute top-4 left-4">
                        <span className="bg-secondary text-slate-900 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm">
                          Top Rated
                        </span>
                     </div>
                   )}

                   {/* Sold Out Overlay */}
                   {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">Sold Out</span>
                      </div>
                   )}
                </div>
  
                {/* Content Area - Centered as per screenshot */}
                <div className="mt-6 flex flex-col items-center text-center">
                  <h3 
                    className="font-bold text-xl text-slate-900 mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-1"
                    onClick={() => onProductClick(product)}
                  >
                    {product.name}
                  </h3>

                  {/* Rating - Centered star style */}
                  <div className="flex items-center gap-1.5 mb-4">
                     <span className="material-symbols-outlined text-secondary fill-1 text-lg">star</span>
                     <span className="font-bold text-slate-900 text-sm">{product.rating}</span>
                  </div>
  
                  {/* Description - Brief summary */}
                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6 max-w-[240px]">
                    {product.description}
                  </p>
  
                  {/* Action - Black Button as per screenshot */}
                  <button 
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full bg-slate-950 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
