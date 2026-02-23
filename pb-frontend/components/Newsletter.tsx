
import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || data.email?.[0] || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase">NUTS ABOUT HEALTH? JOIN OUR NEWSLETTER</h2>
        <p className="text-xl mb-12 opacity-90">Get exclusive recipes, health tips and 10% off your first order!</p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
          <input 
            className="flex-1 px-6 py-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-secondary/50 transition-all border-none" 
            placeholder="Enter your email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <button 
            className={`bg-secondary text-slate-900 px-8 py-4 rounded-full font-black hover:scale-105 transition-transform ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm font-medium ${status === 'success' ? 'text-green-200' : status === 'error' ? 'text-red-200' : ''}`}>
            {message}
          </p>
        )}

        <div className="flex justify-center gap-6 mt-12">
          <a className="hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined text-3xl">facebook</span></a>
          <a className="hover:scale-110 transition-transform font-bold text-3xl" href="#"></a>
          <a className="hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined text-3xl">photo_camera</span></a>
          <a className="hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined text-3xl">play_circle</span></a>
        </div>
      </div>
      <span className="absolute top-10 left-10 font-handdrawn text-9xl opacity-10 rotate-12 select-none">YUM!</span>
      <span className="absolute bottom-10 right-10 font-handdrawn text-9xl opacity-10 -rotate-12 select-none">FREE!</span>
    </section>
  );
};

export default Newsletter;
