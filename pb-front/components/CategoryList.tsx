import React from 'react';
import { CATEGORY_DISPLAY_DATA, CategoryDisplay } from '../types';

interface CategoryListProps {
  onCategoryClick: (category: string) => void;
  categories?: CategoryDisplay[];
}

const CategoryList: React.FC<CategoryListProps> = ({
  onCategoryClick,
  categories = CATEGORY_DISPLAY_DATA
}) => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24 relative">
          <span className="font-handdrawn text-3xl text-slate-500 transform -rotate-3 inline-block mb-2 absolute -top-10 left-1/2 -translate-x-1/2 md:-translate-x-[200px]">Start here!</span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Shop By Category
          </h2>
          <div className="w-24 h-2 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {categories.map((item, i) => (
            <div
              key={item.id}
              onClick={() => onCategoryClick(item.id)}
              className={`relative h-[550px] rounded-[48px] border-2 ${item.bgClass} ${item.borderClass} p-8 cursor-pointer group transition-[transform,shadow,border-color] duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden flex flex-col`}
              style={{ transform: 'translateZ(0)', isolation: 'isolate' }}
            >
              {/* Header */}
              <div className="flex justify-between items-start z-20">
                <span className={`px-4 py-2 rounded-full bg-white/60 backdrop-blur-md text-xs font-black uppercase tracking-widest ${item.textClass} shadow-sm`}>
                  {item.count}
                </span>
                <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${item.textClass}`}>
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </div>
              </div>

              {/* Title */}
              <div className="relative z-20 mt-8">
                <h3 className={`text-5xl font-black uppercase leading-[0.9] tracking-tight ${item.textClass}`}>
                  {item.display.split(' ').map((word, w) => <span key={w} className="block">{word}</span>)}
                </h3>
              </div>

              {/* Image Container */}
              <div className="absolute bottom-0 left-0 w-full h-[65%] z-10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1 origin-bottom">
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
              <div className="absolute bottom-8 left-0 w-full flex justify-center z-30 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <button className={`px-10 py-4 rounded-full text-white font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-transform ${item.accentClass}`}>
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
