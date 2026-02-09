
import React from 'react';
import { Review } from '../types';

interface TestimonialsProps {
  reviews: Review[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ reviews }) => {
  // Filter only 4 and 5 star reviews for the homepage
  const topReviews = reviews.filter(r => r.rating >= 4).slice(0, 6);

  return (
    <section className="py-24 bg-[#fff9c4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black text-slate-900 uppercase leading-none mb-4">
              FROM THOSE<br />WHO MADE THE SWITCH 
              <span className="font-handdrawn text-primary text-4xl align-middle inline-block transform -rotate-12 ml-4">:)</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        
        {topReviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {topReviews.map((t, i) => (
              <div className="bg-white p-8 rounded-3xl relative doodle-border flex flex-col h-full" key={i}>
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`material-symbols-outlined ${i < t.rating ? 'fill-1' : ''}`}>star</span>
                  ))}
                </div>
                <p className="text-lg font-medium italic mb-8 flex-1">"{t.comment}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img alt={t.userName} className="w-12 h-12 rounded-full object-cover border border-slate-100" src={t.avatar || `https://ui-avatars.com/api/?name=${t.userName}&background=random`} />
                  <div>
                    <h4 className="font-bold">{t.userName}</h4>
                    <p className="text-sm text-slate-500">{t.userRole || 'Verified Customer'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center py-12">
             <p className="font-handdrawn text-2xl text-slate-500">No reviews yet. Be the first!</p>
           </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
