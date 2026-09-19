import React, { useState } from 'react';
import { LOGO_URL } from '../data';
import { UserProfile } from '../types';

interface AuthViewProps {
  user: UserProfile;
  onLoginSuccess: (updatedUser: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ user, onLoginSuccess, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState(user.email);
  const [storeName, setStoreName] = useState(user.storeName);
  const [password, setPassword] = useState('boutiquepro2026');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(mode === 'login' ? 'Signing in...' : 'Creating boutique account...');

    setTimeout(() => {
      onLoginSuccess({
        email,
        storeName: mode === 'signup' ? storeName : user.storeName,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8 relative">
      {/* Top Ambient Glow */}
      <div className="absolute top-10 w-48 h-48 bg-[#ffd9e0]/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Brand Emblem & Identity */}
      <div className="flex flex-col items-center text-center space-y-2 mb-6">
        <div className="relative p-1 rounded-2xl bg-[#f1edee] shadow-sm flex items-center justify-center">
          <img
            alt="StudioDrop Camera Spark Logo"
            className="w-14 h-14 object-contain rounded-xl"
            src={LOGO_URL}
          />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fd98b2] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#8e2f4f]"></span>
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-[28px] font-extrabold text-[#1c1b1c] tracking-tight">StudioDrop</h1>
            <span
              className="material-symbols-outlined text-[#8e2f4f] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </div>
          <p className="text-[13px] text-[#554246] max-w-[260px] mx-auto leading-relaxed">
            AI Product Photo Studio for Top Resellers
          </p>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="w-full max-w-sm bg-[#ebe7e8] p-1 rounded-full flex items-center mb-6 shadow-xs">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2 text-center rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
            mode === 'login'
              ? 'bg-white text-[#1c1b1c] shadow-xs'
              : 'text-[#554246] hover:text-[#1c1b1c]'
          }`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 text-center rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
            mode === 'signup'
              ? 'bg-white text-[#1c1b1c] shadow-xs'
              : 'text-[#554246] hover:text-[#1c1b1c]'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Auth Card Form Container */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-[#f1edee] p-6 flex flex-col space-y-4">
        {statusMessage && (
          <div className="p-2.5 rounded-xl bg-[#ffd9e0] text-[#701738] text-[12px] font-semibold text-center animate-pulse">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Work Email Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-[#554246] uppercase tracking-wider pl-1">
              Work Email
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#877276] text-[18px] pointer-events-none">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@boutique.com"
                className="w-full h-11 pl-10 pr-4 bg-[#f6f3f4] text-[#1c1b1c] placeholder:text-[#877276] text-[13px] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8e2f4f]/20 transition-all"
              />
            </div>
          </div>

          {/* Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="flex flex-col space-y-1.5">
              <label className="text-[11px] font-bold text-[#554246] uppercase tracking-wider pl-1">
                Store / Curator Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#877276] text-[18px] pointer-events-none">
                  storefront
                </span>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="The Vintage Archive"
                  className="w-full h-11 pl-10 pr-4 bg-[#f6f3f4] text-[#1c1b1c] placeholder:text-[#877276] text-[13px] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8e2f4f]/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[11px] font-bold text-[#554246] uppercase tracking-wider">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your work email!')}
                  className="text-[11px] font-semibold text-[#701738] hover:text-[#8e2f4f] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#877276] text-[18px] pointer-events-none">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-11 bg-[#f6f3f4] text-[#1c1b1c] placeholder:text-[#877276] text-[13px] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8e2f4f]/20 transition-all"
              />
              <button
                type="button"
                aria-label="Toggle password view"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 rounded-full text-[#877276] hover:text-[#1c1b1c] transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="w-full h-12 bg-[#8e2f4f] hover:bg-[#701738] text-white font-bold text-[14px] rounded-full shadow-md flex items-center justify-center gap-2 mt-2 active:scale-[0.98] transition-transform duration-100 cursor-pointer"
          >
            <span>{mode === 'login' ? 'Sign In to Studio' : 'Create Boutique Account'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow h-[1px] bg-[#e5e1e2]"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-[#877276] uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-grow h-[1px] bg-[#e5e1e2]"></div>
        </div>

        {/* Social Quick Logins */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Google */}
          <button
            type="button"
            onClick={() => {
              onLoginSuccess({ name: 'Maya', email: 'maya.reseller@gmail.com' });
              onClose();
            }}
            className="h-11 bg-[#f6f3f4] hover:bg-[#ebe7e8] rounded-full flex items-center justify-center gap-2 text-[#1c1b1c] text-[12px] font-semibold active:scale-[0.98] transition-all cursor-pointer border border-[#ebe7e8]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                fill="#34A853"
              ></path>
              <path
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                fill="#EA4335"
              ></path>
            </svg>
            <span>Google</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => {
              onLoginSuccess({ name: 'Maya', email: 'maya@icloud.com' });
              onClose();
            }}
            className="h-11 bg-[#f6f3f4] hover:bg-[#ebe7e8] rounded-full flex items-center justify-center gap-2 text-[#1c1b1c] text-[12px] font-semibold active:scale-[0.98] transition-all cursor-pointer border border-[#ebe7e8]"
          >
            <svg className="w-4 h-4 fill-current text-[#1c1b1c]" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.79-11.67-14.24-6.42-10.22-11.45-21.68-15.09-34.38-3.64-12.7-5.46-24.36-5.46-34.98 0-14.28 3.73-26.31 11.2-36.08 7.46-9.78 16.92-14.78 28.37-15 5.65 0 11.58 1.48 17.79 4.43 6.2 2.96 10.02 4.44 11.45 4.44 1.22 0 5.2-1.58 11.96-4.74 6.75-3.16 12.82-4.56 18.2-4.22 13.88.75 25.1 6.07 33.65 15.96-12.18 7.37-18.17 17.51-17.97 30.42.22 10.15 4.1 18.66 11.64 25.53 7.54 6.87 16.5 10.74 26.89 11.62-2.31 7.15-5.32 14.48-9.03 22zM119.22 33.48c0-7.39 2.65-14.27 7.95-20.65 5.3-6.38 11.83-10.42 19.59-12.13.22 1.48.33 2.76.33 3.86 0 7.39-2.73 14.41-8.19 21.05-5.46 6.64-11.94 10.47-19.45 11.49-.07-1.12-.23-2.33-.23-3.62z"></path>
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </div>

      {/* Security & Platform Trust Badge */}
      <div className="mt-4 max-w-sm w-full bg-[#ffd9e0]/40 rounded-xl p-3 flex items-center justify-center gap-2 text-[#3f0019] text-center border border-[#ffd9e0]">
        <span className="text-[#701738] font-bold">⚡</span>
        <span className="text-[11px] font-semibold">
          Optimized for Poshmark, eBay, Depop, &amp; Shopify
        </span>
      </div>

      {/* Switch Mode Footer Prompt */}
      <div className="mt-5 text-center flex flex-col items-center gap-2">
        <p className="text-[13px] text-[#554246]">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-[13px] font-bold text-[#701738] hover:text-[#8e2f4f] ml-1.5 underline cursor-pointer"
          >
            {mode === 'login' ? 'Sign up free' : 'Log in'}
          </button>
        </p>

        <button
          type="button"
          onClick={onClose}
          className="text-[12px] text-[#877276] hover:text-[#1c1b1c] mt-2 cursor-pointer"
        >
          ← Return to Studio
        </button>
      </div>
    </div>
  );
};
