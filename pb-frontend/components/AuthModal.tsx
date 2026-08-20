
import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

type AuthView = 'login' | 'signup' | 'reset' | 'otp';

import { useAuth } from '../hooks/useAuth';
import { triggerRewardNotification } from './RewardNotification';
import { useToast } from './Toast';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [view, setView] = useState<AuthView>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend Validations
    if (view === 'signup') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (phone.length < 10) {
        setError('Please enter a valid phone number');
        return;
      }
    } else if (view === 'otp') {
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long');
        return;
      }
      if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (view === 'login') {
        const response = await fetch(`${API_BASE_URL}/api/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await response.json();
        login(data.access, data.refresh);
        onLogin(); // Close modal and redirect
        onClose();
      } else if (view === 'signup') {
        const success = await register({
          username: email,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          birth_date: birthDate || null
        });

        if (success) {
          onLogin();
          onClose();
        } else {
          throw new Error('Registration failed. Email might be taken.');
        }
      } else if (view === 'reset') {
        const response = await fetch(`${API_BASE_URL}/api/password-reset/request/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to send reset email');
        }

        showToast('Password reset OTP has been sent to your email!', 'success');
        setView('otp');
      } else if (view === 'otp') {
        const response = await fetch(`${API_BASE_URL}/api/password-reset/confirm/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, new_password: newPassword }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Invalid OTP or password requirement not met');
        }

        showToast('Password reset successfully! Please log in with your new password.', 'success');
        setView('login');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-[480px] rounded-[20px] overflow-hidden relative animate-in zoom-in-95 duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 md:p-12 border-4 border-[#0b3d2e]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-slate-50/50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors group"
        >
          <span className="material-symbols-outlined !text-slate-400 group-hover:!text-slate-800 transition-colors">close</span>
        </button>

        {/* View: LOGIN */}
        {view === 'login' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-[48px] md:text-[60px] force-anton text-[#0b3d2e] uppercase tracking-normal leading-none whitespace-nowrap">Welcome!</h2>
              <p className="font-handdrawn text-[20px] text-[#0b3d2e] leading-tight" style={{ fontFamily: '"Gochi Hand", cursive' }}>NEW Ready for your health fix?</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold text-center border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[12px] font-black uppercase tracking-[0.15em] text-[#94a3b8]">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none transition-all font-semibold text-[#0b3d2e] placeholder:text-slate-300 placeholder:force-anton"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-black uppercase tracking-[0.15em] text-[#94a3b8]">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none transition-all font-semibold text-[#0b3d2e] placeholder:text-slate-300 placeholder:force-anton"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setView('reset')}
                  className="text-sm font-medium text-[#94a3b8] hover:text-[#0b3d2e] transition-colors font-handdrawn"
                  style={{ fontFamily: '"Gochi Hand", cursive' }}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-[#0b3d2e] !text-white py-5 rounded-[20px] force-anton text-2xl tracking-wider active:scale-[0.98] transition-all shadow-lg shadow-[#0b3d2e]/20 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
              >
                {isLoading ? 'Wait a sec...' : "Let's Go!"}
              </button>
            </form>

            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-[20px] font-medium text-[#94a3b8] font-handdrawn" style={{ fontFamily: '"Gochi Hand", cursive' }}>
                <span>New to Pinobite?</span>
                <button
                  onClick={() => setView('signup')}
                  className="text-[#0b3d2e] hover:underline underline-offset-4 decoration-2"
                >
                  Join the club
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View: SIGNUP */}
        {view === 'signup' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-[48px] md:text-[60px] force-anton text-[#0b3d2e] uppercase tracking-normal leading-none">Join The Club</h2>
              <p className="font-handdrawn text-[20px] text-[#0b3d2e] leading-tight" style={{ fontFamily: '"Gochi Hand", cursive' }}>Your journey starts here ✨</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold text-center border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[12px] font-black uppercase tracking-widest text-[#94a3b8]">First Name</label>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none font-semibold text-[#0b3d2e]"
                    placeholder="First"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] font-black uppercase tracking-widest text-[#94a3b8]">Last Name</label>
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none font-semibold text-[#0b3d2e]"
                    placeholder="Last"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-black uppercase tracking-widest text-[#94a3b8]">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none font-semibold text-[#0b3d2e]"
                  placeholder="name@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-black uppercase tracking-widest text-[#94a3b8]">Phone</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none font-semibold text-[#0b3d2e]"
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-black uppercase tracking-widest text-[#94a3b8]">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none font-semibold text-[#0b3d2e]"
                  placeholder="Create password"
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full bg-[#0b3d2e] !text-white py-4 rounded-[18px] force-anton text-2xl tracking-wider active:scale-[0.98] transition-all mt-4 uppercase"
              >
                {isLoading ? 'Creating...' : 'Join Now'}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-[15px] font-black text-[#94a3b8] tracking-widest uppercase">
              <span>Already a member?</span>
              <button onClick={() => setView('login')} className="text-[#0b3d2e] hover:underline underline-offset-4 decoration-2">
                Log In
              </button>
            </div>
          </div>
        )}

        {/* View: RESET PASSWORD (REQUEST) */}
        {view === 'reset' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-[48px] md:text-[60px] force-anton text-[#0b3d2e] uppercase tracking-normal leading-none">Forgot it?</h2>
              <p className="font-handdrawn text-[20px] text-[#0b3d2e] leading-tight">Don't worry, we got you! 🔑</p>
            </div>

            <p className="text-slate-500 text-sm text-center font-medium leading-relaxed px-4">
              Enter your email and we'll send you a magic code to reset your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div className="space-y-2">
                <label className="block text-[12px] font-black uppercase tracking-widest text-[#94a3b8]">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none transition-all font-semibold text-[#0b3d2e] text-center placeholder:force-anton"
                  placeholder="Enter your email"
                />
              </div>
              <button className="w-full bg-[#0b3d2e] !text-white py-5 rounded-[20px] force-anton text-2xl tracking-wider active:scale-[0.98] transition-all uppercase">
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setView('login')}
                className="text-[11px] font-black text-[#94a3b8] hover:text-[#0b3d2e] transition-colors flex items-center justify-center gap-2 mx-auto tracking-widest uppercase"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Login
              </button>
            </div>
          </div>
        )}

        {/* View: OTP & NEW PASSWORD */}
        {view === 'otp' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-[48px] md:text-[60px] force-anton text-[#0b3d2e] uppercase tracking-normal leading-none">Verify Code</h2>
              <p className="font-handdrawn text-[20px] text-[#0b3d2e] leading-tight">Check your inbox! 📧</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold text-center border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#94a3b8]">Enter 6-Digit Code</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none transition-all font-black text-center text-xl md:text-3xl tracking-[0.2em] md:tracking-[0.4em] text-[#0b3d2e] placeholder:tracking-normal"
                  placeholder="000000"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#94a3b8]">New Password</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#0b3d2e] focus:ring-4 focus:ring-[#0b3d2e]/5 outline-none transition-all font-semibold text-[#0b3d2e]"
                  placeholder="Enter new password"
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full bg-[#0b3d2e] !text-white py-5 rounded-[20px] force-anton text-2xl tracking-wider active:scale-[0.98] transition-all uppercase"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setView('reset')}
                className="text-[11px] font-black text-[#94a3b8] hover:text-[#0b3d2e] transition-colors tracking-widest uppercase"
              >
                Didn't get code? Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
