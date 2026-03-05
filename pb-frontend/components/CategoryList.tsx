
import React from 'react';
import { CATEGORY_DISPLAY_DATA, Product } from '../types';

interface CategoryListProps {
  onCategoryClick: (category: string) => void;
  products?: Product[];
}

const CategoryList: React.FC<CategoryListProps> = ({
  onCategoryClick,
  products = []
}) => {
  const categories = CATEGORY_DISPLAY_DATA.map(item => {
    const productCount = products.filter(p => p.category?.toLowerCase() === item.id.toLowerCase()).length;
    let suffix = 'Flavors';
    if (item.id === 'Muesli') suffix = 'Blends';
    if (item.id === 'Oats') suffix = 'Varieties';
    if (item.id === 'Peanut Butter') suffix = 'Flavors';

    // Handle pluralization
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
    <section className="py-16 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-24 relative">
          <span className="font-handdrawn text-2xl md:text-3xl text-slate-500 transform -rotate-3 inline-block mb-2 absolute -top-12 left-1/2 -translate-x-1/2 md:-translate-x-[200px]">Start here!</span>
          <h2 className="text-5xl md:text-8xl font-bold text-slate-900 uppercase tracking-normal leading-none font-bebas">
            Shop By Category
          </h2>
          <div className="w-16 md:w-24 h-1.5 md:h-2 bg-primary mx-auto mt-4 md:mt-6 rounded-full"></div>
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
                <span className={`px-4 py-2 rounded-full bg-white/60 backdrop-blur-md text-xs font-bold uppercase tracking-widest ${item.textClass} shadow-sm font-bebas`}>
                  {item.count}
                </span>
                <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${item.textClass}`}>
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </div>
              </div>

              <div className="relative z-20 mt-8">
                <h3 className={`text-6xl font-bold uppercase leading-[0.85] tracking-tight ${item.textClass} font-bebas`}>
                  {item.display.split(' ').map((word, w) => <span key={w} className="block">{word}</span>)}
                </h3>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[65%] z-10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1 origin-bottom">
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[120%] bg-white rounded-t-full opacity-40 blur-xl`}></div>
                <img
                  src={item.image}
                  alt={item.display}
                  className={`w-full h-full object-cover object-center drop-shadow-2xl`}
                  style={{ maskImage: 'linear-gradient(to top, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 80%, transparent 100%)' }}
                />
              </div>

              <div className="absolute bottom-8 left-0 w-full flex justify-center z-30 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <button className={`px-10 py-4 rounded-full text-white font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-transform ${item.accentClass}`}>
                  Shop Collection
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile & Tablet View (Premium Arched Layout) */}
        <div className="lg:hidden mt-0">
          <div className="relative pt-4 pb-20 px-2 overflow-visible">
            {/* Background Cohesive Arch Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[300px] bg-gradient-radial from-primary/5 to-transparent rounded-[100%] blur-2xl opacity-60 z-0"></div>

            <div className="relative z-10 flex justify-center items-end max-w-[450px] mx-auto gap-3 md:gap-8 px-4">
              {categories.map((item, i) => {
                const isCenter = i === 1;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center cursor-pointer group flex-1"
                    onClick={() => onCategoryClick(item.id)}
                    style={{
                      transform: isCenter ? 'translateY(-35px)' : 'translateY(5px)',
                      transitionDelay: `${i * 100}ms`
                    }}
                  >
                    {/* Circle Container */}
                    <div className={`relative w-24 h-24 md:w-36 md:h-36 rounded-full bg-white shadow-[0_20px_45px_rgba(0,0,0,0.12)] p-1 flex items-center justify-center border-4 border-white transition-all duration-500 group-active:scale-95`}>
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={item.display}
                        />
                      </div>

                      {/* Premium Accent Ring */}
                      <div className={`absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500`}></div>
                    </div>

                    {/* Label */}
                    <div className={`mt-4 text-center transition-all duration-300 ${isCenter ? 'mt-6' : 'mt-4'}`}>
                      <span className="block text-[11px] md:text-base font-black uppercase tracking-widest text-slate-800 leading-none font-sans">
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
