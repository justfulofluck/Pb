
import React, { useRef, useState, useEffect } from 'react';
import { PressUpdate } from '../types';

interface PressUpdatesProps {
  pressUpdates: PressUpdate[];
}

const STATIC_PRESS_UPDATES: PressUpdate[] = [
  { id: 1, mediaHouse: 'Forbes', logo: 'https://ui-avatars.com/api/?name=Forbes&background=0b3d2e&color=fff&rounded=true&font-size=0.3', quote: "PinoBite is completely changing the healthy snacking game in India with their premium quality.", date: "2023-10-01" },
  { id: 2, mediaHouse: 'Vogue', logo: 'https://ui-avatars.com/api/?name=Vogue&background=fcc02a&color=fff&rounded=true&font-size=0.3', quote: "The most aesthetically pleasing and delicious peanut butter we've ever tasted.", date: "2023-10-15" },
  { id: 3, mediaHouse: 'GQ', logo: 'https://ui-avatars.com/api/?name=GQ&background=000&color=fff&rounded=true&font-size=0.3', quote: "A must-have staple for fitness enthusiasts who don't want to compromise on taste.", date: "2023-11-01" },
  { id: 4, mediaHouse: 'Elle', logo: 'https://ui-avatars.com/api/?name=Elle&background=e91e63&color=fff&rounded=true&font-size=0.3', quote: "We are obsessed with their dark chocolate variant. It's healthy indulgence at its best.", date: "2023-11-15" },
  { id: 5, mediaHouse: 'TechCrunch', logo: 'https://ui-avatars.com/api/?name=TC&background=4caf50&color=fff&rounded=true&font-size=0.3', quote: "An innovative D2C brand that's scaling rapidly thanks to unmatched product quality.", date: "2023-12-01" },
];

const PressUpdates: React.FC<PressUpdatesProps> = ({ pressUpdates: _ignored }) => {
  const pressUpdates = STATIC_PRESS_UPDATES;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el?.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let isPaused = false;

    const play = () => {
      if (!isPaused) {
        el.scrollLeft += 1;
        // Loop back seamlessly when near the end
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(play);
    };

    animationFrameId = requestAnimationFrame(play);

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, []);

  if (!pressUpdates.length) return null;

  return (
    <section className="py-[60px] bg-whiteboard texture-overlay texture-speckles relative overflow-hidden">
      {/* Header - Constrained */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-2">
          Viral Hit Group
        </span>
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tight leading-none">
          OMG Stop The Press!
        </h2>
      </div>

      {/* Carousel - Full Width */}
      <div className="relative w-full">
        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-4 md:px-8 xl:px-16 pb-12 pt-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* We duplicate the array to allow for a smoother infinite loop effect visually */}
          {[...pressUpdates, ...pressUpdates].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-[300px] sm:w-[340px]"
            >
              <div className="bg-white rounded-3xl p-8 h-full flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-50 hover:border-slate-100 group relative overflow-hidden">
                {/* Decorative Quote Mark */}
                <span className="absolute top-4 right-6 text-7xl font-serif text-slate-100 leading-none select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                  "
                </span>

                {/* Media House Logo */}
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-6 border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
                  <img
                    src={item.logo}
                    alt={item.mediaHouse}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Quote */}
                <p className="text-slate-700 font-medium leading-relaxed text-[15px] flex-1 relative z-10">
                  {item.quote}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default PressUpdates;
