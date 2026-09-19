import React from 'react';
import { ActiveScreen } from '../types';

interface BottomNavProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: ActiveScreen; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'catalog', label: 'Catalog', icon: 'photo_library' },
    { id: 'presets', label: 'Presets', icon: 'style' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-30 pb-safe bg-[#fcf8f9]/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(74,64,69,0.06)] border-t border-[#f1edee]">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#8e2f4f] font-semibold scale-105'
                  : 'text-[#554246] hover:text-[#8e2f4f]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[11px] mt-1 font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
