import React from 'react';
import { UserProfile } from '../types';

interface StoreSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStore: string;
  onSelectStore: (storeName: string) => void;
}

export const StoreSwitcherModal: React.FC<StoreSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentStore,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  const stores = [
    { name: 'Boutique Reseller Pro', handle: '@mayaboutique', count: 12 },
    { name: 'The Vintage Archive', handle: '@vintagearchive', count: 34 },
    { name: 'Luxury Vault Paris', handle: '@luxuryvault', count: 8 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#f1edee] space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8e2f4f]">storefront</span>
            <h3 className="text-[16px] font-bold text-[#1c1b1c]">Switch Boutique Shop</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1edee] flex items-center justify-center text-[#554246] hover:bg-[#ebe7e8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-2">
          {stores.map((s) => {
            const isCurrent = s.name === currentStore;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  onSelectStore(s.name);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#ffd9e0]/40 border-2 border-[#8e2f4f]'
                    : 'bg-[#f6f3f4] hover:bg-[#ebe7e8] border border-[#f1edee]'
                }`}
              >
                <div>
                  <p className="text-[13px] font-bold text-[#1c1b1c]">{s.name}</p>
                  <p className="text-[11px] text-[#554246]">{s.handle} • {s.count} items</p>
                </div>
                {isCurrent && (
                  <span className="material-symbols-outlined text-[#8e2f4f] text-[20px]">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpgradeSuccess: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradeSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#f1edee] space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-[#ffd9e0] text-[#701738] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1edee] flex items-center justify-center text-[#554246] hover:bg-[#ebe7e8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div>
          <h3 className="text-[18px] font-bold text-[#1c1b1c]">StudioDrop Unlimited</h3>
          <p className="text-[12px] text-[#554246] mt-0.5">
            Full-resolution background removal and lighting enhancements without monthly limits.
          </p>
        </div>

        <div className="space-y-2 text-[12px] text-[#1c1b1c]">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Unlimited high-res AI photo processing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Lossless 4K PNG alpha transparency cutout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Bulk batch exports for Poshmark &amp; Shopify</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>All curated reseller packs &amp; studio lighting presets</span>
          </div>
        </div>

        <div className="p-3 bg-[#f6f3f4] rounded-2xl flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#1c1b1c]">Monthly Plan</span>
          <div className="text-right">
            <span className="text-[16px] font-bold text-[#8e2f4f]">$19</span>
            <span className="text-[11px] text-[#554246]"> / month</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onUpgradeSuccess();
            onClose();
          }}
          className="w-full py-3 bg-[#8e2f4f] hover:bg-[#701738] text-white rounded-full font-bold text-[14px] shadow-md active:scale-98 transition-all cursor-pointer"
        >
          Activate Unlimited Access
        </button>
      </div>
    </div>
  );
};
