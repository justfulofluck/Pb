
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
          triggerRewardNotification(50, 'Welcome Gift: Signup Bonus!');
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
              <p className="font-satoshi text-xl text-primary mt-1">Ready for your health fix? ✨</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-semibold placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-semibold placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="Enter your password"
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
              <button
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'LOGGING IN...' : "LET'S GO!"}
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
              <p className="font-satoshi text-xl text-primary mt-1">Get 10% off your first order! 🎁</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">First Name</label>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold placeholder:text-slate-300 placeholder:font-normal"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Last Name</label>
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold placeholder:text-slate-300 placeholder:font-normal"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="Enter your phone"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-semibold placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="Create a password"
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full bg-secondary text-slate-900 py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
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

        {/* View: RESET PASSWORD (REQUEST) */}
        {view === 'reset' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Forgot it?</h2>
              <p className="font-satoshi text-xl text-primary mt-1">Don't worry, we got you! 🔑</p>
            </div>

            <p className="text-slate-500 text-sm text-center font-medium leading-relaxed">
              Enter your email and we'll send you a magic code to reset your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-semibold text-center placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="Enter your email"
                />
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
                {isLoading ? 'SENDING CODE...' : 'SEND RESET CODE'}
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

        {/* View: OTP & NEW PASSWORD */}
        {view === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Verify Code</h2>
              <p className="font-satoshi text-xl text-primary mt-1">Check your inbox! 📧</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Enter 6-Digit Code</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-center text-2xl tracking-[10px] placeholder:tracking-normal placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="000000"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">New Password</label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-semibold placeholder:text-slate-300 placeholder:font-normal"
                  placeholder="Enter new password"
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setView('reset')}
                className="text-xs font-black text-slate-400 hover:text-primary transition-colors"
              >
                DIDN'T GET CODE? TRY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
