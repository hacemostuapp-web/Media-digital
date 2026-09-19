import React, { useState } from 'react';
import { StudioPhoto } from '../types';

interface PresetsViewProps {
  onApplyPresetToPhoto: (presetName: string, contrast: number, sat: number) => void;
  photos: StudioPhoto[];
}

interface PresetCardData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  contrast: number;
  saturation: number;
  sampleImg: string;
  icon: string;
}

export const PresetsView: React.FC<PresetsViewProps> = ({
  onApplyPresetToPhoto,
  photos,
}) => {
  const [activePresetId, setActivePresetId] = useState('clean-white');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const presetList: PresetCardData[] = [
    {
      id: 'clean-white',
      name: 'Clean White',
      subtitle: 'Marketplace Compliance #1',
      description:
        'Pure pristine neutral studio lighting with shadow feathering. Recommended by eBay and Google Shopping algorithms.',
      badge: 'Best for Poshmark',
      contrast: 18,
      saturation: 10,
      sampleImg:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCewuifRjsn9ftiy8EHTp0b45yaEAsA_4lQWUOmuRX9cBnKs-mcoW_To5L6JGi9hDrkeeVVPXTUGjcXkYLJwIOk8AfCy6OojUU5QmlBraILUducFe2UsLsZp_fxHclydg15E1GXJ2_mbiCuLS61zFCCjVWT5PmJ60BfVLgZCH6vxj4CTLVDzTie-_2RvPNTDxDr2-fSK2o5Ymk2ZJ8m2yNTzExtTx0xGAoG5_9efSQa1zhzaRbvaSPo',
      icon: 'check_circle',
    },
    {
      id: 'warm-lifestyle',
      name: 'Warm Lifestyle',
      subtitle: 'Boutique Aesthetic Lookbook',
      description:
        'Gentle morning golden undertones and rich textile depth. Increases organic engagement on Depop and Instagram feeds.',
      badge: 'Boutique Favorite',
      contrast: 8,
      saturation: 22,
      sampleImg:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQBMJr25FLEfyIrm-Tm7AngBTssGog19ki0njBf_W7Phgf4QXxDklgr3U598FNN9eFAkvuf2LCb3g0kZron6QJ3j8Mzok4_7HhXmSeRwxZxKf8qEiOB_z2M5hSl7gQfqXHWGXCHxnVljWnk1ebzm_xUVleg-BJqYBj0dYlIAw5efGCCF_c9SedGqpfRJTejkOGqkASJ_rBNVfuNscCHZtJ-JvhicdWevIMpSR8zKdywC3FTbiB_7OG',
      icon: 'local_cafe',
    },
    {
      id: 'minimal-grey',
      name: 'Minimal Grey',
      subtitle: 'Travertine & Concrete Studio',
      description:
        'Subtle desaturation and balanced luminance that lets luxury leather and silk colors shine without color cast.',
      badge: 'Luxury Curators',
      contrast: 14,
      saturation: 0,
      sampleImg:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA79zvvAcTRSkqVDVwugT0zuVG6ROkk_f7_b1AJBmVzya325ocTY9eY1OmhEypYfHTVVueC1JiRKve9TT0AY5ga6eDIPRCR5N6sbRMp-Gg3v7DS7-aP-iAD4dpSEtfPEI6qiDgsKoStZxsQXbsjIQ08K0io-zA_iMoYJo-g3aQBrmp861EG62MbzT_tw_9H9vkeKN33rIWj9cXUGe7ljyAC9_EiE78-jpZ3UpSBdFJjrGe5RdV_2KXz',
      icon: 'gradient',
    },
    {
      id: 'depop-contrast',
      name: 'Depop Contrast',
      subtitle: 'High Dynamic Range & Pop',
      description:
        'Punchy midtones and deep shadows for streetwear, vintage tees, and statement footwear. Maximizes click-throughs.',
      badge: 'Streetwear & Vintage',
      contrast: 28,
      saturation: 18,
      sampleImg:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCFnk5s5ssTi1Gw9WNV1PeiLkF5gmH9oKwMFhwxBLT2X4rYxlyFEJ5PC4g4tRYNrbeIqCeH6ClXtitnwDTuttzObqMQZzpr4Bl7f63RJaqjerIziZa78aXXiRkOsvvWrhugMM2yAhzUCSk6Qw-LgkFinIEnIfbDiKEn5ylluakS-Wa9Lg-A-gaX2nJjlgGn7JbImNgeXmOG-p6dq4Mah6piSOtW-z7afgjOHSWmKblvwSDCPheFbvWs',
      icon: 'flare',
    },
  ];

  const handleApply = (preset: PresetCardData) => {
    setActivePresetId(preset.id);
    onApplyPresetToPhoto(preset.name, preset.contrast, preset.saturation);
    setAppliedNotice(`Applied "${preset.name}" preset settings!`);
    setTimeout(() => setAppliedNotice(null), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 sm:px-6 max-w-2xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#1c1b1c]">Curated Reseller Presets</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#ffd9e0] text-[#701738] text-[10px] font-bold">
              Pro Pack
            </span>
          </div>
          <p className="text-[12px] text-[#554246]">
            One-touch tone mapping engineered specifically for boutique resellers.
          </p>
        </div>

        {appliedNotice && (
          <div className="p-3 bg-[#ffd9e0] text-[#701738] rounded-2xl text-[12px] font-bold text-center animate-in fade-in shadow-xs">
            {appliedNotice}
          </div>
        )}

        {/* Preset Cards List */}
        <div className="space-y-3.5">
          {presetList.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-xs ${
                  isActive ? 'border-[#8e2f4f] ring-2 ring-[#8e2f4f]/15' : 'border-[#f1edee]'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#ebe7e8] flex-shrink-0 shadow-xs relative">
                    <img
                      alt={preset.name}
                      src={preset.sampleImg}
                      className="w-full h-full object-cover"
                      style={{
                        filter: `contrast(${1 + preset.contrast / 100}) saturate(${
                          1 + preset.saturation / 100
                        })`,
                      }}
                    />
                    <div className="absolute top-1 left-1 bg-black/60 rounded-full p-1 text-white">
                      <span className="material-symbols-outlined text-[12px]">{preset.icon}</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-[15px] font-bold text-[#1c1b1c] truncate">
                        {preset.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#f1edee] text-[#8e2f4f] text-[10px] font-bold">
                        {preset.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8e2f4f] font-semibold">
                      {preset.subtitle}
                    </span>
                    <p className="text-[12px] text-[#554246] mt-1 leading-snug">
                      {preset.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f1edee]">
                      <div className="flex items-center gap-2 text-[11px] text-[#877276]">
                        <span>Contrast: +{preset.contrast}%</span>
                        <span>•</span>
                        <span>Saturation: +{preset.saturation}%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApply(preset)}
                        className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#8e2f4f] text-white shadow-xs'
                            : 'bg-[#f6f3f4] text-[#1c1b1c] hover:bg-[#ebe7e8]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isActive ? 'check' : 'auto_fix_high'}
                        </span>
                        <span>{isActive ? 'Active' : 'Apply Preset'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
