
import React, { useState } from 'react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate API verification
    setTimeout(() => {
      setIsLoggingIn(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 text-white mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">eco</span>
            <span className="text-3xl font-black tracking-tighter">PINOBITE <span className="text-slate-500">GLOBAL</span></span>
          </div>
          <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Internal Team Access Portal</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Corporate ID / Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <span className="material-symbols-outlined text-lg">badge</span>
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pinobite.global"
                  className="w-full bg-slate-950/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Access Key</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <span className="material-symbols-outlined text-lg">vpn_key</span>
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-offset-slate-900" />
                Remember Device
              </label>
              <a href="#" className="text-primary font-bold hover:underline">Lost Key?</a>
            </div>

            <button 
              disabled={isLoggingIn}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,138,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  Access Panel
                  <span className="material-symbols-outlined text-lg">login</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={onBackToSite}
            className="text-slate-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Public Site
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center">
        <p className="text-slate-700 text-[10px] uppercase font-bold tracking-widest">Authorized Personnel Only • Secure Connection v2.4</p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
