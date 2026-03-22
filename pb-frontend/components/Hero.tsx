import React from 'react';
import { Product, HeroSlide } from '../types';

interface HeroProps {
  onShopClick: () => void;
  products?: Product[];
  onProductClick?: (p: Product) => void;
  slides?: HeroSlide[];
}

const Hero: React.FC<HeroProps> = ({ onShopClick, products, onProductClick, slides }) => {
  // Find a product to feature or fallback to the first product
  const featuredProduct = products?.find(p => p.name.toLowerCase().includes('peanut butter')) || products?.[0];

  const handleShopClick = () => {
    if (featuredProduct && onProductClick) {
      onProductClick(featuredProduct);
    } else {
      onShopClick();
    }
  };

  // Determine background image logic: use the active slide's background image if available
  const activeSlide = slides?.find(s => s.isActive && s.backgroundImage);
  const bgImageUrl = activeSlide?.backgroundImage || "";

  return (
    <section className="relative w-full h-[100dvh] flex items-end md:items-center justify-center md:justify-end overflow-hidden bg-slate-100">
      {/* Background Full Cover Image */}
      {bgImageUrl && (
        <img 
          src={bgImageUrl}
          alt="Hero Cover"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Container for the Button */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-12 md:pb-0 md:pr-16 flex justify-center md:justify-end">
        <button
          onClick={handleShopClick}
          className="bg-[#FFEE00] text-gray-900 px-10 py-5 rounded-full font-black uppercase tracking-wider text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-2xl"
        >
          Shop Now <span className="material-symbols-outlined font-bold">arrow_forward_ios</span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
