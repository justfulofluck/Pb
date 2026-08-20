import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';

interface HangingPolaroidGalleryProps {
  product: Product;
}

export const HangingPolaroidGallery: React.FC<HangingPolaroidGalleryProps> = ({ product }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Extract images from usage ideas or default high quality brand imagery
  const usageImages = (product.usageIdeas || [])
    .map(u => ({ url: u.image, title: u.title }))
    .filter(u => u.url && u.url.trim() !== '' && !u.url.includes('undefined'));

  const defaultCards = [
    {
      url: (product.mainIngredientImage && product.mainIngredientImage.length > 5) 
        ? product.mainIngredientImage 
        : "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop",
      caption: product.mainIngredient || "100% Roasted Peanuts",
      rotation: -10,
      yOffset: 0,
      clipColor: "#d4af37" // Gold
    },
    {
      url: (usageImages[0]?.url && usageImages[0].url.length > 5) 
        ? usageImages[0].url 
        : "https://images.unsplash.com/photo-1511381939415-322199ae53d5?q=80&w=800&auto=format&fit=crop",
      caption: usageImages[0]?.title || "Velvety Spread Toast",
      rotation: 6,
      yOffset: 32,
      clipColor: "#c0c0c0" // Silver
    },
    {
      url: product.image || "https://images.unsplash.com/photo-1508029091899-59990abc4b8d?q=80&w=800&auto=format&fit=crop",
      caption: product.name,
      rotation: -2,
      yOffset: 54,
      clipColor: "#e5a93b" // Warm Gold
    },
    {
      url: (usageImages[1]?.url && usageImages[1].url.length > 5) 
        ? usageImages[1].url 
        : "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop",
      caption: usageImages[1]?.title || "High Protein Fuel",
      rotation: 7,
      yOffset: 32,
      clipColor: "#c0c0c0" // Silver
    },
    {
      url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop",
      caption: "Zero Preservatives",
      rotation: -9,
      yOffset: 0,
      clipColor: "#d4af37" // Gold
    }
  ];

  // Floating sparkle stars configuration
  const sparkleStars = [
    { top: "8%", left: "8%", size: 24, duration: 3.2, color: "#ffd700", parallaxFactor: 0.8 },
    { top: "18%", left: "28%", size: 18, duration: 2.5, color: "#ffffff", parallaxFactor: -0.6 },
    { top: "6%", left: "50%", size: 28, duration: 4.0, color: "#ffdf00", parallaxFactor: 1.0 },
    { top: "22%", left: "72%", size: 20, duration: 2.8, color: "#ffffff", parallaxFactor: -0.7 },
    { top: "10%", left: "92%", size: 26, duration: 3.5, color: "#ffd700", parallaxFactor: 0.9 },
    { top: "65%", left: "15%", size: 16, duration: 3.0, color: "#ffffff", parallaxFactor: -0.5 },
    { top: "72%", left: "85%", size: 22, duration: 2.7, color: "#ffe066", parallaxFactor: 0.7 },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Keyboard navigation & body scroll lock for popup
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') setSelectedIndex(prev => (prev! + 1) % defaultCards.length);
      if (e.key === 'ArrowLeft') setSelectedIndex(prev => (prev! - 1 + defaultCards.length) % defaultCards.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, defaultCards.length]);

  return (
    <div 
      className="hidden md:block w-full relative pt-2 pb-16 md:pb-24 overflow-visible z-20 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hanging Wire Container */}
      <div className="relative w-full min-h-[340px] sm:min-h-[380px] md:min-h-[460px] flex items-center justify-center overflow-visible">
        
        {/* Animated Floating Sparkle Stars */}
        {sparkleStars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none z-30 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] hidden sm:block"
            style={{ top: star.top, left: star.left }}
            animate={{
              x: mousePos.x * star.parallaxFactor * 60,
              y: [0, -14, 0],
              scale: [0.85, 1.25, 0.85],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 45, 0]
            }}
            transition={{
              y: { duration: star.duration, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: star.duration, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: star.duration, repeat: Infinity, ease: 'easeInOut' },
              x: { type: 'spring', stiffness: 120, damping: 18 }
            }}
          >
            <svg width={star.size} height={star.size} viewBox="0 0 24 24" fill={star.color}>
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
            </svg>
          </motion.div>
        ))}

        {/* Curved String / Wire SVG stretching past left & right screen borders */}
        <svg
          className="absolute top-2 -left-[20%] w-[140%] h-32 sm:h-40 md:h-44 pointer-events-none z-0 overflow-visible"
          viewBox="0 0 2000 160"
          preserveAspectRatio="none"
        >
          <path
            d="M -300 20 Q 1000 170 2300 20"
            fill="none"
            stroke="rgba(0, 0, 0, 0.45)"
            strokeWidth="8"
          />
          <path
            d="M -300 20 Q 1000 170 2300 20"
            fill="none"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="3.5"
            strokeDasharray="10 5"
          />
        </svg>

        {/* Polaroid Cards Container Responsive layout for Mobile & Tablet */}
        <div className="relative w-full z-10 flex flex-nowrap items-center justify-start md:justify-between px-4 sm:px-8 md:px-12 lg:px-16 gap-4 sm:gap-6 md:gap-8 lg:gap-10 pt-8 sm:pt-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-4 md:pb-0">
          {defaultCards.map((card, idx) => {
            // Calculate interactive mouse parallax response for each card
            const parallaxX = mousePos.x * (idx % 2 === 0 ? 25 : -25);
            const parallaxY = card.yOffset + mousePos.y * (idx % 2 === 0 ? 16 : -16);
            const parallaxRotate = card.rotation + mousePos.x * (idx % 2 === 0 ? 8 : -8);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: card.yOffset + 30, rotate: card.rotation }}
                animate={{ 
                  opacity: 1, 
                  x: parallaxX,
                  y: parallaxY, 
                  rotate: parallaxRotate 
                }}
                whileHover={{ scale: 1.14, rotate: 0, zIndex: 40, y: card.yOffset - 14 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                onClick={() => setSelectedIndex(idx)}
                className="relative snap-center flex-shrink-0 md:flex-shrink md:flex-1 w-[68vw] sm:w-[42vw] md:w-auto min-w-[160px] max-w-[220px] sm:max-w-[240px] md:max-w-[250px] lg:max-w-[270px] group cursor-pointer"
              >
                {/* Metallic Binder Clip Icon */}
                <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg">
                  <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 40 40" fill="none">
                    <path
                      d="M12 12 L20 2 L28 12"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <rect
                      x="10"
                      y="10"
                      width="20"
                      height="10"
                      rx="2"
                      fill={card.clipColor}
                      stroke="#1e293b"
                      strokeWidth="1.5"
                    />
                    <line x1="12" y1="15" x2="28" y2="15" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                  </svg>
                </div>

                {/* Polaroid Frame */}
                <div className="bg-white p-3 sm:p-3.5 pt-3 sm:pt-3.5 pb-6 sm:pb-8 rounded-sm shadow-[0_15px_30px_rgba(0,0,0,0.35)] transition-all duration-300 border border-slate-100 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] w-full">
                  {/* Photo Image */}
                  <div className="w-full h-36 sm:h-44 md:h-48 lg:h-54 overflow-hidden rounded-xs bg-slate-100 relative">
                    <img
                      src={card.url}
                      alt={card.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop";
                      }}
                    />
                    {/* View Badge Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/90 text-slate-900 text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md tracking-wider uppercase transform scale-90 group-hover:scale-100 transition-transform">
                        🔍 View Photo
                      </span>
                    </div>
                  </div>

                  {/* Polaroid Caption */}
                  <div className="mt-2 sm:mt-3 text-center">
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm tracking-tight font-sans italic block truncate px-1">
                      {card.caption}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Touch Swipe Helper Prompt for Mobile */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-2 text-white/70 text-xs font-semibold tracking-wider uppercase">
        <span>←</span>
        <span>Swipe to explore photos</span>
        <span>→</span>
      </div>

      {/* POPUP LIGHTBOX MODAL PORTAL */}
      {typeof document !== 'undefined' && ReactDOM.createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              style={{ zIndex: 999999 }}
            >
              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white p-3 sm:p-6 pb-6 sm:pb-10 rounded-lg shadow-2xl max-w-[94vw] sm:max-w-xl md:max-w-2xl w-full max-h-[92vh] flex flex-col items-center"
                style={{ zIndex: 1000000 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center font-bold text-lg shadow-md z-40"
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* Prev Button */}
                <button
                  onClick={() => setSelectedIndex((prev) => (prev! - 1 + defaultCards.length) % defaultCards.length)}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center font-bold text-xl shadow-lg z-40"
                  aria-label="Previous"
                >
                  ‹
                </button>

                {/* Next Button */}
                <button
                  onClick={() => setSelectedIndex((prev) => (prev! + 1) % defaultCards.length)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center font-bold text-xl shadow-lg z-40"
                  aria-label="Next"
                >
                  ›
                </button>

                {/* Main Photo inside Lightbox */}
                <div className="w-full h-[55vw] max-h-[340px] sm:h-[380px] md:h-[480px] rounded-sm overflow-hidden bg-slate-900 flex items-center justify-center relative shadow-inner mt-6 sm:mt-0">
                  <img
                    src={defaultCards[selectedIndex].url}
                    alt={defaultCards[selectedIndex].caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Lightbox Caption */}
                <div className="mt-3 sm:mt-4 text-center">
                  <h3 className="text-lg sm:text-2xl font-bold font-sans italic text-slate-900 tracking-wide">
                    {defaultCards[selectedIndex].caption}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">
                    Photo {selectedIndex + 1} of {defaultCards.length}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default HangingPolaroidGallery;
