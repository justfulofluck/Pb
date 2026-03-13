
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
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory justify-start md:justify-center w-full"
        >
          {stories.map((story) => {
            const product = getProduct(story.productId);
            return (
              <div 
                key={story.id}
                className="min-w-[260px] md:min-w-[300px] aspect-[9/16] rounded-[24px] overflow-hidden relative group snap-start flex-shrink-0 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
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

                {/* Product Card at bottom - Sleek Retail Design */}
                {product && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="absolute bottom-3 left-3 right-3 bg-white rounded-xl p-2.5 shadow-xl transform transition-all duration-500 group-hover:-translate-y-1 hover:scale-[1.01] border border-slate-100"
                  >
                    <div className="flex gap-2.5 items-center">
                      <div className="w-12 h-12 rounded-lg bg-white flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-50">
                        <img src={product.image} className="w-11 h-11 object-contain" alt="Product" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[12px] font-bold text-slate-900 leading-[1.2] line-clamp-2">
                          {product.name.split('(')[0] || product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[12px] font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through decoration-slate-300">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoryCarousel;
