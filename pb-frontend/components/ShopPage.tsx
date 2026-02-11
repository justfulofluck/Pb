
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Breadcrumbs from './Breadcrumbs';

interface ShopPageProps {
  products: Product[];
  categories: string[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  searchQuery?: string;
  selectedCategory?: string;
  isLoading?: boolean;
}

const ShopPage: React.FC<ShopPageProps> = ({ 
  products, 
  categories, 
  onProductClick, 
  onAddToCart, 
  searchQuery = '', 
  selectedCategory = 'All',
  isLoading
}) => {
  const [filter, setFilter] = useState(selectedCategory);

  useEffect(() => {
    setFilter(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery) {
      setFilter('All');
    }
  }, [searchQuery]);

  const displayCategories = ['All', ...categories.filter(c => c !== 'All')];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Area */}
      <div className="bg-slate-50 text-slate-900 pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6">
           <Breadcrumbs 
             onHomeClick={() => {}} 
             steps={[{ label: 'Shop' }, { label: filter }]} 
             className="text-slate-400 !py-0"
           />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3 text-slate-900">
            {searchQuery ? `Results for "${searchQuery}"` : (filter === 'All' ? 'Our Whole Catalog' : filter)}
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Fueling your body with minimalist perfection
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {displayCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest transition-all uppercase border ${
                filter === cat 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid - Screenshot Inspired Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {isLoading ? (
             [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                   <div className="bg-slate-100 rounded-lg aspect-square mb-4"></div>
                   <div className="bg-slate-100 h-4 w-3/4 mb-2 rounded"></div>
                   <div className="bg-slate-100 h-3 w-1/4 rounded"></div>
                </div>
             ))
          ) : (
            filteredProducts.map((product) => {
              const discount = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                : null;

              return (
                <div 
                  key={product.id}
                  className="group flex flex-col"
                >
                  {/* Image Container */}
                  <div 
                    className="aspect-square bg-[#F3F4F6] rounded-lg overflow-hidden mb-4 cursor-pointer relative p-10 flex items-center justify-center transition-transform duration-300"
                    onClick={() => onProductClick(product)}
                  >
                    {discount && (
                      <span className="absolute top-3 right-3 bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-black z-20">
                        {discount}%
                      </span>
                    )}
                    {product.stock <= 0 && (
                       <span className="absolute inset-0 bg-white/40 flex items-center justify-center z-20">
                         <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase">Sold Out</span>
                       </span>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${product.stock <= 0 ? 'grayscale opacity-60' : ''}`}
                    />
                  </div>
    
                  {/* Content Area */}
                  <div className="flex flex-col flex-1">
                    <h3 
                      className="font-bold text-sm text-slate-900 hover:text-primary transition-colors cursor-pointer mb-2"
                      onClick={() => onProductClick(product)}
                    >
                      {product.name}
                    </h3>
                    
                    {/* Price Row */}
                    <div className="flex items-center gap-2 mb-4">
                      {product.originalPrice && (
                         <span className="text-xs text-slate-400 line-through">Rs. {product.originalPrice}</span>
                      )}
                      <span className="text-sm font-bold text-slate-900">Rs. {product.price}</span>
                    </div>
    
                    {/* Add to Cart Button - Screenshot Style */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                      disabled={product.stock <= 0}
                      className="w-full bg-[#F3F4F6] text-slate-600 py-3 rounded-md font-bold text-[11px] uppercase tracking-wider hover:bg-slate-200 hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-32 space-y-4">
            <span className="material-symbols-outlined text-6xl text-slate-200">sentiment_dissatisfied</span>
            <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">
              {searchQuery ? `No items matching "${searchQuery}"` : 'Oops! Catalog is empty in this category.'}
            </p>
            <button onClick={() => setFilter('All')} className="text-primary font-bold hover:underline uppercase text-xs tracking-widest">See all products</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
