
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
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-tight md:leading-none font-garet">
            Shop By Category
          </h2>
          <div className="w-16 md:w-24 h-1.5 md:h-2 bg-primary mx-auto mt-4 md:mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {categories.map((item, i) => (
            <div
              key={item.id}
              onClick={() => onCategoryClick(item.id)}
              className={`relative h-[450px] md:h-[550px] rounded-[32px] md:rounded-[48px] border-2 ${item.bgClass} ${item.borderClass} p-6 md:p-8 cursor-pointer group transition-[transform,shadow,border-color] duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden flex flex-col`}
              style={{ transform: 'translateZ(0)', isolation: 'isolate' }}
            >
              {/* Header */}
              <div className="flex justify-between items-start z-20">
                <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/60 backdrop-blur-md text-[10px] md:text-xs font-black uppercase tracking-widest ${item.textClass} shadow-sm font-garet`}>
                  {item.count}
                </span>
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${item.textClass}`}>
                  <span className="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
                </div>
              </div>

              {/* Title */}
              <div className="relative z-20 mt-6 md:mt-8">
                <h3 className={`text-3xl md:text-5xl font-black uppercase leading-[0.9] tracking-tight ${item.textClass} font-garet`}>
                  {item.display.split(' ').map((word, w) => <span key={w} className="block">{word}</span>)}
                </h3>
              </div>

              {/* Image Container */}
              <div className="absolute bottom-0 left-0 w-full h-[60%] md:h-[65%] z-10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1 origin-bottom">
                {/* Decorative Shape behind image */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[120%] bg-white rounded-t-full opacity-40 blur-xl`}></div>

                <img
                  src={item.image}
                  alt={item.display}
                  className={`w-full h-full object-cover object-center drop-shadow-2xl`}
                  style={{ maskImage: 'linear-gradient(to top, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 80%, transparent 100%)' }}
                />
              </div>

              {/* Hover Button */}
              <div className="absolute bottom-6 md:bottom-8 left-0 w-full flex justify-center z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500">
                <button className={`px-8 py-3 md:px-10 md:py-4 rounded-full text-white font-black uppercase text-[10px] md:text-sm tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-transform ${item.accentClass}`}>
                  Shop Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
