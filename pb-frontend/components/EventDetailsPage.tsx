
import React from 'react';
import { EventBlog, Product } from '../types';
import { API_BASE_URL } from '../config';

interface EventDetailsPageProps {
  event: EventBlog;
  onBack: () => void;
  onHomeClick: () => void;
  products?: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onBack, onHomeClick, products = [], onProductClick, onAddToCart }) => {
  // Get featured products from event
  const featuredProducts = event.featuredProducts?.map(id => 
    products.find(p => String(p.id) === String(id))
  ).filter(Boolean) || [];

  return (
    <div className="bg-background-light min-h-screen pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">


      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative rounded-[48px] overflow-hidden h-[500px] shadow-2xl group">
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-slate-700 hover:bg-white transition-colors shadow-lg"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </button>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-secondary text-slate-900 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">Event Recap</span>
              <span className="font-satoshi text-2xl text-secondary">#PinobiteInAction</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-200">
              <div className="flex items-center gap-2 font-bold uppercase text-sm tracking-widest">
                <span className="material-symbols-outlined text-secondary">calendar_today</span>
                {event.date}
              </div>
              <div className="flex items-center gap-2 font-bold uppercase text-sm tracking-widest">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 -mt-24 relative z-10 mb-16">
        <div className="bg-white doodle-border shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
          <div className="text-center border-r border-slate-100 last:border-none">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Impact</p>
            <p className="text-2xl font-black text-primary">{event.impactParticipants || '500+'}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Participants</p>
          </div>
          <div className="text-center border-r border-slate-100 last:border-none">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Fuel</p>
            <p className="text-2xl font-black text-primary">{event.fuelBarsShared || '1.2k'}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Bars Shared</p>
          </div>
          <div className="text-center border-r border-slate-100 last:border-none">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Vibe</p>
            <p className="text-2xl font-black text-primary">{event.vibeEnergy || '100%'}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">High Energy</p>
          </div>
          <div className="text-center border-r border-slate-100 last:border-none">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Location</p>
            <p className="text-2xl font-black text-primary truncate px-2" title={event.location.split(',').pop()?.trim()}>
              {event.location.split(',').pop()?.trim() || 'Vadodara'}
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase">City</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-16 mb-24">
        <div className="md:col-span-2 space-y-12">
          {event.fullStory.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-3xl font-black uppercase text-slate-900">{section.heading}</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
          ))}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl">camera</span>
              </div>
              <div>
                <h4 className="font-black uppercase text-slate-900">Captured By</h4>
                <p className="text-slate-500 font-bold italic">Pinobite Community Media Team</p>
              </div>
            </div>
          </div>
        </div>
        <aside className="space-y-8">
          {/* Section removed as per user request (Word on Street) */}
        </aside>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <h3 className="text-2xl font-black uppercase text-slate-900 mb-6">Featured Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-black text-sm uppercase line-clamp-2">{product.name}</h4>
                  <p className="text-primary font-bold mt-2">₹{product.price}</p>
                  <div className="flex gap-2 mt-3">
                    {onProductClick && (
                      <button 
                        onClick={() => onProductClick(product)}
                        className="flex-1 bg-primary text-white py-2 rounded-full text-xs font-bold uppercase"
                      >
                        View
                      </button>
                    )}
                    {onAddToCart && (
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">shopping_cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EventDetailsPage;
