import React, { useState, useEffect, useRef } from 'react';
import { Story, Product } from '../types';
import { API_BASE_URL } from '../config';

interface StoryModalProps {
    story: Story;
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

const getDriveId = (url: string) => {
    if (!url) return null;
    return url.match(/(?:id=|file\/d\/)([\w-]+)/)?.[1] || null;
};

const getDriveStreamUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/media/')) {
        return `${API_BASE_URL}${url}`;
    }
    const fileId = getDriveId(url);
    if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return url;
};

const StoryModal: React.FC<StoryModalProps> = ({ story, product, onClose, onAddToCart }) => {
    const [isMuted, setIsMuted] = useState(true); // Start muted to comply with autoplay policies
    const videoRef = useRef<HTMLVideoElement>(null);

    // Fail-safe: Always prioritize local files (full or loop) over Drive links to avoid ORB blocking
    const videoUrl = story.fullVideoUrl || story.mediaUrl || story.originalDriveUrl || '';
    const isVideo = story.mediaType === 'video' || (videoUrl && (videoUrl.toLowerCase().includes('.mp4') || videoUrl.includes('drive.google.com')));

    // Prevent background scrolling while modal is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Handle autoplay logic
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.warn("Autoplay blocked:", error);
                // Ensure we are muted if play fails
                setIsMuted(true);
            });
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Sync muted state explicitly to the DOM element
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Close when clicking backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const discountPercent = product?.originalPrice
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
                aria-label="Close story modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Modal Container */}
            <div className="bg-white rounded-2xl md:rounded-[32px] overflow-hidden flex flex-col md:flex-row w-full max-w-5xl h-[90vh] md:h-[80vh] shadow-2xl relative animate-in zoom-in-95 duration-300">

                {/* Left Side: Full Video */}
                <div
                    className={`w-full ${product ? 'md:w-1/2 h-1/2 md:h-full' : 'w-full h-full'} bg-black relative flex items-center justify-center overflow-hidden cursor-pointer`}
                    onClick={() => setIsMuted(!isMuted)}
                >
                    {isVideo ? (
                        <video
                            ref={videoRef}
                            src={getDriveStreamUrl(videoUrl)}
                            poster={story.posterUrl ? (story.posterUrl.startsWith('/media/') ? `${API_BASE_URL}${story.posterUrl}` : story.posterUrl) :
                                (driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w800` : undefined)}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            aria-label="Social story video"
                            onError={(e) => console.error("Modal video error:", e)}
                        />
                    ) : (
                        <img
                            src={getDriveStreamUrl(story.mediaUrl)}
                            className="w-full h-full object-cover"
                            alt="Story fallback"
                            onError={(e) => {
                                console.error("Modal image error:", e);
                                e.currentTarget.src = "/placeholder-story.png";
                            }}
                        />
                    )}

                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {isMuted && (
                            <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                                <span className="text-white font-bold text-sm uppercase tracking-wider">Tap for sound</span>
                            </div>
                        )}
                    </div>

                    <div className="absolute right-4 bottom-4 flex flex-col gap-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
                            }}
                            className="w-12 h-12 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all hover:scale-110 z-20 pointer-events-auto"
                            aria-label={isMuted ? "Unmute video" : "Mute video"}
                        >
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Product Details */}
                {product && (
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
                )}

            </div>
        </div>
    );
};

export default StoryModal;
