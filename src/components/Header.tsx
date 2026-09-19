import React from 'react';
import { LOGO_URL } from '../data';
import { ActiveScreen, UserProfile } from '../types';

interface HeaderProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, user }) => {
  const getSubtitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'Dashboard';
      case 'editor':
        return 'Photo Editor';
      case 'export':
        return 'Download And Export';
      case 'catalog':
        return 'Catalog & Batch';
      case 'presets':
        return 'Reseller Presets';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const showBackButton = currentScreen === 'editor' || currentScreen === 'export';

  return (
    <header className="fixed top-0 w-full z-40 bg-[#fcf8f9]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(74,64,69,0.04)] pt-safe">
      <div className="h-16 px-4 sm:px-6 max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Left branding / navigation */}
        <div className="flex items-center gap-2 min-w-0">
          {showBackButton && (
            <button
              aria-label="Go Back"
              onClick={() => onNavigate(currentScreen === 'export' ? 'editor' : 'dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#1c1b1c] hover:bg-[#ebe7e8] active:scale-95 transition-all -ml-1 flex-shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => onNavigate('dashboard')}
          >
            <img
              alt="StudioDrop Camera Spark Logo"
              className="h-8 w-8 object-contain flex-shrink-0 rounded-lg"
              src={LOGO_URL}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[15px] text-[#8e2f4f] leading-none tracking-tight">
                StudioDrop
              </span>
              <span className="text-[11px] text-[#554246] font-medium truncate mt-0.5">
                {getSubtitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Profile Options"
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#ebe7e8] transition-colors cursor-pointer"
            title="Account Profile"
          >
            <img
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8e2f4f]/20 shadow-xs"
              src={user.avatarUrl}
            />
          </button>

          <button
            aria-label="Authentication"
            onClick={() => onNavigate('auth')}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#554246] hover:text-[#8e2f4f] hover:bg-[#ebe7e8] transition-colors cursor-pointer"
            title="Switch Account / Sign In"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
