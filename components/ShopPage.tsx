import React, { useState, useEffect } from 'react';
import { Product } from '../types';

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

  // Sync internal filter when parent selectedCategory changes
  useEffect(() => {
    setFilter(selectedCategory);
  }, [selectedCategory]);

  // Reset category filter if a search query is present to ensure we search across all products
  useEffect(() => {
    if (searchQuery) {
      setFilter('All');
    }
  }, [searchQuery]);

  // Ensure "All" is always first, then the dynamic categories
  const displayCategories = ['All', ...categories.filter(c => c !== 'All')];

  const filteredProducts = products.filter(p => {
    // 1. Filter by Category
    const matchesCategory = filter === 'All' || p.category === filter;
    
    // 2. Filter by Search Query
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Area */}
      <div className="bg-primary text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : (filter === 'All' ? 'Our Whole Catalog' : filter)}
          </h1>
          <p className="text-xl font-medium opacity-90 max-w-2xl mx-auto">
            {searchQuery 
              ? 'Finding your favorite crunch...' 
              : 'Fuel your ambition with 100% natural, high-performance nutrition. No junk, just results.'}
          </p>
        </div>
        <span className="absolute -bottom-10 -left-10 font-handdrawn text-9xl opacity-10 rotate-12 select-none">YUM!</span>
        <span className="absolute top-0 right-0 font-handdrawn text-9xl opacity-10 -rotate-12 select-none">GO!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {displayCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full font-black text-sm tracking-widest transition-all ${
                filter === cat 
                  ? 'bg-primary text-white shadow-xl -translate-y-1' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {isLoading ? (
             // Skeletons
             [...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 h-[500px] animate-pulse">
                   <div className="bg-slate-200 rounded-2xl w-full aspect-square mb-6"></div>
                   <div className="bg-slate-200 h-6 w-3/4 mb-4 rounded"></div>
                   <div className="bg-slate-200 h-4 w-1/2 mb-8 rounded"></div>
                   <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="bg-slate-200 h-8 w-24 rounded"></div>
                      <div className="bg-slate-200 h-10 w-10 rounded-xl"></div>
                   </div>
                </div>
             ))
          ) : (
            filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white rounded-3xl p-6 border-2 border-slate-50 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
              >
                <div 
                  className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-6 cursor-pointer relative"
                  onClick={() => onProductClick(product)}
                >
                  {product.isTopRated && (
                    <span className="absolute top-4 left-4 z-10 font-handdrawn bg-secondary text-slate-900 px-3 py-1 rounded-full text-sm -rotate-6">Must Try!</span>
                  )}
                  {product.stock <= 0 && (
                     <span className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase z-20">Out of Stock</span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${product.stock <= 0 ? 'grayscale opacity-60' : ''}`}
                  />
                </div>
  
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className="font-black text-lg uppercase leading-tight hover:text-primary transition-colors cursor-pointer"
                        onClick={() => onProductClick(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex text-secondary text-xs mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`material-symbols-outlined text-sm ${i < Math.floor(product.rating) ? 'fill-1' : ''}`}>star</span>
                        ))}
                        <span className="text-slate-400 ml-1 font-bold">({product.reviewCount})</span>
                      </div>
                    </div>
                  </div>
  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-2xl font-black text-primary">Rs. {product.price}</span>
                    <button 
                      onClick={() => onAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="bg-primary text-white p-3 rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                      title={product.stock <= 0 ? "Out of Stock" : "Add to Basket"}
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
            <p className="text-2xl font-handdrawn text-slate-400">
              {searchQuery ? `No products found matching "${searchQuery}"` : 'Oops! No products found in this category.'}
            </p>
            <button onClick={() => setFilter('All')} className="text-primary font-bold hover:underline">See all products</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;