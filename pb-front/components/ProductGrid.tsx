import React from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onProductClick, isLoading }) => {
  // Skeleton loader component
  const LoadingSkeleton = () => (
    <div className="min-w-[220px] md:min-w-[260px] flex flex-col items-center animate-pulse mx-4">
      <div className="w-full aspect-[4/5] bg-slate-200/50 rounded-[24px] mb-4"></div>
      <div className="w-16 h-3 bg-slate-200/50 rounded mb-2"></div>
      <div className="w-3/4 h-4 bg-slate-200/50 rounded mb-2"></div>
      <div className="w-1/2 h-6 bg-slate-200/50 rounded mb-3"></div>
      <div className="w-full h-10 bg-slate-200/50 rounded-full max-w-[180px]"></div>
    </div>
  );

  // Duplicate products to create seamless loop
  const displayProducts = [...products, ...products];

  return (
    <section id="products" className="py-12 bg-[#dbead5] relative overflow-hidden">
       {/* Background gradient overlay for depth */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#dbead5] to-[#cedbc8] pointer-events-none"></div>

      <div className="max-w-full relative z-10">
        <div className="flex flex-col items-center text-center mb-10 px-4">
           <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">Customer's Favourite</h2>
           <p className="font-handdrawn text-lg mt-1 text-slate-600">Join 100k+ happy healthy eaters! 🥳</p>
        </div>

        {/* Scroll/Marquee Container */}
        <div className="relative w-full overflow-hidden">
          <div 
            className={`flex ${isLoading ? 'justify-center gap-6' : 'w-max animate-marquee hover:[animation-play-state:paused]'}`}
          >
            {isLoading ? (
               // Show skeletons filling the screen
               [...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)
            ) : (
              displayProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`}
                  className="min-w-[220px] md:min-w-[260px] mx-4 group flex flex-col items-center"
                >
                  {/* Image Area */}
                  <div 
                    className="relative w-full aspect-[4/5] rounded-[24px] mb-4 cursor-pointer overflow-visible"
                    onClick={() => onProductClick(product)}
                  >
                     {/* Product Image - with hover lift effect */}
                     <img 
                       alt={product.name} 
                       src={product.image} 
                       className={`w-full h-full object-contain drop-shadow-xl hover:scale-110 transition-transform duration-500 ease-out z-10 relative ${product.stock <= 0 ? 'grayscale opacity-60' : ''}`}
                     />
                     
                     {/* Tags */}
                     <div className="absolute top-3 left-0 right-0 flex justify-between px-2 z-20">
                        {product.isTopRated && (
                          <span className="bg-[#f9bc15] text-slate-900 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-widest shadow-sm">
                            Best Seller
                          </span>
                        )}
                        {product.stock <= 0 && (
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-widest shadow-sm ml-auto">
                            Sold Out
                          </span>
                        )}
                     </div>
                  </div>
    
                  {/* Content Area */}
                  <div className="text-center space-y-2 w-full px-2">
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1">
                       <div className="flex text-secondary">
                         {[...Array(5)].map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-sm ${i < Math.floor(product.rating) ? 'fill-1' : ''}`}>star</span>
                         ))}
                       </div>
                       <span className="text-slate-600 text-[10px] font-bold pt-0.5">({product.reviewCount})</span>
                    </div>
    
                    {/* Title */}
                    <h3 
                      className="font-black text-base leading-tight uppercase text-slate-900 cursor-pointer hover:text-primary transition-colors line-clamp-2 h-10 flex items-center justify-center"
                      onClick={() => onProductClick(product)}
                    >
                      {product.name}
                    </h3>
    
                    {/* Price */}
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="font-black text-lg text-slate-900">Rs. {product.price.toFixed(0)}</span>
                      {product.originalPrice && (
                        <span className="text-xs font-bold text-slate-400 line-through decoration-2">Rs. {product.originalPrice.toFixed(0)}</span>
                      )}
                    </div>
    
                    {/* CTA */}
                    <button 
                      onClick={() => onAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full bg-[#008a45] text-white py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#006837] hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none max-w-[200px]"
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;