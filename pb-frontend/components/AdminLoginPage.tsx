
import React, { useState } from 'react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

import { useAuth } from '../hooks/useAuth';

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [view, setView] = useState<'login' | 'reset'>('login');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    try {
      // 1. Get Token
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const tokens = await response.json();

      // 2. Verify Admin Status
      const userResponse = await fetch('http://localhost:8000/api/users/me/', {
        headers: { 'Authorization': `Bearer ${tokens.access}` }
      });

      if (!userResponse.ok) throw new Error('Failed to verify permissions');

      const userData = await userResponse.json();

      if (!userData.is_staff) {
        throw new Error('Access Denied: Administrative privileges required.');
      }

      // 3. Login
      login(tokens.access, tokens.refresh);
      onLoginSuccess();

    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoggingIn(false);
    }
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate reset request
    setTimeout(() => {
      setIsLoggingIn(false);
      setResetSent(true);
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
            <span className="text-3xl font-black tracking-tighter uppercase">PINOBITE <span className="text-slate-500">GLOBAL</span></span>
          </div>
          <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">
            {view === 'login' ? 'Internal Team Access Portal' : 'Security Recovery Protocol'}
          </p>
        </div>

        <div className="bg-[#1a2333]/60 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[32px] shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-xs font-bold text-center tracking-wide">
              {error}
            </div>
          )}
          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Corporate ID / Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <span className="material-symbols-outlined text-lg">badge</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pinobite.global"
                    className="w-full bg-[#0f172a]/80 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all font-medium placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Access Key</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <span className="material-symbols-outlined text-lg">vpn_key</span>
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0f172a]/80 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all font-medium placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-offset-slate-900" />
                  Remember Device
                </label>
                <button
                  type="button"
                  onClick={() => setView('reset')}
                  className="text-primary font-bold hover:text-primary/80 transition-colors"
                >
                  Lost Key?
                </button>
              </div>

              <button
                disabled={isLoggingIn}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,138,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    VERIFYING...
                  </>
                ) : (
                  <>
                    Access Panel
                    <span className="material-symbols-outlined text-lg">logout</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {resetSent ? (
                <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Instructions Sent</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Check your corporate inbox for recovery instructions. Secure link expires in 15 minutes.
                    </p>
                  </div>
                  <button
                    onClick={() => { setView('login'); setResetSent(false); }}
                    className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                  >
                    Back to Secure Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetRequest} className="space-y-6">
                  <div>
                    <p className="text-slate-400 text-xs text-center mb-8 leading-relaxed">
                      Enter your registered Corporate ID. A temporary access key or recovery link will be dispatched to your encrypted mail.
                    </p>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Corporate ID / Email</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        <span className="material-symbols-outlined text-lg">badge</span>
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@pinobite.global"
                        className="w-full bg-[#0f172a]/80 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all font-medium placeholder:text-slate-700"
                        required
                      />
                    </div>
                  </div>

                  <button
                    disabled={isLoggingIn}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,138,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isLoggingIn ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        Request Recovery
                        <span className="material-symbols-outlined text-lg">send</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                      Return to Access Panel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={onBackToSite}
            className="text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Public Site
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-slate-700 text-[9px] uppercase font-bold tracking-[0.3em]">
          Authorized Personnel Only • Secure 256-bit Encrypted Connection
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
