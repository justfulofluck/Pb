import React from 'react';
import { CATEGORY_DISPLAY_DATA, Product } from '../types';
import { API_BASE_URL } from '../config';
import { getMediaUrl } from '../utils/mediaHelper';

interface CategoryListProps {
  onCategoryClick: (category: string) => void;
  products?: Product[];
}

const CategoryList: React.FC<CategoryListProps> = ({
  onCategoryClick,
  products = []
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [dragDistance, setDragDistance] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(x - startX));
  };

  const handleCategoryClick = (categoryId: string) => {
    // Increased threshold for better mobile/jittery mouse reliability
    if (dragDistance < 25) {
      onCategoryClick(categoryId);
    }
  };

  const categories = CATEGORY_DISPLAY_DATA.map(item => {
    const productCount = products.filter(p => p.category?.toLowerCase() === item.id.toLowerCase()).length;
    let suffix = 'Flavors';
    if (item.id === 'Muesli') suffix = 'Blends';
    if (item.id === 'Oats') suffix = 'Varieties';
    if (item.id === 'Peanut Butter') suffix = 'Flavors';

    if (productCount === 1) {
      if (suffix === 'Varieties') suffix = 'Variety';
      else suffix = suffix.substring(0, suffix.length - 1);
    }

    return {
      ...item,
      count: `${productCount} ${suffix}`
    };
  });

  return (
    <section className="pt-20 pb-4 md:pb-12 md:pt-24 bg-whiteboard texture-overlay texture-speckles relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-24 relative">
          <span className="font-handdrawn text-2xl md:text-3xl text-primary transform rotate-6 inline-block mb-2 absolute -top-10 left-1/2 translate-x-[20px] md:translate-x-[90px] lg:translate-x-[120px] drop-shadow-sm">Pick your fav!</span>
          <h2 className="font-normal uppercase !font-anton text-textured-green leading-tight tracking-normal [word-spacing:0.05em] text-center text-[40px] lg:text-[100px] lg:leading-[110px] lg:-mb-[12px] lg:pb-[12px] lg:font-bold">
            Explore What You <span className="font-bold">Love</span>
          </h2>
          <div className="w-16 md:w-24 h-1.5 md:h-2 bg-[#0b3d2e] mx-auto mt-4 md:mt-6 rounded-full"></div>
        </div>

        {/* Desktop View (Large Screens Only) */}
        <div className="hidden lg:grid grid-cols-3 gap-12">
          {categories.map((item, i) => (
            <div
              key={item.id}
              onClick={() => onCategoryClick(item.id)}
              className={`relative h-[550px] rounded-[48px] border-2 ${item.bgClass} ${item.borderClass} p-8 cursor-pointer group transition-[transform,shadow,border-color] duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden flex flex-col`}
              style={{ transform: 'translateZ(0)', isolation: 'isolate' }}
            >
              <div className="flex justify-between items-start z-20">
                <span className={`px-4 py-2 rounded-full bg-white/60 backdrop-blur-md text-xs font-bold uppercase tracking-widest ${item.textClass} shadow-sm font-anton`}>
                  {item.count}
                </span>
                <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${item.textClass}`}>
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </div>
              </div>

              <div className="relative z-20 mt-8">
                <h3 className={`text-6xl uppercase leading-[1.1] tracking-wider ${item.textClass} !font-anton drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]`}>
                  {item.display.split(' ').map((word, w) => <span key={w} className="block">{word}</span>)}
                </h3>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[75%] z-10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1 origin-bottom">
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[120%] bg-white rounded-t-full opacity-40 blur-xl`}></div>
                <img
                  src={getMediaUrl(item.image)}
                  alt={item.display}
                  className={`w-full h-full object-cover ${item.imagePosition || 'object-center'} drop-shadow-2xl`}
                  style={{ maskImage: 'linear-gradient(to top, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)' }}
                  draggable={false}
                />
              </div>

              <div className="absolute bottom-8 left-0 w-full flex justify-center z-30 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <button className={`px-10 py-4 rounded-full !text-white font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-transform ${item.accentClass}`}>
                  Shop Collection
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile & Tablet View (Image-only Banners) */}
        <div className="lg:hidden mt-4 mb-0 px-4 flex flex-col pb-8 ">
          {/* Oats */}
          {categories.filter(c => c.id === 'Oats').map((item) => (
            <div
              key={item.id}
              className="relative w-full pt-0 pb-2"
            >
              <img
                src={getMediaUrl(item.mobileImage || item.image)}
                alt={item.display}
                className="block h-auto w-full max-w-full"
              />
              {/* Text overlay - You can tweak pt/pb here for perfect vertical alignment */}
              <div className="absolute inset-0 flex flex-col justify-center pl-6 pr-4 pt-7 pb-0 pointer-events-none">
                <div
                  onClick={() => handleCategoryClick(item.id)}
                  className="pointer-events-auto cursor-pointer self-start active:scale-[0.95] transition-transform duration-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                >
                  <h3 className="text-white text-3xl sm:text-4xl font-normal uppercase tracking-widest font-anton mb-1 leading-none">
                    {item.display}
                  </h3>
                  <p className="text-white/90 text-[13px] sm:text-sm font-bold tracking-wider uppercase font-satoshi mt-1">
                    Explore {item.count}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Muesli */}
          {categories.filter(c => c.id === 'Muesli').map((item) => (
            <div
              key={item.id}
              className="relative w-full pt-0 pb-4 -mt-3"
            >
              <img
                src={getMediaUrl(item.mobileImage || item.image)}
                alt={item.display}
                className="block h-auto w-[104%] mx-auto max-w-none"
              />
              {/* Text overlay - You can tweak pt/pb here for perfect vertical alignment */}
              <div className="absolute inset-0 flex flex-col justify-center pl-5 pr-4 pt-2 pb-0 pointer-events-none">
                <div
                  onClick={() => handleCategoryClick(item.id)}
                  className="pointer-events-auto cursor-pointer self-start active:scale-[0.95] transition-transform duration-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                >
                  <h3 className="text-white text-3xl sm:text-4xl font-normal uppercase tracking-widest font-anton mb-1 leading-none">
                    {item.display}
                  </h3>
                  <p className="text-white/90 text-[13px] sm:text-sm font-bold tracking-wider uppercase font-satoshi mt-1">
                    Explore {item.count}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Peanut Butter */}
          {categories.filter(c => c.id === 'Peanut Butter').map((item) => (
            <div
              key={item.id}
              className="relative w-full pt-0 pb-0"
            >
              <img
                src={getMediaUrl(item.mobileImage || item.image)}
                alt={item.display}
                className="block h-auto w-[108%] mx-auto max-w-none"
              />
              {/* Text overlay - You can tweak pt/pb here for perfect vertical alignment */}
              <div className="absolute inset-0 flex flex-col justify-center pl-4 pr-4 pt-0 pb-11 pointer-events-none">
                <div
                  onClick={() => handleCategoryClick(item.id)}
                  className="pointer-events-auto cursor-pointer self-start active:scale-[0.95] transition-transform duration-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                >
                  <h3 className="text-white text-3xl sm:text-4xl font-normal uppercase tracking-widest font-anton mb-1 leading-none">
                    {item.display}
                  </h3>
                  <p className="text-white/90 text-[13px] sm:text-sm font-bold tracking-wider uppercase font-satoshi mt-1">
                    Explore {item.count}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
