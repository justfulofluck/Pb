
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
    <section className="py-24 bg-whiteboard texture-overlay texture-speckles px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-greenboard texture-overlay texture-speckles rounded-[40px] py-16 md:py-24 px-8 md:px-12 text-white overflow-hidden relative shadow-2xl">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-[2.2rem] sm:text-4xl md:text-7xl font-normal mb-6 uppercase tracking-wide [word-spacing:0.05em] !font-anton leading-[1] md:leading-[1]">
              Nuts about health?<br />Join our newsletter
            </h2>
            <p className="text-base md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-medium px-4 md:px-0">
              Get exclusive recipes, health tips and 10% off your first order!
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
              <input
                className="flex-1 px-8 py-5 rounded-3xl bg-[#082a20] text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-secondary/30 transition-all border border-white/20 font-bold font-satoshi"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              <button
                className={`px-10 py-5 rounded-3xl font-bold uppercase active:scale-95 font-satoshi relative overflow-hidden bg-[#0c4535] text-white border border-white/30 shadow-lg hover:border-white/60 transition-all ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={status === 'loading'}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }}></div>
                <span className="relative z-10">
                  {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </span>
              </button>
            </form>

            {message && (
              <p className={`mt-6 text-sm font-black uppercase tracking-wider ${status === 'success' ? 'text-green-200' : status === 'error' ? 'text-red-200' : ''}`}>
                {message}
              </p>
            )}
          </div>

          {/* Decorative Elements */}
          <span className="absolute top-[-20px] left-[-20px] font-anton text-9xl opacity-10 rotate-12 select-none pointer-events-none">YUM!</span>
          <span className="absolute bottom-[-20px] right-[-20px] font-anton text-9xl opacity-10 -rotate-12 select-none pointer-events-none">FREE!</span>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
