
import React from 'react';
import { EventBlog } from '../types';
import { getMediaUrl } from '../utils/mediaHelper';

interface EventsSectionProps {
  events: EventBlog[];
  onParticipateClick: () => void;
  onViewRecapsClick: () => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ events, onParticipateClick, onViewRecapsClick }) => {
  // Show up to 3 events
  const displayEvents = events.slice(0, 3);

  return (
    <section className="py-[60px] bg-whiteboard texture-overlay texture-speckles overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-handdrawn text-2xl text-primary transform -rotate-2 inline-block mb-2">Community & Vibes</span>
            <h2 className="text-textured-green-big">
              Events we've organized
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 mt-6 font-medium max-w-xl">
              We don't just sell peanut butter; we build a community. Join us for workouts, workshops, and tasting sessions across the country.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={onViewRecapsClick}
              className="btn-greenboard flex items-center justify-center w-full px-2 py-4 md:px-10 md:py-5 rounded-full font-black uppercase tracking-widest text-[11px] sm:text-xs md:text-sm transition-all"
            >
              View Recaps
            </button>
            <button
              onClick={onParticipateClick}
              className="btn-greenboard flex items-center justify-center w-full px-2 py-4 md:px-10 md:py-5 rounded-full font-black uppercase tracking-widest text-[11px] sm:text-xs md:text-sm transition-all gap-1.5 md:gap-3 group"
            >
              <span className="truncate">Participate</span>
              <span className="material-symbols-outlined text-[16px] md:text-[24px] group-hover:translate-x-1 transition-transform flex-shrink-0">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 gap-5 md:gap-8 md:grid-cols-3 hide-scrollbar">
          {displayEvents.map((event) => (
            <div key={event.id} className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center group rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-slate-900 transition-all hover:shadow-2xl bg-white relative cursor-pointer" onClick={onViewRecapsClick}>
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={getMediaUrl(event.image)}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-3">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {event.date}
                </div>
                <h3 className="font-black uppercase text-slate-900 leading-tight mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
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
