
import React, { useRef, useState, useEffect } from 'react';
import { PressUpdate } from '../types';

interface PressUpdatesProps {
  pressUpdates: PressUpdate[];
}

const STATIC_PRESS_UPDATES: PressUpdate[] = [
  { id: 1, mediaHouse: 'Business Standard', logo: '/logos/press/business-standard-logo.svg', quote: "Business Standard highlighted PinoBite's commitment to premium ingredients and its growing presence in India's healthy snacking market.", date: "2024" },
  { id: 2, mediaHouse: 'ANI (Asian News International)', logo: '/logos/press/ani-logo.svg', quote: "ANI covered PinoBite's expansion and its mission to provide healthier food choices to Indian consumers.", date: "2024" },
  { id: 3, mediaHouse: 'News18', logo: '/logos/press/news18-logo.svg', quote: "News18 recognized PinoBite as a rapidly growing premium food brand focused on nutrition and quality.", date: "2024" },
  { id: 4, mediaHouse: 'The Tribune', logo: '/logos/press/the-tribune-logo.svg', quote: "The Tribune featured PinoBite's premium peanut butter products and consumer-first approach.", date: "2024" },
  { id: 5, mediaHouse: 'Lokmat English', logo: '/logos/press/lokmat-english-logo.svg', quote: "Lokmat English highlighted PinoBite's growing popularity among health-conscious consumers.", date: "2024" },
  { id: 6, mediaHouse: 'Gujarat Samachar', logo: '/logos/press/gujarat-samachar-logo.png', quote: "Gujarat Samachar is one of Gujarat's most trusted newspapers, known for strong regional business and consumer coverage.", date: "2024" },
  { id: 7, mediaHouse: 'Divya Bhaskar', logo: '/logos/press/divya-bhaskar-logo.png', quote: "Divya Bhaskar reaches millions of readers across Gujarat and regularly features regional business success stories.", date: "2024" },
  { id: 8, mediaHouse: 'Sandesh', logo: '/logos/press/sandesh-logo.png', quote: "Sandesh is among Gujarat's leading newspapers with extensive coverage of business, lifestyle, and local brands.", date: "2024" },
  { id: 9, mediaHouse: 'TV9 Gujarati', logo: '/logos/press/tv9-gujarati-logo.svg', quote: "TV9 Gujarati covers regional business developments, startups, and consumer-focused stories across Gujarat.", date: "2024" },
  { id: 10, mediaHouse: 'ABP Asmita', logo: '/logos/press/abp-asmita-logo.png', quote: "ABP Asmita is one of Gujarat's leading television news channels, trusted for regional news and business coverage.", date: "2024" },
  { id: 11, mediaHouse: 'VTV Gujarati', logo: '/logos/press/vtv-gujarati-logo.png', quote: "VTV Gujarati is a prominent regional news platform covering business, innovation, and consumer trends.", date: "2024" },
  { id: 12, mediaHouse: 'India Global Live', logo: '/logos/press/india-global-live-logo.png', quote: "India Global Live featured PinoBite's vision of making premium nutrition accessible to Indian consumers.", date: "2024" },
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
          As Seen In
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
                    alt={`${item.mediaHouse} logo`}
                    className="w-16 h-16 object-contain"
                    loading="lazy"
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
