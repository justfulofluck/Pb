
import React, { useRef, useState, useEffect } from 'react';
import { PressUpdate } from '../types';

interface PressUpdatesProps {
  pressUpdates: PressUpdate[];
}

const PressUpdates: React.FC<PressUpdatesProps> = ({ pressUpdates }) => {
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
  }, [pressUpdates]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  if (!pressUpdates.length) return null;

  return (
    <section className="py-24 bg-whiteboard texture-overlay texture-speckles relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-satoshi text-2xl text-primary transform -rotate-2 inline-block mb-2">
            Viral Hit Group
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tight leading-none">
            OMG Stop The Press!
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {pressUpdates.map((item) => (
              <div
                key={item.id}
                className="snap-start flex-shrink-0 w-[300px] sm:w-[340px]"
              >
                <div className="bg-white rounded-3xl p-8 h-full flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 group relative overflow-hidden">
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

                  {/* Media House Name */}
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                    {item.mediaHouse}
                  </span>

                  {/* Quote */}
                  <p className="text-slate-700 font-medium leading-relaxed text-[15px] flex-1 mb-6 relative z-10">
                    "{item.quote}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-slate-100 w-full">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      — {item.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${canScrollLeft
                  ? 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white active:scale-90'
                  : 'border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${canScrollRight
                  ? 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white active:scale-90'
                  : 'border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
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
