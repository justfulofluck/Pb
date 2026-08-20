
import React, { useState } from 'react';
import { API_BASE_URL } from '../config';


interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

type ViewState = 'login' | 'reset-email' | 'reset-otp' | 'reset-password';

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
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
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const tokens = await response.json();

      // Verify Admin Status
      const userResponse = await fetch(`${API_BASE_URL}/api/users/me/`, {
        headers: { 'Authorization': `Bearer ${tokens.access}` }
      });

      if (!userResponse.ok) throw new Error('Failed to verify permissions');
      const userData = await userResponse.json();

      if (!userData.is_staff) {
        throw new Error('Access Denied: Administrative privileges required.');
      }

      // Store Admin Tokens specifically
      localStorage.setItem('admin_access_token', tokens.access);
      localStorage.setItem('admin_refresh_token', tokens.refresh);
      localStorage.setItem('admin_email', email);

      // Explicitly clear customer session to prevent overlap
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Force a window event or state update if needed, but App.tsx handles the state mostly.
      // However, useAuth might still hold the 'user' state in memory until refresh.
      // Since we don't have access to logout() here, we rely on the user refreshing or
      // App.tsx logic. But standard useAuth checks localStorage on mount/checkAuth.

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
      const res = await fetch(`${API_BASE_URL}/api/password-reset/request/`, {
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
      const res = await fetch(`${API_BASE_URL}/api/password-reset/verify/`, {
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
      const res = await fetch(`${API_BASE_URL}/api/password-reset/confirm/`, {
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
        <p className="text-zenvira-secondary text-sm text-center mb-8 leading-relaxed">
          Enter your registered Corporate ID. A temporary access key will be dispatched to your encrypted mail.
        </p>
        <label className="block text-xs font-bold uppercase tracking-wider text-zenvira-secondary mb-2">Corporate ID / Email</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zenvira-secondary pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-lg leading-none">badge</span>
          </span>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="admin@pinobite.com"
            className="w-full bg-[#f7f4ec]/50 border border-zenvira-border/20 text-zenvira-text pl-12 pr-4 py-4 rounded-2xl focus:border-zenvira-accent focus:ring-1 focus:ring-zenvira-accent/30 outline-none transition-all font-medium placeholder:text-zenvira-secondary/40"
            required
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-zenvira-accent hover:bg-zenvira-accent/90 text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:shadow-[0_4px_12px_rgba(158,21,156,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
      >
        {isLoading ? 'SENDING...' : 'SEND OTP'}
        <span className="material-symbols-outlined text-lg">send</span>
      </button>
      <div className="text-center">
        <button type="button" onClick={() => setView('login')} className="text-zenvira-secondary hover:text-zenvira-accent text-xs uppercase font-bold tracking-wider">Cancel</button>
      </div>
    </form>
  );

  const renderResetOTP = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div>
        <p className="text-zenvira-secondary text-sm text-center mb-8 leading-relaxed">
          Enter the 6-digit OTP sent to {resetEmail}
        </p>
        <label className="block text-xs font-bold uppercase tracking-wider text-zenvira-secondary mb-2">One-Time Password</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zenvira-secondary pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-lg leading-none">lock_clock</span>
          </span>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="w-full bg-[#f7f4ec]/50 border border-zenvira-border/20 text-zenvira-text pl-12 pr-4 py-4 rounded-2xl focus:border-zenvira-accent focus:ring-1 focus:ring-zenvira-accent/30 outline-none transition-all font-medium placeholder:text-zenvira-secondary/40 tracking-[0.5em] text-center text-lg"
            required
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-zenvira-accent hover:bg-zenvira-accent/90 text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:shadow-[0_4px_12px_rgba(158,21,156,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
      >
        {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
      </button>
      <div className="text-center">
        <button type="button" onClick={() => setView('reset-email')} className="text-zenvira-secondary hover:text-zenvira-accent text-xs uppercase font-bold tracking-wider">Back</button>
      </div>
    </form>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleSetNewPassword} className="space-y-6">
      <div>
        <p className="text-zenvira-secondary text-sm text-center mb-8 leading-relaxed">Create a new secure password.</p>

        <label className="block text-xs font-bold uppercase tracking-wider text-zenvira-secondary mb-2">New Password</label>
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zenvira-secondary pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-lg leading-none">vpn_key</span>
          </span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#f7f4ec]/50 border border-zenvira-border/20 text-zenvira-text pl-12 pr-4 py-4 rounded-2xl focus:border-zenvira-accent focus:ring-1 focus:ring-zenvira-accent/30 outline-none transition-all font-medium"
            required
            minLength={8}
          />
        </div>

        <label className="block text-xs font-bold uppercase tracking-wider text-zenvira-secondary mb-2">Confirm Password</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zenvira-secondary pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-lg leading-none">check_circle</span>
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#f7f4ec]/50 border border-zenvira-border/20 text-zenvira-text pl-12 pr-4 py-4 rounded-2xl focus:border-zenvira-accent focus:ring-1 focus:ring-zenvira-accent/30 outline-none transition-all font-medium"
            required
            minLength={8}
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-zenvira-accent hover:bg-zenvira-accent/90 text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:shadow-[0_4px_12px_rgba(158,21,156,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
      >
        {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-zenvira-bg flex flex-col items-center justify-center p-4 relative overflow-hidden font-poppins text-zenvira-text">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zenvira-bg/50 to-zenvira-bg"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <img
              src="/logos/Pinobite-logo.png"
              alt="Pinobite Logo"
              className="h-12 w-auto object-contain"
            />
            <span className="text-3xl font-bayon tracking-wide uppercase text-zenvira-accent">GLOBAL</span>
          </div>
          <p className="text-zenvira-secondary font-bold uppercase tracking-widest text-xs">
            {view === 'login' ? 'Internal Team Access Portal' : 'Security Recovery Protocol'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-zenvira-border/10 p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(32,41,24,0.06)]">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold text-center tracking-wide">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-xs font-bold text-center tracking-wide">
              {successMsg}
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zenvira-secondary mb-2">Corporate ID / Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zenvira-secondary pointer-events-none flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg leading-none">badge</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pinobite.com"
                    className="w-full bg-[#f7f4ec]/50 border border-zenvira-border/20 text-zenvira-text pl-12 pr-4 py-4 rounded-2xl focus:border-zenvira-accent focus:ring-1 focus:ring-zenvira-accent/30 outline-none transition-all font-medium placeholder:text-zenvira-secondary/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zenvira-secondary mb-2">Access Key</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zenvira-secondary pointer-events-none flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg leading-none">vpn_key</span>
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#f7f4ec]/50 border border-zenvira-border/20 text-zenvira-text pl-12 pr-4 py-4 rounded-2xl focus:border-zenvira-accent focus:ring-1 focus:ring-zenvira-accent/30 outline-none transition-all font-medium placeholder:text-zenvira-secondary/40"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-zenvira-secondary cursor-pointer hover:text-zenvira-text transition-colors">
                  <input type="checkbox" className="rounded border-zenvira-border/20 bg-white text-zenvira-accent focus:ring-zenvira-accent/50" />
                  Remember Device
                </label>
                <button
                  type="button"
                  onClick={() => { setView('reset-email'); setError(null); setSuccessMsg(null); }}
                  className="text-zenvira-accent font-bold hover:text-zenvira-accent/80 transition-colors"
                >
                  Lost Key?
                </button>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-zenvira-accent hover:bg-zenvira-accent/90 text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:shadow-[0_4px_12px_rgba(158,21,156,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
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
            className="text-zenvira-secondary hover:text-zenvira-accent transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Public Site
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-zenvira-secondary/60 text-[10px] uppercase font-bold tracking-wider">
          Authorized Personnel Only • Secure 256-bit Encrypted Connection
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
