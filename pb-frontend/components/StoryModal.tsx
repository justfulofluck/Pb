import React, { useState, useEffect, useRef } from 'react';
import { Story, Product } from '../types';
import { getMediaUrl } from '../utils/mediaHelper';
import { API_BASE_URL } from '../config';

interface StoryModalProps {
    story: Story;
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

const getDriveId = (url: string) => {
    if (!url) return null;
    // Handle various Google Drive URL formats (d/ID, id=ID, open?id=ID)
    const match = url.match(/(?:id=|file\/d\/|open\?id=|\/d\/)([\w-]+)/);
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
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // 3. Fallback to general media resolver (handles absolute URLs, data URLs, etc.)
    return getMediaUrl(url);
};

const StoryModal: React.FC<StoryModalProps> = ({ story, product, onClose, onAddToCart }) => {
    const [isMuted, setIsMuted] = useState(true); // Start muted to comply with autoplay policies
    const videoRef = useRef<HTMLVideoElement>(null);

    // Fail-safe: Always prioritize local files (full or loop) over Drive links to avoid ORB blocking
    const videoUrl = story.fullVideoUrl || story.mediaUrl || story.originalDriveUrl || '';
    const isVideo = story.mediaType === 'video' ||
        (typeof videoUrl === 'string' && (
            videoUrl.toLowerCase().includes('.mp4') ||
            videoUrl.toLowerCase().includes('drive.google.com') ||
            videoUrl.includes('stories/')
        ));
    const driveId = getDriveId(videoUrl);

    // Prevent background scrolling while modal is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Capture video ref for cleanup
        const videoElement = videoRef.current;

        // Handle autoplay logic
        if (videoElement) {
            videoElement.play().catch(error => {
                console.warn("Autoplay blocked:", error);
                // Ensure we are muted if play fails
                setIsMuted(true);
            });
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);

            if (videoElement) {
                videoElement.pause();
            }
        };
    }, [onClose]);

    // Sync muted state explicitly to the DOM element
    useEffect(() => {
        const video = videoRef.current;
        if (video && !video.paused) {
            video.muted = isMuted;
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
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 md:bg-black/80 backdrop-blur-sm md:p-4 animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            {/* Desktop Close button */}
            <button
                onClick={onClose}
                className="hidden md:flex absolute top-6 right-6 text-white hover:text-orange-400 transition-colors z-[10]"
                aria-label="Close story modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Modal Container */}
            <div className="bg-black md:bg-white rounded-none md:rounded-[32px] overflow-hidden flex flex-col md:flex-row w-full h-full md:max-w-5xl md:h-[80vh] shadow-2xl relative animate-in zoom-in-95 duration-300">

                {/* Left Side / Full Screen Video Area */}
                <div
                    className={`absolute inset-0 md:relative md:inset-auto w-full h-full ${product ? 'md:w-1/2' : 'w-full'} bg-black flex items-center justify-center overflow-hidden cursor-pointer`}
                    onClick={() => setIsMuted(!isMuted)}
                >
                    {isVideo ? (
                        <video
                            ref={videoRef}
                            src={getDriveStreamUrl(videoUrl)}
                            poster={story.posterUrl ? getMediaUrl(story.posterUrl) :
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

                    {/* === MOBILE OVERLAYS === */}
                    <div className="md:hidden absolute inset-0 pointer-events-none">
                        {/* Gradients */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/80 to-transparent"></div>

                        {/* Top Header */}
                        <div className="absolute top-4 left-4 pointer-events-auto">
                            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Side Actions */}
                        <div className="absolute right-4 bottom-[200px] flex flex-col gap-4 pointer-events-auto items-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                className="w-11 h-11 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all border border-white/20"
                            >
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                )}
                            </button>
                        </div>

                        {/* Mobile Bottom Product Card */}
                        {product && (
                            <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                                <div className="bg-white/95 backdrop-blur-xl rounded-[20px] p-3 flex flex-col gap-3 shadow-2xl">
                                    <div className="flex gap-4 items-center px-1">
                                        <div className="w-[60px] h-[60px] bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 p-1 border border-slate-100">
                                            <img src={getMediaUrl(product.image)} className="w-full h-full object-contain" alt={product.name} />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-satoshi font-semibold text-slate-800 text-[15px] leading-none line-clamp-1">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-2 -mt-0.5">
                                                <span className="text-[14px] font-black text-slate-900 leading-none">₹{product.price.toLocaleString()}</span>
                                                {product.originalPrice && (
                                                    <span className="text-[14px] text-slate-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); onClose(); }}
                                        className="w-full bg-[#282828] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-black transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* === DESKTOP OVERLAYS === */}
                    <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                        {isMuted && (
                            <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                                <span className="text-white font-bold text-sm uppercase tracking-wider">Tap for sound</span>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:flex absolute right-4 bottom-4 flex-col gap-4 pointer-events-auto">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                            className="w-12 h-12 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all hover:scale-110 z-20"
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

                {/* Right Side: Product Details (Desktop Only) */}
                {product && (
                    <div className="hidden md:flex w-full md:w-1/2 h-full flex-col bg-white">
                        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 md:p-8">
                            <div className="bg-[#fff9f5] rounded-2xl p-6 flex justify-center items-center mb-6">
                                <img src={getMediaUrl(product.image)} className="w-48 h-48 object-contain transform hover:scale-105 transition-transform duration-500" alt={product.name} />
                            </div>

                            <h2 className="text-xl md:text-2xl font-black text-[#0b3d2e] leading-tight mb-3">
                                {product.name}
                            </h2>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-base text-slate-400 line-through decoration-slate-300">₹{product.originalPrice.toLocaleString()}</span>
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

export default React.memo(StoryModal);
