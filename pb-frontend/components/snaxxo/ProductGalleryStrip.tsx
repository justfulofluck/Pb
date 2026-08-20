import React, { useState } from 'react';
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

    const usageImages = (product.usageIdeas || [])
        .map(u => ({ url: u.image, title: u.title }))
        .filter(u => u.url && u.url.trim() !== '' && !u.url.includes('undefined') && (u.url.startsWith('http') || u.url.startsWith('/')));

    const galleryItems = [
        {
            url: (product.mainIngredientImage && product.mainIngredientImage.length > 5 && (product.mainIngredientImage.startsWith('http') || product.mainIngredientImage.startsWith('/')))
                ? product.mainIngredientImage
                : FALLBACK_IMAGES[0],
            title: product.mainIngredient || "100% Roasted Peanuts",
        },
        {
            url: (usageImages[0]?.url && usageImages[0].url.length > 5)
                ? usageImages[0].url
                : FALLBACK_IMAGES[1],
            title: usageImages[0]?.title || "Velvety Spread Toast",
        },
        {
            url: (product.image && (product.image.startsWith('http') || product.image.startsWith('/')))
                ? product.image
                : FALLBACK_IMAGES[2],
            title: product.name,
        },
        {
            url: (usageImages[1]?.url && usageImages[1].url.length > 5)
                ? usageImages[1].url
                : FALLBACK_IMAGES[3],
            title: usageImages[1]?.title || "High Protein Fuel",
        },
        {
            url: FALLBACK_IMAGES[4],
            title: "Zero Preservatives",
        }
    ];

    const handleImageError = (index: number) => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    return (
        <section className="w-full py-8 md:py-14 bg-[#f2f2ec] font-satoshi">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                {/* 5-Column Responsive Grid that displays all 5 images on screen without clipping */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full">
                    {galleryItems.map((item, idx) => {
                        const isFailed = imageErrors[idx];
                        const srcUrl = isFailed ? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length] : getMediaUrl(item.url);
                        
                        return (
                            <motion.div
                                key={idx}
                                className="w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative group bg-white"
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
                                {/* Hover overlay with title */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 md:p-4">
                                    <span className="text-white font-bold text-xs sm:text-sm md:text-base tracking-wide drop-shadow-md leading-tight">
                                        {item.title}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
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
                                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                                <div className="aspect-square w-full bg-black">
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedImage.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-5 bg-white flex items-center justify-between">
                                    <h4 className="text-lg font-bold text-slate-900">{selectedImage.title}</h4>
                                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Pinobite</span>
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
