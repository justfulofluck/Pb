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
    <section className="pt-20 pb-12 md:py-24 bg-whiteboard texture-overlay texture-speckles relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-24 relative">
          <span className="font-handdrawn text-2xl md:text-3xl text-primary transform rotate-6 inline-block mb-2 absolute -top-10 left-1/2 translate-x-[20px] md:translate-x-[90px] lg:translate-x-[120px] drop-shadow-sm">Pick your fav!</span>
          <h2 className="font-normal uppercase !font-anton text-textured-green text-[clamp(2rem,7vw,72px)] leading-tight tracking-tight text-center">
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

        {/* Mobile & Tablet View (Premium Arched Layout) */}
        <div className="lg:hidden mt-0">
          <div className="relative pt-4 pb-4 md:pb-20 px-2 overflow-visible">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[300px] bg-gradient-radial from-primary/5 to-transparent rounded-[100%] blur-2xl opacity-60 z-0"></div>

            <div className="relative z-10 flex justify-center items-center gap-1 sm:gap-4 md:gap-8 px-1 py-4 md:py-10 w-full overflow-x-auto">
              {categories.map((item, i) => {
                const isCenter = i === Math.floor(categories.length / 2);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center group shrink w-1/3 min-w-[100px] xs:min-w-[120px]"
                    onClick={() => handleCategoryClick(item.id)}
                    style={{
                      transform: isCenter ? 'translateY(-20px)' : 'translateY(0)',
                      transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                  >
                    <div className={`relative w-24 h-24 md:w-36 md:h-36 rounded-full bg-white shadow-[0_20px_45px_rgba(0,0,0,0.12)] p-1 flex items-center justify-center border-4 border-white transition-all duration-500 group-active:scale-95`}>
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={getMediaUrl(item.image)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={item.display}
                          draggable={false}
                        />
                      </div>
                      <div className={`absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500`}></div>
                    </div>
                    <div className={`mt-4 text-center transition-all duration-300`}>
                      <span className="block text-[11px] md:text-base font-normal uppercase tracking-widest text-slate-800 leading-tight font-anton">
                        {item.display.replace('Super ', '')}
                      </span>
                      <div className={`w-6 h-1 bg-primary mx-auto mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
