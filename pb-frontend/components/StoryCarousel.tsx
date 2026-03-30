import React, { useRef, useState } from 'react';
import { Story, Product } from '../types';
import StoryModal from './StoryModal';

interface StoryCarouselProps {
  stories: Story[];
  products: Product[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories, products, onProductClick, onAddToCart }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState<{ story: Story, product: Product } | null>(null);

  const getProduct = (id: string) => products.find(p => p.id === id);

  return (
    <section className="py-10 md:py-24 bg-whiteboard texture-overlay texture-speckles overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center">
        {/* Centered Header */}
        <div className="text-center mb-8 md:mb-16 relative w-full flex flex-col items-center">
          <span className="font-handdrawn text-3xl md:text-4xl text-secondary/80 transform -rotate-3 inline-block z-10 whitespace-nowrap mb-[-0rem] md:mb-[-0.5rem] ml-[-10rem] md:ml-[-14rem]">
            @pinobitehealth
          </span>
          <div className="relative inline-block">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[0.9] font-anton !normal-case text-textured-green">Social stories</h2>
          </div>
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
                onClick={() => {
                  if (product) setActiveStory({ story, product });
                }}
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
                    className="absolute bottom-5 left-3 right-3 bg-white rounded-xl p-2.5 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-1 hover:scale-[1.01] border border-slate-100"
                  >
                    <div className="flex gap-3.5 items-center">
                      <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <img src={product.image} className="w-18 h-18 object-contain" alt="Product" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-900 leading-[1.2] line-clamp-2">
                          {product.name.split('(')[0] || product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0">
                          <span className="text-[15px] font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through decoration-slate-300">₹{product.originalPrice.toLocaleString()}</span>
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
      {activeStory && (
        <StoryModal
          story={activeStory.story}
          product={activeStory.product}
          onAddToCart={onAddToCart}
          onClose={() => setActiveStory(null)}
        />
      )}
    </section>
  );
};

export default StoryCarousel;
