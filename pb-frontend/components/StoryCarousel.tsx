import React, { useRef, useState, useEffect } from 'react';
import { Story, Product } from '../types';
import StoryModal from './StoryModal';
import { API_BASE_URL } from '../config';

interface StoryCarouselProps {
  stories: Story[];
  products: Product[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const getDriveId = (url: string) => {
  if (!url) return null;
  return url.match(/(?:id=|file\/d\/)([\w-]+)/)?.[1] || null;
};

const getDriveStreamUrl = (url: string) => {
  if (!url) return '';
  const fileId = getDriveId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  // If it's a relative media URL, prepend API_BASE_URL
  if (url.startsWith('/media/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

const StoryCard: React.FC<{
  story: Story;
  product?: Product;
  onClick: () => void;
  onProductClick: (p: Product) => void;
}> = ({ story, product, onClick, onProductClick }) => {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => { });
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    if (storyRef.current) {
      observer.observe(storyRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Always prefer the local optimized mediaUrl (MP4) over the originalDriveUrl to avoid ORB blocking
  const videoUrl = story.mediaUrl || story.originalDriveUrl || '';
  const isVideo = story.mediaType === 'video' ||
    (videoUrl || '').toLowerCase().includes('.mp4') ||
    (videoUrl || '').includes('drive.google.com');

  const videoSrc = getDriveStreamUrl(videoUrl);
  const driveId = getDriveId(videoUrl);
  const posterUrl = story.posterUrl ? (story.posterUrl.startsWith('/media/') ? `${API_BASE_URL}${story.posterUrl}` : story.posterUrl) :
    (driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w600` : undefined);

  const discount = product?.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      ref={storyRef}
      onClick={onClick}
      className="min-w-[260px] md:min-w-[300px] aspect-[9/16] rounded-[24px] overflow-hidden relative group snap-start flex-shrink-0 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-200"
    >
      {/* Background Story Media */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={videoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:scale-105 ${isInView ? 'opacity-100' : 'opacity-0'}`}
          muted
          loop
          playsInline
          poster={posterUrl}
          preload="metadata"
          aria-label="Social story video preview"
          onError={(e) => {
            console.error("Video load error:", e);
            // Fallback could be handled here if needed
          }}
        />
      ) : (
        <img
          src={getDriveStreamUrl(story.mediaUrl)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Social Story"
          onError={(e) => {
            console.error("Image load error:", e);
            e.currentTarget.src = "/placeholder-story.png"; // Example fallback
          }}
        />
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

      {/* Product Card at bottom */}
      {product && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onProductClick(product);
          }}
          className="absolute bottom-5 left-3 right-3 bg-white rounded-xl p-2.5 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-1 hover:scale-[1.01] border border-slate-100"
        >
          <div className="flex gap-3.5 items-center">
            <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center relative">
              <img src={product.image} className="w-14 h-14 object-contain" alt="Product" />
              {discount && (
                <div className="absolute -top-2 -left-2 bg-[#008a45] text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider rotate-[-5deg] shadow-sm z-10">
                  {discount}% OFF
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className="text-[10px] font-black leading-[1.1] line-clamp-2 uppercase tracking-tight"
                style={{ color: '#008a45' }}
              >
                {product.name.split('(')[0] || product.name}
              </h4>
              <div className="flex items-center gap-2 mt-0">
                <span className="text-[15px] font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[11px] text-slate-400 line-through decoration-slate-300">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories, products, onProductClick, onAddToCart }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState<{ story: Story, product: Product | null } | null>(null);

  const getProduct = (id: string) => products.find(p => String(p.id) === String(id));

  return (
    <section className="py-10 md:py-24 bg-whiteboard texture-overlay texture-speckles overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center">
        {/* Centered Header */}
        <div className="text-center mb-8 md:mb-16 relative w-full flex flex-col items-center">
          <span className="font-handdrawn text-2xl md:text-5xl text-secondary transform -rotate-3 inline-block z-10 whitespace-nowrap mb-0 md:mb-[-1rem] md:ml-[-18rem]">
            @pinobitehealth
          </span>
          <div className="relative inline-block">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[0.8] font-anton uppercase text-textured-green">Social stories</h2>
          </div>
        </div>

        {/* Centered Flex Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory justify-start md:justify-center w-full"
        >
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              product={getProduct(story.productId)}
              onClick={() => {
                const product = getProduct(story.productId);
                setActiveStory({ story, product: product || null });
              }}
              onProductClick={onProductClick}
            />
          ))}
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
