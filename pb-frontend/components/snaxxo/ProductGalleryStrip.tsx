import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { getMediaUrl } from '../../utils/mediaHelper';

interface ProductGalleryStripProps {
    product: Product;
}

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511381939415-322199ae53d5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508029091899-59990abc4b8d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop"
];

export const ProductGalleryStrip: React.FC<ProductGalleryStripProps> = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const [activeIndex, setActiveIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const galleryImages = (product.gallery && Array.isArray(product.gallery))
        ? product.gallery.filter(g => typeof g === 'string' && g.trim() !== '' && !g.includes('undefined'))
        : [];

    const galleryItems = [
        {
            url: (galleryImages[0] && galleryImages[0].length > 5)
                ? galleryImages[0]
                : (product.mainIngredientImage && product.mainIngredientImage.length > 5 && (product.mainIngredientImage.startsWith('http') || product.mainIngredientImage.startsWith('/')))
                    ? product.mainIngredientImage
                    : FALLBACK_IMAGES[0],
            title: product.mainIngredient || "100% Roasted Peanuts",
        },
        {
            url: (galleryImages[1] && galleryImages[1].length > 5)
                ? galleryImages[1]
                : FALLBACK_IMAGES[1],
            title: "Product Highlights",
        },
        {
            url: (galleryImages[2] && galleryImages[2].length > 5)
                ? galleryImages[2]
                : (product.image && (product.image.startsWith('http') || product.image.startsWith('/')))
                    ? product.image
                    : FALLBACK_IMAGES[2],
            title: product.name,
        },
        {
            url: (galleryImages[3] && galleryImages[3].length > 5)
                ? galleryImages[3]
                : FALLBACK_IMAGES[3],
            title: "Rich Nutrition",
        },
        {
            url: (galleryImages[4] && galleryImages[4].length > 5)
                ? galleryImages[4]
                : FALLBACK_IMAGES[4],
            title: "Zero Preservatives",
        }
    ];

    const handleImageError = (index: number) => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    const handleScroll = () => {
        const el = sliderRef.current;
        if (!el) return;
        const scrollLeft = el.scrollLeft;
        const itemWidth = el.scrollWidth / galleryItems.length;
        const index = Math.round(scrollLeft / itemWidth);
        setActiveIndex(Math.max(0, Math.min(galleryItems.length - 1, index)));
    };

    // Auto-scroll loop effect with user interaction pause
    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;

        let isInteracting = false;
        let autoplayInterval: NodeJS.Timeout;

        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                if (isInteracting) return;
                setActiveIndex((prev) => {
                    const nextIndex = (prev + 1) % galleryItems.length;
                    const itemWidth = el.scrollWidth / galleryItems.length;
                    el.scrollTo({
                        left: nextIndex * itemWidth,
                        behavior: 'smooth'
                    });
                    return nextIndex;
                });
            }, 3000);
        };

        const handleTouchStart = () => {
            isInteracting = true;
        };

        const handleTouchEnd = () => {
            isInteracting = false;
        };

        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchend', handleTouchEnd, { passive: true });

        startAutoplay();

        return () => {
            clearInterval(autoplayInterval);
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [galleryItems.length]);

    return (
        <section className="w-full py-12 md:py-20 bg-[#f2f2ec] font-satoshi overflow-hidden">
            <div className="w-full max-w-[98vw] lg:max-w-[1800px] mx-auto px-2 md:px-4">
                {/* Desktop Grid Layout (hidden on mobile/phones, visible on md and up) */}
                <div className="hidden md:grid md:grid-cols-5 gap-4 md:gap-5 lg:gap-6 w-full">
                    {galleryItems.map((item, idx) => {
                        const isFailed = imageErrors[idx];
                        const srcUrl = isFailed ? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length] : getMediaUrl(item.url);
                        
                        return (
                            <motion.div
                                key={idx}
                                className="w-full aspect-square rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative group bg-white"
                                whileHover={{ scale: 1.04, y: -4 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                onClick={() => setSelectedImage({ url: srcUrl, title: item.title })}
                            >
                                <img
                                    src={srcUrl}
                                    alt={item.title}
                                    onError={() => handleImageError(idx)}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile Slider Layout (visible only on mobile/phones) */}
                <div className="block md:hidden w-full relative">
                    <div
                        ref={sliderRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 -mx-4 scrollbar-none"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {/* Hidden scrollbar styling */}
                        <style>{`
                            .scrollbar-none::-webkit-scrollbar { display: none; }
                        `}</style>
                        {galleryItems.map((item, idx) => {
                            const isFailed = imageErrors[idx];
                            const srcUrl = isFailed ? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length] : getMediaUrl(item.url);

                            return (
                                <div
                                    key={idx}
                                    className="w-[78vw] sm:w-[60vw] aspect-square rounded-2xl overflow-hidden shadow-md snap-center flex-shrink-0 bg-white relative cursor-pointer"
                                    onClick={() => setSelectedImage({ url: srcUrl, title: item.title })}
                                >
                                    <img
                                        src={srcUrl}
                                        alt={item.title}
                                        onError={() => handleImageError(idx)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {typeof document !== 'undefined' && ReactDOM.createPortal(
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div
                                className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors font-bold text-lg"
                                >
                                    ✕
                                </button>
                                <div className="aspect-square w-full bg-black">
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedImage.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
};

export default ProductGalleryStrip;
