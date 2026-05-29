import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { API_BASE_URL } from '../config';
import { getMediaUrl } from '../utils/mediaHelper';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './Toast';

interface ShopPageProps {
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  searchQuery?: string;
  selectedCategory?: string;
  onHomeClick: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({
  onProductClick,
  onAddToCart,
  searchQuery = '',
  selectedCategory = 'All',
  onHomeClick
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState(selectedCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const { showToast } = useToast();

  // Sync internal filter with selectedCategory prop
  useEffect(() => {
    if (selectedCategory) {
      setFilter(selectedCategory);
    }
  }, [selectedCategory]);

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistIds(new Set());
        return;
      }
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/api/wishlist/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const ids = new Set(data.map((item: any) => item.product));
          setWishlistIds(ids as Set<number>);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };
    fetchWishlist();
  }, [user]);

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
            themeColor: p.theme_color,
            model3d: p.model_3d,
            orientation: p.orientation ? p.orientation.replace(/[Oo]/g, '0') : '0deg 0deg 0deg',
            benefits: p.benefits || [],
            nutrients: p.nutrients || []
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
    <div className="bg-[#f2f2ec] min-h-screen font-satoshi">
      {/* Banner Area */}
      <div className="pt-6 md:pt-10 pb-6 px-4 relative overflow-hidden">

        <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
          <h1 className="font-normal uppercase tracking-wider [word-spacing:0.05em] mb-4 !font-anton text-textured-any bg-[#0b3d2e] inline-block pb-[0.1em] leading-[1.1]" style={{ fontSize: 'clamp(2.5rem, 8vw, 72px)' }}>
            {searchQuery ? `Results for "${searchQuery}"`.toUpperCase() : (filter === 'All' ? 'All products' : filter).toUpperCase()}
          </h1>
          <div className="w-32 h-1.5 bg-[#0b3d2e] mb-2 texture-chalkboard-strong"></div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-24">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {displayCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-10 py-3 rounded-full font-normal text-base tracking-wide [word-spacing:0.02em] uppercase transition-all shadow-md !font-anton ${filter === cat
                ? 'bg-[#0b3d2e] !text-white'
                : 'bg-white !text-[#0b3d2e] hover:opacity-80'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
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

              return (
                <div
                  key={product.id}
                  className="group cursor-pointer flex flex-col h-full text-center"
                  onClick={() => onProductClick(product)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full mb-6 transition-transform duration-500 group-hover:-translate-y-2">


                    {/* Wishlist Heart - Top Right */}
                    <button
                      className="absolute top-2 right-2 z-20 p-2 flex items-center justify-center transition-all duration-300 active:scale-90 group/heart"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!user) {
                          showToast('Please log in to save to your wishlist.', 'warning');
                          return;
                        }
                        try {
                          const token = localStorage.getItem('access_token');
                          const response = await fetch(`${API_BASE_URL}/api/wishlist/toggle/`, {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ product_id: product.id })
                          });
                          if (response.ok) {
                            const data = await response.json();
                            const newIds = new Set(wishlistIds);
                            if (data.status === 'added') {
                              newIds.add(product.id as any);
                            } else {
                              newIds.delete(product.id as any);
                            }
                            setWishlistIds(newIds);
                          }
                        } catch (error) {
                          console.error("Failed to toggle wishlist", error);
                        }
                      }}
                    >
                      <span className={`material-symbols-outlined text-[28px] drop-shadow-md transition-colors duration-300 ${wishlistIds.has(product.id as any) ? '!text-red-500 fill-1' : '!text-white/90 group-hover/heart:!text-red-400'}`} style={{ WebkitTextStroke: wishlistIds.has(product.id as any) ? '0px' : '1px rgba(0,0,0,0.2)' }}>favorite</span>
                    </button>

                    {/* Image */}
                    <div className="w-full h-full flex items-center justify-center relative">
                      <img
                        src={getMediaUrl(product.image)}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ mixBlendMode: 'multiply' }}
                        alt={product.name}
                      />

                      {/* Sold Out Badge - Center Circle */}
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-14 h-14 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-100 shadow-xl">
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-slate-800 text-center leading-tight">
                              SOLD<br />OUT
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Area flex wrapper */}
                  <div className="flex-1 flex flex-col items-center">
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="flex text-[#f9bc15] text-[10px] md:text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`fa-solid fa-star ${star <= (product.rating || 5) ? '' : 'text-slate-200'}`}></i>
                        ))}
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 ml-1">({product.reviewCount || 0} reviews)</span>
                    </div>

                    {/* Title - Fixed min height for alignment */}
                    <h3 className="!text-[16px] md:!text-2xl font-normal uppercase tracking-wide [word-spacing:0.02em] text-textured-any bg-[#0b3d2e] mb-1 !px-4 md:!px-8 !leading-[1.25] group-hover:opacity-80 transition-all text-center min-h-[3rem] md:!min-h-[4rem] flex items-center justify-center !font-anton w-fit mx-auto">
                      {product.name.toUpperCase()}
                    </h3>

                    {/* Bottom Section - Pushed to bottom for alignment */}
                    <div className="mt-auto w-full flex flex-col items-center">
                      {/* Price */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                        <span className="text-lg md:text-2xl font-bold text-[#228b44]">Rs. {product.price.toFixed(2)}</span>
                      </div>

                      <button
                        className="w-[95%] md:w-fit mx-auto btn-greenboard py-2 md:py-3 px-2 md:px-[50px] rounded-lg font-bold !text-[10px] md:!text-base uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center font-anton"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        disabled={product.stock <= 0}
                      >
                        {product.stock <= 0 ? 'Out of Stock' : 'ADD TO CART'}
                      </button>
                    </div>
                  </div>
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
