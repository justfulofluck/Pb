
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

type ViewState = 'login' | 'reset-email' | 'reset-otp' | 'reset-password';

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
  const { login } = useAuth();

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Reset Flow State
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ViewState>('login');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const tokens = await response.json();

      // Verify Admin Status
      const userResponse = await fetch('http://localhost:8000/api/users/me/', {
        headers: { 'Authorization': `Bearer ${tokens.access}` }
      });

      if (!userResponse.ok) throw new Error('Failed to verify permissions');
      const userData = await userResponse.json();

      if (!userData.is_staff) {
        throw new Error('Access Denied: Administrative privileges required.');
      }

      login(tokens.access, tokens.refresh);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/password-reset/request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      if (!res.ok) throw new Error('Failed to send OTP. Check email.');
      setSuccessMsg(`OTP sent to ${resetEmail}. Valid for 5 minutes.`);
      setView('reset-otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/password-reset/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      setSuccessMsg('OTP Verified. Please set a new password.');
      setView('reset-password');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/password-reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setSuccessMsg('Password reset successful. Please login.');
      setView('login');
      setEmail(resetEmail);
      setPassword('');
      // cleanup
      setResetEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResetEmail = () => (
    <form onSubmit={handleRequestOTP} className="space-y-6">
      <div>
        <p className="text-slate-400 text-xs text-center mb-8 leading-relaxed">
          Enter your registered Corporate ID. A temporary access key will be dispatched to your encrypted mail.
        </p>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Corporate ID / Email</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <span className="material-symbols-outlined text-lg">badge</span>
          </span>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="admin@pinobite.global"
            className="w-full bg-[#0f172a]/80 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all font-medium placeholder:text-slate-700"
            required
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,138,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
      >
        {isLoading ? 'SENDING...' : 'SEND OTP'}
        <span className="material-symbols-outlined text-lg">send</span>
      </button>
      <div className="text-center">
        <button type="button" onClick={() => setView('login')} className="text-slate-500 hover:text-white text-[10px] uppercase font-black tracking-widest">Cancel</button>
      </div>
    </form>
  );

  const renderResetOTP = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div>
        <p className="text-slate-400 text-xs text-center mb-8 leading-relaxed">
          Enter the 6-digit OTP sent to {resetEmail}
        </p>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">One-Time Password</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <span className="material-symbols-outlined text-lg">lock_clock</span>
          </span>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="w-full bg-[#0f172a]/80 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all font-medium placeholder:text-slate-700 tracking-[0.5em] text-center text-lg"
            required
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,138,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
      >
        {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
      </button>
      <div className="text-center">
        <button type="button" onClick={() => setView('reset-email')} className="text-slate-500 hover:text-white text-[10px] uppercase font-black tracking-widest">Back</button>
      </div>
    </form>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleSetNewPassword} className="space-y-6">
      <div>
        <p className="text-slate-400 text-xs text-center mb-8 leading-relaxed">Create a new secure password.</p>

        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">New Password</label>
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <span className="material-symbols-outlined text-lg">vpn_key</span>
          </span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#0f172a]/80 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all font-medium"
            required
            minLength={8}
          />
        </div>

        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Confirm Password</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <span className="material-symbols-outlined text-lg">check_circle</span>
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#0f172a]/80 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all font-medium"
            required
            minLength={8}
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,138,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
      >
        {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
          {successMsg && (
            <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-200 p-4 rounded-xl text-xs font-bold text-center tracking-wide">
              {successMsg}
            </div>
          )}

          {view === 'login' && (
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
                  onClick={() => { setView('reset-email'); setError(null); setSuccessMsg(null); }}
                  className="text-primary font-bold hover:text-primary/80 transition-colors"
                >
                  Lost Key?
                </button>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(0,138,69,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
              >
                {isLoading ? (
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
          )}

          {view === 'reset-email' && renderResetEmail()}
          {view === 'reset-otp' && renderResetOTP()}
          {view === 'reset-password' && renderResetPassword()}

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
