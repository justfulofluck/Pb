
import React from 'react';
import { EventBlog } from '../types';
import Breadcrumbs from './Breadcrumbs';

interface EventDetailsPageProps {
  event: EventBlog;
  onBack: () => void;
  onHomeClick: () => void;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onBack, onHomeClick }) => {
  return (
    <div className="bg-background-light min-h-screen pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <Breadcrumbs 
          onHomeClick={onHomeClick} 
          steps={[
            { label: 'Stories', onClick: onBack },
            { label: event.title }
          ]} 
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative rounded-[48px] overflow-hidden h-[500px] shadow-2xl group">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-secondary text-slate-900 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">Event Recap</span>
              <span className="font-handdrawn text-2xl text-secondary">#PinobiteInAction</span>
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
            <p className="text-2xl font-black text-primary">500+</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Participants</p>
          </div>
          <div className="text-center border-r border-slate-100 last:border-none">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Fuel</p>
            <p className="text-2xl font-black text-primary">1.2k</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Bars Shared</p>
          </div>
          <div className="text-center border-r border-slate-100 last:border-none">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Vibe</p>
            <p className="text-2xl font-black text-primary">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase">High Energy</p>
          </div>
          <div className="text-center border-r border-slate-100 last:border-none">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">City</p>
            <p className="text-2xl font-black text-primary">Live</p>
            <p className="text-xs font-bold text-slate-500 uppercase">{event.location.split(',').pop()}</p>
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
          <div className="bg-secondary/10 p-8 rounded-3xl doodle-border">
            <h4 className="font-handdrawn text-3xl text-primary mb-4 transform -rotate-1">Word on Street ✨</h4>
            <p className="font-bold text-slate-700 italic leading-relaxed text-lg">
              "The energy at the {event.title} was insane. Loved fueling up with the Muesli bars mid-session!"
            </p>
            <p className="mt-4 text-xs font-black uppercase text-primary">- Anjali, Participant</p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default EventDetailsPage;
