import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Story, Product } from '../types';
import StoryModal from './StoryModal';
import { getMediaUrl } from '../utils/mediaHelper';

interface StoryCarouselProps {
  stories: Story[];
  products: Product[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const getDriveId = (url: string) => {
  if (!url) return null;
  // Handle various Google Drive URL formats (d/ID, id=ID, open?id=ID)
  const match = url.match(/(?:id=|file\/d\/|open\?id=)([\w-]+)/);
  return match ? match[1] : null;
};

const getDriveStreamUrl = (url: string) => {
  if (!url) return '';

  // 1. If it's already a clean backend media path (starts with /media or media/)
  if (url.startsWith('/media/') || url.startsWith('media/')) {
    return getMediaUrl(url);
  }

  // 2. If it's a Google Drive URL, extract ID and return stream URL
  const fileId = getDriveId(url);
  if (fileId) {
    // Note: Google Drive direct download links can be finicky.
    // We use this as a secondary source if the local mediaUrl hasn't been processed yet.
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // 3. Fallback to general media resolver (handles absolute URLs, data URLs, etc.)
  return getMediaUrl(url);
};

const StoryCard = React.memo(({ story, product, onClick, onProductClick }: {
  story: Story;
  product?: Product;
  onClick: (story: Story) => void;
  onProductClick: (p: Product) => void;
}) => {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView) {
      // Small delay to avoid rapid play/pause race (AbortError)
      const playTimer = setTimeout(() => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { /* Browser blocked autoplay, poster will show */ });
        }
      }, 100);
      return () => clearTimeout(playTimer);
    } else {
      video.pause();
    }
  }, [isInView]);

  // Memory is automatically cleaned up when the component unmounts and the video element is removed from DOM.

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
  const posterUrl = story.posterUrl ? getMediaUrl(story.posterUrl) :
    (driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w600` : undefined);

  const discount = product?.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      ref={storyRef}
      onClick={() => onClick(story)}
      className="min-w-[260px] md:min-w-[300px] aspect-[9/16] rounded-[24px] overflow-hidden relative group snap-start flex-shrink-0 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-200"
    >
      {/* Background Story Media */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:scale-105"
          muted
          loop
          playsInline
          autoPlay={isInView}
          poster={posterUrl}
          preload="auto"
          aria-label="Social story video preview"
          onCanPlay={(e) => {
            // Restore visibility if it was hidden by a transient error
            e.currentTarget.style.opacity = '1';
          }}
          onError={(e) => {
            // Only hide if the video truly has no valid source
            const video = e.currentTarget;
            if (video.networkState === video.NETWORK_NO_SOURCE) {
              console.warn("Story video source not found");
              video.style.opacity = '0';
            }
          }}
        />
      ) : (
        <img
          src={getDriveStreamUrl(story.mediaUrl)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Social Story"
          onError={(e) => {
            console.error("Image load error:", e);
            e.currentTarget.src = "/placeholder-story.png";
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
            <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center relative bg-slate-50">
              <img src={getMediaUrl(product.image)} className="w-18 h-18 object-contain" alt="Product" />
              {discount && (
                <div className="absolute -top-2 -left-2 bg-[#008a45] text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider rotate-[-5deg] shadow-sm z-10">
                  {discount}% OFF
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className="force-anton leading-[1.2] line-clamp-3 uppercase tracking-wider [word-spacing:0.05em]"
                style={{ color: '#008a45', fontSize: '16px' }}
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
});

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories, products, onProductClick, onAddToCart }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState<{ story: Story, product: Product | null } | null>(null);

  const getProduct = useCallback((id: string) => products.find(p => String(p.id) === String(id)), [products]);

  const handleStoryClick = useCallback((story: Story) => {
    const product = getProduct(story.productId);
    setActiveStory({ story, product: product || null });
  }, [getProduct]);

  return (
    <section className="pt-2 pb-10 md:pt-10 md:pb-24 bg-whiteboard texture-overlay texture-speckles overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center">
        {/* Centered Header */}
        <div className="text-center mb-8 md:mb-16 relative w-full flex flex-col items-center">
          <span className="font-handdrawn text-xl md:text-3xl text-secondary transform -rotate-3 inline-block z-10 whitespace-nowrap mb-0 md:mb-[-0.5rem] md:ml-[-12rem]">
            @pinobitehealth
          </span>
          <div className="relative inline-block">
            <h2
              className="font-normal tracking-wide [word-spacing:0.05em] leading-[1.1] !font-anton uppercase text-textured-green text-[40px] lg:text-[72px]"
              style={{ textTransform: 'uppercase' }}
            >
              Social stories
            </h2>
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
              onClick={handleStoryClick}
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
