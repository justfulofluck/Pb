
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroSlide } from '../types';

interface HeroProps {
  onShopClick: () => void;
  slides: HeroSlide[];
}

const Hero: React.FC<HeroProps> = ({ onShopClick, slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef<any>(null);

  // Handle undefined or empty slides array - NEVER return early before all hooks
  const validSlides = slides && Array.isArray(slides) ? slides : [];

  // Filter only active slides - do this consistently
  const activeSlides = validSlides.filter(s => s && s.isActive === true);

  const nextSlide = useCallback(() => {
    if (isAnimating || activeSlides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating || activeSlides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, activeSlides.length]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide || activeSlides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  useEffect(() => {
    if (isAutoPlaying && activeSlides.length > 0) {
      autoPlayRef.current = setInterval(nextSlide, 7000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, nextSlide, activeSlides.length]);

  // EARLY RETURN AFTER ALL HOOKS - This is the key fix!
  if (activeSlides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-whiteboard texture-overlay texture-speckles">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-300">NO ACTIVE SLIDES</h1>
          <button onClick={onShopClick} className="mt-4 text-primary font-bold">Go to Shop</button>
        </div>
      </div>
    );
  }

  const handleAction = (url: string | undefined) => {
    if (url) {
      // Check if it's an internal link or external
      if (url.startsWith('http') || url.startsWith('www')) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    } else {
      onShopClick();
    }
  };

  // Transition Helper
  const getTransitionStyles = (slide: HeroSlide, index: number) => {
    const isActive = index === currentSlide;
    const type = slide.transitionType || 'fade';

    if (type === 'slide') {
      return {
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateX(0)' : index < currentSlide ? 'translateX(-100%)' : 'translateX(100%)',
        zIndex: isActive ? 10 : 0
      };
    }

    if (type === 'scale') {
      return {
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'scale(1)' : 'scale(0.8)',
        zIndex: isActive ? 10 : 0
      };
    }

    // Default: Fade
    return {
      opacity: isActive ? 1 : 0,
      zIndex: isActive ? 10 : 0
    };
  };

  return (
    <section
      className="relative overflow-hidden h-[90vh] md:h-screen flex items-center bg-whiteboard texture-overlay texture-speckles"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background & Decor */}
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          style={getTransitionStyles(slide, index)}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${slide.bgColor}`}
        >
          {/* Abstract blobs */}
          <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-50 animate-pulse ${slide.blobColor}`}></div>
          <div className={`absolute top-1/2 -right-20 w-96 h-96 rounded-full blur-[120px] opacity-50 animate-pulse ${slide.blobColor}`} style={{ animationDelay: '2s' }}></div>
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Text Content */}
          <div className="order-2 md:order-1 relative h-[450px] md:h-[500px] flex items-center">
            {activeSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 flex flex-col justify-center text-center md:text-left transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${index === currentSlide
                  ? 'opacity-100 translate-y-0 pointer-events-auto delay-300'
                  : 'opacity-0 translate-y-12 pointer-events-none'
                  }`}
              >
                <span className={`inline-block font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 ${slide.accentColor} font-satoshi`}>
                  {slide.category}
                </span>

                <h1 className="text-5xl md:text-8xl font-normal text-slate-900 leading-[0.9] mb-8 tracking-tight font-anton !normal-case">
                  {slide.headline}
                </h1>



                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <button
                    onClick={() => handleAction(slide.ctaLink)}
                    className="bg-slate-900 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-primary transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
                  >
                    {slide.cta || 'SHOP NOW'}
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>

                  {slide.secondaryCta && (
                    <button
                      onClick={() => handleAction(slide.secondaryCtaLink)}
                      className="bg-white/50 backdrop-blur-md border border-slate-200 text-slate-900 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                    >
                      {slide.secondaryCta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Image Content */}
          <div className="order-1 md:order-2 relative h-[350px] md:h-[650px] flex items-center justify-center">
            {activeSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute w-full flex justify-center transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${index === currentSlide
                  ? 'opacity-100 scale-100 rotate-0 translate-y-0 blur-0 z-20 delay-150'
                  : 'opacity-0 scale-75 rotate-12 translate-x-20 blur-md z-0'
                  }`}
              >
                <div className="relative w-full max-w-[280px] md:max-w-lg">
                  {/* Glassmorphic card background effect */}
                  <div className={`absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-full transform scale-90 -rotate-6 opacity-0 transition-opacity duration-1000 delay-500 ${index === currentSlide ? 'opacity-100' : ''}`}></div>

                  <img
                    alt={slide.headline}
                    className="relative w-full h-auto object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-700"
                    src={slide.image}
                  />

                  {/* Secondary small floating asset if needed, or just a ring */}
                  <div className={`absolute -bottom-10 -right-10 w-40 h-40 border-2 rounded-full transform rotate-45 opacity-0 transition-all duration-1000 delay-700 ${index === currentSlide ? 'opacity-20 scale-110' : ''} ${slide.accentColor.replace('text-', 'border-')}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation - Bottom */}
      <div className="absolute bottom-8 md:bottom-16 left-0 w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Progress/Dots */}
          <div className="flex gap-4">
            {activeSlides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`group relative py-4`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide
                  ? `w-16 ${slide.accentColor.replace('text-', 'bg-')}`
                  : 'w-4 bg-slate-300 group-hover:bg-slate-400 group-hover:w-8'
                  }`} />
              </button>
            ))}
          </div>

          {/* Arrow Controls */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md flex items-center justify-center hover:bg-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-slate-900">arrow_back</span>
            </button>
            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all active:scale-90 shadow-xl"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
