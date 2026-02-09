import React, { useState } from 'react';
import { EventBlog } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventBlog[];
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, events }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', eventId: '' });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative doodle-border animate-in zoom-in duration-300 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        {isSuccess ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-5xl">check</span>
            </div>
            <h3 className="text-2xl font-black uppercase text-slate-900">You're In!</h3>
            <p className="text-slate-500 font-medium">We've sent the event details to your email. Get ready to sweat (or eat)!</p>
          </div>
        ) : (
          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Join Event</h2>
              <p className="font-handdrawn text-primary text-lg">Let's make memories! 📸</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold"
                    placeholder="+91 98..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Select Event</label>
                <div className="relative">
                  <select 
                    required
                    value={formData.eventId}
                    onChange={e => setFormData({...formData, eventId: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold appearance-none bg-white"
                  >
                    <option value="">Choose an event...</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title} - {event.date}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-primary transition-colors hover:shadow-xl mt-4 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'REGISTERING...' : 'CONFIRM SPOT'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;