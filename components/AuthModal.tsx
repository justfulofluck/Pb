
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

type AuthView = 'login' | 'signup' | 'reset';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative doodle-border animate-in zoom-in duration-300 shadow-2xl p-8 md:p-10">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* View: LOGIN */}
        {view === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Welcome Back!</h2>
              <p className="font-handdrawn text-xl text-primary mt-1">Ready for your health fix? ✨</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-semibold"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                <input 
                  required
                  type="password" 
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-semibold"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => setView('reset')}
                  className="text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                >
                  FORGOT PASSWORD?
                </button>
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
                LET'S GO!
              </button>
            </form>

            <p className="text-center text-sm font-bold text-slate-500">
              NEW TO PINOBITE? {' '}
              <button 
                onClick={() => setView('signup')}
                className="text-primary hover:underline"
              >
                JOIN THE CLUB
              </button>
            </p>
          </div>
        )}

        {/* View: SIGNUP */}
        {view === 'signup' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Join The Club</h2>
              <p className="font-handdrawn text-xl text-primary mt-1">Get 10% off your first order! 🎁</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">First Name</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Last Name</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                <input required type="password" className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold" />
              </div>
              <button className="w-full bg-secondary text-slate-900 py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 mt-4">
                CREATE ACCOUNT
              </button>
            </form>

            <p className="text-center text-sm font-bold text-slate-500">
              ALREADY A MEMBER? {' '}
              <button onClick={() => setView('login')} className="text-primary hover:underline">
                LOG IN
              </button>
            </p>
          </div>
        )}

        {/* View: RESET PASSWORD */}
        {view === 'reset' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Forgot it?</h2>
              <p className="font-handdrawn text-xl text-primary mt-1">Don't worry, we got you! 🔑</p>
            </div>

            <p className="text-slate-500 text-sm text-center font-medium leading-relaxed">
              Enter your email and we'll send you a magic link to get back into your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-semibold text-center"
                  placeholder="name@example.com"
                />
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
                SEND RESET LINK
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setView('login')}
                className="text-xs font-black text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                BACK TO LOGIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
