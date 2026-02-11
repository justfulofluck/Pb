
import React, { useRef } from 'react';
import { Story, Product } from '../types';

interface StoryCarouselProps {
  stories: Story[];
  products: Product[];
  onProductClick: (p: Product) => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories, products, onProductClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getProduct = (id: string) => products.find(p => p.id === id);

  return (
    <section className="py-12 bg-[#fff5f0] overflow-hidden border-y border-orange-100/50">
      <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center">
        {/* Centered Header */}
        <div className="mb-8 flex flex-col items-center text-center gap-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400">Social Stories</h3>
           <span className="font-handdrawn text-orange-300 text-2xl">@pinobitehealth</span>
        </div>
        
        {/* Centered Flex Container */}
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory justify-start md:justify-center w-full"
        >
          {stories.map((story) => {
            const product = getProduct(story.productId);
            return (
              <div 
                key={story.id}
                className="min-w-[130px] md:min-w-[160px] h-[230px] md:h-[280px] rounded-[18px] overflow-hidden relative group snap-start flex-shrink-0 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500"
              >
                {/* Background Story Media */}
                {story.mediaType === 'video' ? (
                  <video 
                    src={story.mediaUrl} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img 
                    src={story.mediaUrl} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Social Story"
                  />
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {/* Product Card at bottom - Very Compact version */}
                {product && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="absolute bottom-2 left-2 right-2 bg-white rounded-lg p-1.5 shadow-lg transform transition-transform duration-500 group-hover:-translate-y-0.5 hover:scale-[1.02]"
                  >
                    <div className="flex gap-1.5 items-center">
                      <div className="w-7 h-7 rounded bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100">
                        <img src={product.image} className="w-full h-full object-contain p-0.5" alt="Product" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-[8px] font-black uppercase text-slate-900 leading-tight truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-baseline gap-1 mt-0">
                          <span className="text-[9px] font-black text-slate-900">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-[7px] text-slate-400 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Story Progress Indicator (Top) - Thin */}
                <div className="absolute top-2 left-2 right-2 flex gap-0.5">
                  <div className="h-0.5 flex-1 bg-white/40 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                  </div>
                  <div className="h-0.5 flex-1 bg-white/20 rounded-full" />
                  <div className="h-0.5 flex-1 bg-white/20 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoryCarousel;
