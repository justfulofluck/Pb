import React, { useState, useEffect } from 'react';
import { Story, Product } from '../types';

interface StoryModalProps {
    story: Story;
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

const getDriveStreamUrl = (url: string) => {
    if (!url) return '';
    const fileIdMatch = url.match(/(?:id=|file\/d\/)([\w-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
        // This trick streams the raw video bytes if it's small enough (avoiding virus scan page)
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
};

const StoryModal: React.FC<StoryModalProps> = ({ story, product, onClose, onAddToCart }) => {
    const [isMuted, setIsMuted] = useState(false);

    // Prevent background scrolling while modal is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Close when clicking backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const discountPercent = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            {/* Close button in top right of screen */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white hover:text-orange-400 transition-colors z-[10]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Modal Container */}
            <div className="bg-white rounded-2xl md:rounded-[32px] overflow-hidden flex flex-col md:flex-row w-full max-w-5xl h-[90vh] md:h-[80vh] shadow-2xl relative animate-in zoom-in-95 duration-300">

                {/* Left Side: Full Video */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black relative flex items-center justify-center overflow-hidden">
                    {story.originalDriveUrl ? (
                        <video
                            src={getDriveStreamUrl(story.originalDriveUrl)}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                        />
                    ) : (
                        <img
                            src={story.mediaUrl}
                            className="w-full h-full object-cover"
                            alt="Story fallback"
                        />
                    )}

                    {/* Video Controls Overlay */}
                    <div className="absolute right-4 bottom-4 flex flex-col gap-4">

                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Product Details */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-white">
                    <div className="flex-1 overflow-y-auto hide-scrollbar p-6 md:p-8">
                        <div className="bg-[#fff9f5] rounded-2xl p-6 flex justify-center items-center mb-6">
                            <img src={product.image} className="w-48 h-48 object-contain transform hover:scale-105 transition-transform duration-500" alt={product.name} />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3">
                            {product.name}
                        </h2>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-lg text-slate-400 line-through decoration-slate-300">₹{product.originalPrice.toLocaleString()}</span>
                                    <span className="bg-[#cdf0e1] text-[#00a862] text-xs font-bold px-2.5 py-1 rounded-md">
                                        {discountPercent}% off
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-sm font-bold text-slate-900 mb-2">Why Choose {product.name}?</p>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        {product.benefits && product.benefits.length > 0 && (
                            <>
                                <p className="text-sm font-bold text-slate-900 mb-3">Key Features:</p>
                                <ul className="space-y-2 mb-6 text-sm text-slate-700">
                                    {product.benefits.map((b, i) => (
                                        <li key={i} className="flex gap-2 items-start">
                                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    {/* Sticky Add to Cart Footer */}
                    <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100">
                        <button
                            onClick={() => {
                                onAddToCart(product);
                                onClose();
                            }}
                            className="w-full bg-[#1b263b] hover:bg-primary text-white font-bold py-4 rounded-xl transition-colors duration-300 shadow-xl shadow-[#1b263b]/20"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StoryModal;
