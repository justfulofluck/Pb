
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Breadcrumbs from './Breadcrumbs';
import { API_BASE_URL } from '../config';

interface ShopPageProps {
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

const ShopPage: React.FC<ShopPageProps> = ({
  onProductClick,
  onAddToCart,
  searchQuery = '',
  selectedCategory = 'All'
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState(selectedCategory);
  const [isLoading, setIsLoading] = useState(true);

  // Sync internal filter with selectedCategory prop
  useEffect(() => {
    if (selectedCategory) {
      setFilter(selectedCategory);
    }
  }, [selectedCategory]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories/`);
        if (response.ok) {
          const data = await response.json();
          // Assuming API returns objects {id, name, ...}, extract names
          // checking if data is array of objects or strings
          const categoryNames = data.map((c: any) => c.name || c);
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products with Filter & Search
  useEffect(() => {
    // If search is active, we should always search across All categories unless intentionally combined
    // (In this UI, it seems search and categories are meant to be separate or combined?
    // Let's assume they can be combined but resets filter to 'All' when search query enters search box)
    // Actually, let's keep it simple: just fetch with the current state.
    // The issue is calling setFilter triggers this effect again.

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = `${API_BASE_URL}/api/products/`;
        const params = new URLSearchParams();

        // If we have a search query, we usually want to search all categories
        // or just apply it to the selected category.
        // Let's implement what lines 104-108 were doing, but in a way that doesn't 
        // trigger a double fetch.

        let activeFilter = filter;
        if (searchQuery && filter !== 'All') {
          // Logic moved from line 104 here to prevent state-change-loop
          // If they just typed a search, we'll reset the filter state but fetch NOW.
          setFilter('All');
          activeFilter = 'All';
        }

        if (activeFilter !== 'All') {
          params.append('category', activeFilter);
        }

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const mappedProducts = data.map((p: any) => ({
            ...p,
            id: String(p.id),
            price: parseFloat(p.price),
            originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
            themeColor: p.theme_color,
            model3d: p.model_3d,
            orientation: p.orientation ? p.orientation.replace(/[Oo]/g, '0') : '0deg 0deg 0deg',
            benefits: p.benefits || [],
            nutrients: p.nutrients || [],
            gallery: p.gallery || []
          }));
          setProducts(mappedProducts);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filter, searchQuery]);

  const displayCategories = ['All', ...categories];

  return (
    <div className="bg-[#f2f2ec] min-h-screen font-display">
      {/* Banner Area */}
      <div className="pt-16 pb-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6 flex justify-center">
          <Breadcrumbs
            onHomeClick={() => { }}
            steps={[{ label: 'Shop' }, { label: filter }]}
            className="text-slate-400 !py-0"
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-[#008a45] font-garet">
            {searchQuery ? `Results for "${searchQuery}"` : (filter === 'All' ? 'All  Products' : filter)}
          </h1>
          <div className="w-32 h-1.5 bg-[#008a45] mx-auto mb-6"></div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-24">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {displayCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-10 py-3 rounded-full font-black text-xs tracking-widest transition-all uppercase shadow-md font-garet ${filter === cat
                ? 'bg-[#008a45] text-white'
                : 'bg-white text-slate-400 hover:text-[#008a45]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/50 rounded-2xl aspect-[4/5] mb-4"></div>
                <div className="bg-white/50 h-4 w-3/4 mx-auto mb-2 rounded"></div>
                <div className="bg-white/50 h-3 w-1/4 mx-auto rounded"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <div
                  key={product.id}
                  className="group cursor-pointer flex flex-col items-center text-center"
                  onClick={() => onProductClick(product)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full mb-6 transition-transform duration-500 group-hover:-translate-y-2">

                    {/* Discount Badge - Top Left Circle */}
                    {discount && (
                      <div className="absolute top-0 left-0 z-20 w-14 h-14 bg-[#d32f2f] rounded-full flex flex-col items-center justify-center text-white leading-none shadow-lg">
                        <span className="text-[14px] font-black">{discount}%</span>
                        <span className="text-[8px] font-black uppercase">OFF</span>
                      </div>
                    )}

                    {/* Wishlist Heart - Top Right */}
                    <button
                      className="absolute top-2 right-2 z-20 p-2 text-white/30 hover:text-red-500 transition-colors"
                      onClick={(e) => { e.stopPropagation(); /* Handle wishlist */ }}
                    >
                      <span className="material-symbols-outlined fill-1 text-2xl">favorite</span>
                    </button>

                    {/* Image */}
                    <div className="w-full h-full flex items-center justify-center relative">
                      <img
                        src={product.image}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ mixBlendMode: 'multiply' }}
                        alt={product.name}
                      />

                      {/* Sold Out Badge - Center Circle */}
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-100 shadow-xl">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800 text-center leading-tight">
                              SOLD<br />OUT
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`material-symbols-outlined text-lg ${star <= (product.rating || 5) ? 'fill-1' : ''}`}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800 ml-1">({product.reviewCount || 0} reviews)</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-3 px-2 leading-tight group-hover:text-[#008a45] transition-colors">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xl font-black text-slate-900">Rs. {product.price.toFixed(2)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm font-bold text-slate-400 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Bottom Action Button */}
                  <button
                    className="bg-[#1daa61] text-white px-12 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:bg-slate-900 transition-all active:scale-95 pointer-events-auto flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    disabled={product.stock <= 0}
                  >
                    {product.stock <= 0 ? 'Out of Stock' : (
                      <>
                        Add to cart
                        <span className="material-symbols-outlined text-sm">shopping_cart</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
              <p className="text-slate-500 font-bold">No products found matching your criteria.</p>
              <button
                onClick={() => { setFilter('All'); }}
                className="mt-4 text-[#008a45] font-bold text-sm hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default ShopPage;
