import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onSignOut: () => void;
  onUpgradeClick: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onSignOut,
  onUpgradeClick,
}) => {
  const [storeName, setStoreName] = useState(user.storeName);
  const [userName, setUserName] = useState(user.name);
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [defaultFormat, setDefaultFormat] = useState<'jpg' | 'png'>('jpg');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ storeName, name: userName });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 sm:px-6 max-w-2xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#1c1b1c]">Studio Settings</h2>
            <p className="text-[12px] text-[#554246]">
              Manage boutique branding, export presets, and account plan.
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="text-[12px] text-[#8e2f4f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Switch Account</span>
          </button>
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl text-[12px] font-bold text-center animate-in fade-in">
            ✓ Settings updated successfully!
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#f1edee] shadow-xs flex items-center gap-3.5">
          <div className="relative">
            <img
              alt={user.name}
              src={user.avatarUrl}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#8e2f4f]/20 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[16px] font-bold text-[#1c1b1c] truncate">{user.name}</span>
            <span className="text-[12px] text-[#8e2f4f] font-semibold truncate">{user.storeName}</span>
            <span className="text-[11px] text-[#877276] truncate">{user.email}</span>
          </div>
          <span className="px-2.5 py-1 bg-[#ffd9e0] text-[#701738] rounded-full text-[11px] font-bold">
            Pro Reseller
          </span>
        </div>

        {/* Plan Quota Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#f1edee] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#1c1b1c]">{user.tier}</span>
            <span className="text-[12px] font-bold text-[#8e2f4f]">
              {user.usedCredits} / {user.totalCredits} photos used
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#f1edee] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#8e2f4f] rounded-full"
              style={{ width: `${(user.usedCredits / user.totalCredits) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-[#554246]">
            <span>Resets monthly • High-res neural processing</span>
            <span>Renews in {user.renewsInDays} days</span>
          </div>

          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full py-2.5 bg-[#701738] hover:bg-[#8e2f4f] text-white rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ffd9e0]">auto_awesome</span>
            <span>Upgrade to Unlimited ($19/mo)</span>
          </button>
        </div>

        {/* Store & Export Preferences Form */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-4 border border-[#f1edee] shadow-xs space-y-3.5">
          <h3 className="text-[14px] font-bold text-[#1c1b1c]">Boutique Branding &amp; Defaults</h3>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#554246] uppercase">Curator Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full h-10 px-3 bg-[#f6f3f4] text-[#1c1b1c] text-[13px] rounded-xl border border-[#ebe7e8] focus:outline-none focus:ring-2 focus:ring-[#8e2f4f]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#554246] uppercase">Store / Shopfront Handle</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-10 px-3 bg-[#f6f3f4] text-[#1c1b1c] text-[13px] rounded-xl border border-[#ebe7e8] focus:outline-none focus:ring-2 focus:ring-[#8e2f4f]/20"
            />
          </div>

          <div className="pt-2 border-t border-[#f1edee] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#1c1b1c]">Auto-Enhancement on Upload</p>
                <p className="text-[11px] text-[#554246]">Automatically isolate edges and softbox lighting</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoEnhance(!autoEnhance)}
                className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                  autoEnhance ? 'bg-[#8e2f4f] justify-end' : 'bg-[#e5e1e2] justify-start'
                }`}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow-xs"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#1c1b1c]">Default Export Format</p>
                <p className="text-[11px] text-[#554246]">Smallest web size or lossless transparency</p>
              </div>
              <div className="flex items-center gap-1 bg-[#f1edee] p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDefaultFormat('jpg')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                    defaultFormat === 'jpg' ? 'bg-white text-[#8e2f4f] shadow-xs' : 'text-[#554246]'
                  }`}
                >
                  JPG
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultFormat('png')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                    defaultFormat === 'png' ? 'bg-white text-[#8e2f4f] shadow-xs' : 'text-[#554246]'
                  }`}
                >
                  PNG
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#8e2f4f] hover:bg-[#701738] text-white rounded-full text-[13px] font-bold shadow-xs cursor-pointer"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};
