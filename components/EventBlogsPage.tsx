
import React, { useState } from 'react';
import { EventBlog } from '../types';

interface EventBlogsPageProps {
  events: EventBlog[];
  onEventClick: (event: EventBlog) => void;
}

const EventBlogsPage: React.FC<EventBlogsPageProps> = ({ events, onEventClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background-light min-h-screen animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-secondary transform -rotate-2 inline-block mb-4">Reliving the Vibes</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            Event Stories
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Explore our community gatherings, workshops, and high-energy sessions across the globe.
          </p>
        </div>
        
        {/* Decorative elements */}
        <span className="absolute top-10 left-10 text-9xl opacity-10 font-black text-white select-none hidden md:block rotate-12">LIVE</span>
        <span className="absolute bottom-10 right-10 text-9xl opacity-10 font-black text-secondary select-none hidden md:block -rotate-12">PINO</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Find an event story..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none text-lg font-bold text-slate-700 transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              onClick={() => onEventClick(event)}
              className="group bg-white rounded-[40px] border-2 border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info Container */}
              <div className="p-8 space-y-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {event.date}
                </div>
                
                <h3 className="text-2xl font-black uppercase text-slate-900 leading-tight group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm tracking-tight mb-4">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {event.location}
                </div>

                <p className="text-slate-500 font-medium text-sm leading-relaxed flex-1">
                  {event.summary}
                </p>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Read Recap</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-32 space-y-4">
            <span className="material-symbols-outlined text-6xl text-slate-200">event_busy</span>
            <p className="text-2xl font-handdrawn text-slate-400">No events found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-primary font-bold hover:underline"
            >
              Show all stories
            </button>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-secondary/10 py-24 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black uppercase text-slate-900 mb-6">Want to Join the Next One?</h2>
          <p className="text-lg text-slate-600 mb-10 font-medium">Subscribe to our event alert list to get notified when we bring the crunch to your city.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-8 py-5 rounded-2xl border-none focus:ring-2 focus:ring-primary text-slate-900 font-bold shadow-sm"
            />
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase hover:shadow-xl transition-all active:scale-95">
              Notify Me
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventBlogsPage;
