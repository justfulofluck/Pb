
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
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = `${API_BASE_URL}/api/products/`;
        const params = new URLSearchParams();

        if (filter !== 'All') {
          params.append('category', filter);
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
          // Map API response to Product type if needed, similar to App.tsx
          const mappedProducts = data.map((p: any) => ({
            ...p,
            id: String(p.id),
            // Ensure other fields map correctly if backend differs from frontend type
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


  // Reset filter if searchQuery changes (optional, keeps consistency)
  useEffect(() => {
    if (searchQuery) {
      setFilter('All');
    }
  }, [searchQuery]);

  const displayCategories = ['All', ...categories];

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Area */}
      <div className="bg-slate-50 text-slate-900 pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6">
          <Breadcrumbs
            onHomeClick={() => { }}
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
              className={`px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest transition-all uppercase border ${filter === cat
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
          ) : products.length > 0 ? (
            products.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <div
                  key={product.id}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => onProductClick(product)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden mb-6">
                    {discount && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest z-10">
                        -{discount}%
                      </span>
                    )}
                    {product.isTopRated && (
                      <span className="absolute top-3 right-3 bg-yellow-400 text-slate-900 text-[10px] font-black uppercase px-2 py-1 tracking-widest z-10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">star</span> Top Rated
                      </span>
                    )}

                    <img
                      src={product.image}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      alt={product.name}
                    />

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="w-full bg-white text-slate-900 py-3 font-black uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-xl"
                      >
                        Add to Cart <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 group-hover:underline decoration-2 underline-offset-4">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                        <span className="text-xs font-bold text-slate-900">{product.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs font-medium text-slate-400 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                        View Item
                      </span>
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
                className="mt-4 text-primary font-bold text-sm hover:underline"
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
