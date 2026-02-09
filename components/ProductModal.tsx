
import React from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden relative doodle-border animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center p-8">
          <img src={product.image} alt={product.name} className="w-full h-auto object-contain max-h-[400px] drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 space-y-6 overflow-y-auto max-h-[80vh] custom-scroll">
          <div>
            <div className="flex items-center gap-2 text-secondary mb-2">
              <span className="material-symbols-outlined fill-1">star</span>
              <span className="font-bold text-slate-900">{product.rating}</span>
              <span className="text-slate-400 font-medium">({product.reviewCount} Reviews)</span>
            </div>
            <h2 className="text-4xl font-black uppercase text-slate-900 leading-tight mb-2">{product.name}</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-primary">Rs. {product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">Rs. {product.originalPrice}</span>
              )}
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">{product.description}</p>

          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-xs text-slate-400">The Goodness Inside</h3>
            <ul className="grid grid-cols-2 gap-3">
              {product.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-semibold">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
            <h3 className="font-bold text-sm mb-3 text-primary">Nutritional Powerhouse (per 100g)</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.nutrients.map((n, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{n.label}</span>
                  <span className="font-bold text-lg">{n.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
          >
            ADD TO BASKET
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
