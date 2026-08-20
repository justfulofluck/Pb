import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Product } from '../types';
import { useToast } from './Toast';

interface SharedWishlistPageProps {
  token: string;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const SharedWishlistPage: React.FC<SharedWishlistPageProps> = ({ token, onBack, onAddToCart }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/wishlist/shared/?token=${token}`);
        const data = await res.json();
        
        if (res.ok) {
          setItems(data.items || []);
          setUserName(data.user || 'Someone');
        } else {
          setError(data.error || 'Failed to load wishlist');
        }
      } catch (err) {
        setError('Failed to load shared wishlist');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchSharedWishlist();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error</span>
        <h2 className="text-2xl font-black text-slate-400">{error}</h2>
        <button onClick={onBack} className="mt-6 btn-primary">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-bold"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Home
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">favorite</span>
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">
                {userName}'s Wishlist
              </h1>
              <p className="text-slate-500 font-bold">
                {items.length} {items.length === 1 ? 'item' : 'items'} shared with you
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <span className="material-symbols-outlined text-6xl text-slate-200">favorite_border</span>
            <h3 className="text-xl font-black text-slate-400 mt-4">This wishlist is empty</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item: any) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {item.product_details?.image ? (
                    <img 
                      src={item.product_details.image.startsWith('http') 
                        ? item.product_details.image 
                        : `${API_BASE_URL}${item.product_details.image}`}
                      alt={item.product_details?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-black text-lg uppercase line-clamp-2">
                    {item.product_details?.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                    {item.product_details?.category_name}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-black text-primary">
                      ₹{item.product_details?.price}
                    </span>
                    <button
                      onClick={() => {
                        const product: Product = {
                          id: String(item.product),
                          name: item.product_details?.name || '',
                          price: parseFloat(item.product_details?.price) || 0,
                          image: item.product_details?.image || '',
                          category: item.product_details?.category_name || '',
                        };
                        onAddToCart(product);
                        showToast('Added to cart!', 'success');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-green-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedWishlistPage;