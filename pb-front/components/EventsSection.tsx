
import React from 'react';
import { EventBlog } from '../types';

interface EventsSectionProps {
  events: EventBlog[];
  onParticipateClick: () => void;
  onViewRecapsClick: () => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ events, onParticipateClick, onViewRecapsClick }) => {
  // Show up to 3 events
  const displayEvents = events.slice(0, 3);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-handdrawn text-2xl text-primary transform -rotate-2 inline-block mb-2">Community & Vibes</span>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">
              Events We've Organized
            </h2>
            <p className="text-lg text-slate-600 mt-4 font-medium">
              We don't just sell food; we build a community. Join us for workouts, workshops, and tasting sessions across the country.
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <button 
              onClick={onViewRecapsClick}
              className="text-slate-500 px-8 py-4 rounded-full font-black uppercase tracking-wider border-2 border-white bg-white hover:border-slate-900 hover:text-slate-900 transition-all flex-shrink-0 shadow-sm"
            >
              View Recaps
            </button>
            <button 
              onClick={onParticipateClick}
              className="bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-primary transition-colors hover:shadow-xl flex-shrink-0 flex items-center gap-2 group"
            >
              Participate Now
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayEvents.map((event) => (
            <div key={event.id} className="group rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-slate-900 transition-all hover:shadow-2xl bg-white relative cursor-pointer" onClick={onViewRecapsClick}>
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-3">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {event.date}
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-900 leading-tight mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
