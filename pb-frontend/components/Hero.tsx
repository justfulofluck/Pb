
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

  // Filter only active slides just in case, though parent should handle this
  const activeSlides = slides.filter(s => s.isActive);
  
  // Fallback if no slides are active
  if (activeSlides.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-300">NO ACTIVE SLIDES</h1>
          <button onClick={onShopClick} className="mt-4 text-primary font-bold">Go to Shop</button>
        </div>
      </div>
    );
  }

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    setTimeout(() => setIsAnimating(false), 700); // Lock duration
  }, [isAnimating, activeSlides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating, activeSlides.length]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, nextSlide]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  return (
    <section 
      className="relative overflow-hidden h-[650px] md:h-[700px] flex items-center transition-colors duration-700 ease-in-out"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background & Decor */}
      {activeSlides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${slide.bgColor}`}
        >
           {/* Abstract blobs */}
           <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[100px] opacity-60 ${slide.blobColor}`}></div>
           <div className={`absolute top-1/2 -right-20 w-96 h-96 rounded-full blur-[100px] opacity-60 ${slide.blobColor}`}></div>
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Text Content */}
          <div className="order-2 md:order-1 relative h-[300px] flex items-center">
             {activeSlides.map((slide, index) => (
               <div 
                 key={slide.id} 
                 className={`absolute inset-0 flex flex-col justify-center text-center md:text-left transition-all duration-700 ease-out ${
                   index === currentSlide 
                    ? 'opacity-100 translate-y-0 pointer-events-auto delay-100' 
                    : 'opacity-0 translate-y-8 pointer-events-none'
                 }`}
               >
                 <span className={`inline-block font-black uppercase tracking-[0.2em] text-sm mb-4 ${slide.accentColor}`}>
                   {slide.category}
                 </span>
                 
                 <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                   {slide.headline}
                 </h1>
                 
                 <p className="text-lg md:text-xl text-slate-600 mb-8 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                   {slide.description}
                 </p>
                 
                 <div className="flex justify-center md:justify-start">
                   <button 
                     onClick={onShopClick}
                     className="bg-slate-900 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:bg-primary transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
                   >
                     {slide.cta}
                     <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                   </button>
                 </div>
               </div>
             ))}
          </div>

          {/* Image Content */}
          <div className="order-1 md:order-2 relative h-[300px] md:h-[500px] flex items-center justify-center">
             {activeSlides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`absolute w-full flex justify-center transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${
                    index === currentSlide 
                      ? 'opacity-100 scale-100 rotate-0 translate-y-0 blur-0 z-20' 
                      : index < currentSlide // Slide passed
                        ? 'opacity-0 scale-50 -rotate-12 -translate-x-full blur-sm z-0'
                        : 'opacity-0 scale-50 rotate-12 translate-x-full blur-sm z-0' // Slide coming
                  }`}
                >
                  <div className="relative w-full max-w-[320px] md:max-w-md">
                    {/* Decorative ring */}
                    <div className={`absolute inset-0 border-2 rounded-full transform scale-110 rotate-12 opacity-0 transition-opacity duration-1000 delay-500 ${index === currentSlide ? 'opacity-20' : ''} ${slide.accentColor.replace('text-', 'border-')}`}></div>
                    
                    <img 
                      alt={slide.headline} 
                      className="w-full h-auto object-contain drop-shadow-2xl" 
                      src={slide.image} 
                    />
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Navigation - Bottom */}
      <div className="absolute bottom-6 md:bottom-12 left-0 w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end">
           {/* Progress/Dots */}
           <div className="flex gap-3">
             {activeSlides.map((slide, index) => (
               <button
                 key={index}
                 onClick={() => goToSlide(index)}
                 className={`h-1.5 rounded-full transition-all duration-500 ${
                   index === currentSlide 
                    ? `w-12 ${slide.accentColor.replace('text-', 'bg-')}` 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                 }`}
                 aria-label={`Go to slide ${index + 1}`}
               />
             ))}
           </div>

           {/* Arrow Controls */}
           <div className="hidden md:flex gap-3">
             <button 
               onClick={prevSlide}
               className="w-12 h-12 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:shadow-lg transition-all active:scale-90"
             >
               <span className="material-symbols-outlined text-slate-900">arrow_back</span>
             </button>
             <button 
               onClick={nextSlide}
               className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary hover:shadow-lg transition-all active:scale-90 shadow-xl"
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
