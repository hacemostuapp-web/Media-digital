import React, { useState } from 'react';
import { StudioPhoto } from '../types';

interface EditorViewProps {
  photo: StudioPhoto;
  onUpdatePhoto: (updated: StudioPhoto) => void;
  onBack: () => void;
  onProceedToExport: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  photo,
  onUpdatePhoto,
  onBack,
  onProceedToExport,
}) => {
  const [isComparing, setIsComparing] = useState(false);
  const [showGridGuide, setShowGridGuide] = useState(false);
  const [zoomFit, setZoomFit] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Local adjustment state derived from active photo
  const [contrast, setContrast] = useState(photo.contrast ?? 18);
  const [saturation, setSaturation] = useState(photo.saturation ?? 10);
  const [isBgRemoved, setIsBgRemoved] = useState(photo.isBgRemoved ?? true);
  const [selectedBackdrop, setSelectedBackdrop] = useState<
    'white' | 'neutral' | 'beige' | 'grey' | 'transparent'
  >(photo.selectedBackdrop ?? 'white');
  const [isLightingImproved, setIsLightingImproved] = useState(
    photo.isLightingImproved ?? true
  );
  const [activePreset, setActivePreset] = useState<string>(photo.presetApplied ?? 'Clean White');

  // Compute CSS filter string
  const getFilterStyle = () => {
    if (isComparing) {
      return 'none';
    }
    const c = 1 + contrast / 100;
    const s = 1 + saturation / 100;
    const b = isLightingImproved ? 1.05 : 1.0;
    return `contrast(${c}) saturate(${s}) brightness(${b}) drop-shadow(0 18px 24px rgba(64,56,60,0.18))`;
  };

  // Preset pill click handler
  const handleApplyPreset = (name: string, cVal: number, sVal: number) => {
    setActivePreset(name);
    setContrast(cVal);
    setSaturation(sVal);
  };

  // Reset sliders
  const handleResetSliders = () => {
    setContrast(0);
    setSaturation(0);
  };

  // Backdrop styling
  const getBackdropClass = () => {
    if (!isBgRemoved || selectedBackdrop === 'transparent') {
      return 'opacity-0';
    }
    return 'opacity-95';
  };

  const getBackdropBackground = () => {
    switch (selectedBackdrop) {
      case 'white':
        return 'linear-gradient(to bottom, #ffffff, #fcf8f9, #f6f3f4)';
      case 'neutral':
        return '#ebe7e8';
      case 'beige':
        return '#f4ebd0';
      case 'grey':
        return '#e8ecf2';
      default:
        return 'transparent';
    }
  };

  // Save current adjustments to photo state and proceed
  const handleApplyAndNext = () => {
    onUpdatePhoto({
      ...photo,
      contrast,
      saturation,
      isBgRemoved,
      selectedBackdrop,
      isLightingImproved,
      presetApplied: activePreset,
      status: 'edited',
      badgeText: isBgRemoved ? 'Editada • Sin fondo' : 'Editada • Luz de estudio',
      badgeType: 'emerald',
    });
    onProceedToExport();
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 sm:px-6 max-w-2xl mx-auto w-full space-y-4">
        {/* Top Meta Info & Quick Nav */}
        <div className="pt-1 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              aria-label="Volver a la galería"
              onClick={onBack}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#ebe7e8] text-[#1c1b1c] hover:bg-[#f1edee] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#1c1b1c] truncate">
                {photo.filename}
              </span>
              <span className="text-[11px] text-[#877276] truncate">
                {photo.dimensions} • {photo.filesize}
              </span>
            </div>
          </div>

          {/* Live Status Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#e5e1e2] rounded-full shadow-xs flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#701738] animate-pulse"></span>
            <span className="text-[11px] text-[#8e2f4f] font-bold">Vista previa en vivo</span>
          </div>
        </div>

        {/* Stage / Photo Preview Area */}
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-[#f6f3f4] shadow-md flex items-center justify-center group select-none border border-[#f1edee]">
          {/* Isolated Checker Pattern Backing to show background isolation */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #ddd9da 25%, transparent 25%), linear-gradient(-45deg, #ddd9da 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd9da 75%), linear-gradient(-45deg, transparent 75%, #ddd9da 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            }}
          ></div>

          {/* Studio Lighting Backdrop Overlay */}
          <div
            className={`absolute inset-0 transition-all duration-300 pointer-events-none ${getBackdropClass()}`}
            style={{ background: getBackdropBackground() }}
          ></div>

          {/* Optional 3x3 Rule-of-Thirds Grid Overlay */}
          {showGridGuide && (
            <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-[#8e2f4f]/25"></div>
              <div className="border-r border-b border-[#8e2f4f]/25"></div>
              <div className="border-b border-[#8e2f4f]/25"></div>
              <div className="border-r border-b border-[#8e2f4f]/25"></div>
              <div className="border-r border-b border-[#8e2f4f]/25"></div>
              <div className="border-b border-[#8e2f4f]/25"></div>
              <div className="border-r border-b border-[#8e2f4f]/25"></div>
              <div className="border-r border-b border-[#8e2f4f]/25"></div>
              <div></div>
            </div>
          )}

          {/* Product Subject Image */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            <img
              id="product-photo"
              alt={photo.altText}
              className={`w-full h-full object-contain filter transition-all duration-200 ${
                zoomFit ? 'scale-115' : 'scale-100'
              }`}
              src={
                isComparing
                  ? photo.rawImageUrl || photo.thumbnailUrl
                  : isBgRemoved
                  ? photo.isolatedImageUrl || photo.thumbnailUrl
                  : photo.rawImageUrl || photo.thumbnailUrl
              }
              style={{ filter: getFilterStyle() }}
            />
          </div>

          {/* Interactive Before / After Comparison Pill */}
          <div className="absolute top-3 left-3 z-30">
            <button
              id="compare-btn"
              onMouseDown={() => setIsComparing(true)}
              onMouseUp={() => setIsComparing(false)}
              onMouseLeave={() => setIsComparing(false)}
              onTouchStart={(e) => {
                e.preventDefault();
                setIsComparing(true);
              }}
              onTouchEnd={() => setIsComparing(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm transition-all cursor-pointer select-none active:scale-95 ${
                isComparing
                  ? 'bg-[#8e2f4f] text-white'
                  : 'bg-white/90 text-[#1c1b1c] hover:bg-white'
              }`}
              title="Mantené presionado para comparar con la foto original"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isComparing ? 'visibility' : 'compare'}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-bold">
                {isComparing ? 'Foto original' : 'Mantené para ver antes'}
              </span>
            </button>
          </div>

          {/* Zoom & Fullstage Quick Action Buttons */}
          <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
            <button
              onClick={() => setZoomFit(!zoomFit)}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                zoomFit
                  ? 'bg-[#8e2f4f] text-white'
                  : 'bg-white/90 text-[#554246] hover:text-[#701738]'
              }`}
              title="Ajustar / Ampliar lienzo"
            >
              <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
            </button>
            <button
              onClick={() => setShowGridGuide(!showGridGuide)}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                showGridGuide
                  ? 'bg-[#8e2f4f] text-white'
                  : 'bg-white/90 text-[#554246] hover:text-[#701738]'
              }`}
              title="Mostrar / Ocultar regla de tercios"
            >
              <span className="material-symbols-outlined text-[18px]">grid_4x4</span>
            </button>
          </div>

          {/* Quick Aspect Ratio Badge */}
          <div className="absolute bottom-3 left-3 z-30 px-2.5 py-1 rounded-lg bg-[#e5e1e2]/90 backdrop-blur-sm shadow-xs">
            <span className="text-[11px] text-[#1c1b1c] font-medium">
              4:5 Formato optimizado para tiendas y redes
            </span>
          </div>

          {/* Interactive Cutout Feedback Chip */}
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8e2f4f] text-white shadow-xs">
            <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
            <span className="text-[11px] tracking-tight font-bold">Bordes refinados con IA</span>
          </div>
        </div>

        {/* Presets Scroll Strip */}
        <div className="pt-1 pb-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[#1c1b1c] font-bold uppercase tracking-wider">
              Ajustes preestablecidos para revendedores
            </span>
            <span className="text-[11px] text-[#8e2f4f] font-semibold">Pack boutique</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => handleApplyPreset('Blanco Puro', 18, 10)}
              className={`px-3.5 py-2 rounded-full text-[12px] font-semibold flex items-center gap-1.5 shadow-xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
                activePreset === 'Blanco Puro' || activePreset === 'Clean White'
                  ? 'bg-[#8e2f4f] text-white'
                  : 'bg-[#e5e1e2] text-[#1c1b1c] hover:bg-[#f1edee]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Blanco Puro</span>
            </button>
            <button
              onClick={() => handleApplyPreset('Cálido Lifestyle', 8, 22)}
              className={`px-3.5 py-2 rounded-full text-[12px] font-semibold flex items-center gap-1.5 shadow-xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
                activePreset === 'Cálido Lifestyle' || activePreset === 'Warm Lifestyle'
                  ? 'bg-[#8e2f4f] text-white'
                  : 'bg-[#e5e1e2] text-[#1c1b1c] hover:bg-[#f1edee]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#701738]">local_cafe</span>
              <span>Cálido Lifestyle</span>
            </button>
            <button
              onClick={() => handleApplyPreset('Gris Minimalista', 14, 0)}
              className={`px-3.5 py-2 rounded-full text-[12px] font-semibold flex items-center gap-1.5 shadow-xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
                activePreset === 'Gris Minimalista' || activePreset === 'Minimal Grey'
                  ? 'bg-[#8e2f4f] text-white'
                  : 'bg-[#e5e1e2] text-[#1c1b1c] hover:bg-[#f1edee]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#877276]">gradient</span>
              <span>Gris Minimalista</span>
            </button>
            <button
              onClick={() => handleApplyPreset('Contraste Urbano', 28, 18)}
              className={`px-3.5 py-2 rounded-full text-[12px] font-semibold flex items-center gap-1.5 shadow-xs whitespace-nowrap transition-transform active:scale-95 cursor-pointer ${
                activePreset === 'Contraste Urbano' || activePreset === 'Depop Contrast'
                  ? 'bg-[#8e2f4f] text-white'
                  : 'bg-[#e5e1e2] text-[#1c1b1c] hover:bg-[#f1edee]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#95435c]">flare</span>
              <span>Contraste Urbano</span>
            </button>
          </div>
        </div>

        {/* Adjustment Panel Container */}
        <div className="flex flex-col gap-3">
          {/* AI Background Cutout Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f1edee] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8e2f4f]/10 flex items-center justify-center text-[#8e2f4f]">
                  <span className="material-symbols-outlined text-[22px]">select_all</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#1c1b1c]">Quitar fondo</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffd9e0] text-[#3f0019] text-[10px] font-bold">
                      Recorte con IA
                    </span>
                  </div>
                  <span className="text-[12px] text-[#554246]">
                    Sombra suave sobre fondo impecable
                  </span>
                </div>
              </div>

              {/* Burgundy Toggle */}
              <button
                aria-checked={isBgRemoved}
                onClick={() => setIsBgRemoved(!isBgRemoved)}
                className={`w-12 h-7 rounded-full p-0.5 flex items-center transition-colors duration-200 cursor-pointer ${
                  isBgRemoved ? 'bg-[#8e2f4f] justify-end' : 'bg-[#e5e1e2] justify-start'
                }`}
                role="switch"
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-xs"></div>
              </button>
            </div>

            {/* Backdrop Swatches */}
            <div
              className={`flex items-center gap-2.5 pt-1 pl-12 transition-opacity ${
                isBgRemoved ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              {/* Pure White */}
              <button
                onClick={() => setSelectedBackdrop('white')}
                className={`w-7 h-7 rounded-full bg-white shadow-xs border flex items-center justify-center cursor-pointer ${
                  selectedBackdrop === 'white' ? 'border-[#8e2f4f] ring-2 ring-[#8e2f4f]/20' : 'border-[#e5e1e2]'
                }`}
                title="Fondo blanco puro"
              >
                {selectedBackdrop === 'white' && (
                  <span className="material-symbols-outlined text-[16px] text-[#8e2f4f]">check</span>
                )}
              </button>

              {/* Neutral Studio */}
              <button
                onClick={() => setSelectedBackdrop('neutral')}
                className={`w-7 h-7 rounded-full bg-[#ebe7e8] shadow-xs border flex items-center justify-center cursor-pointer ${
                  selectedBackdrop === 'neutral' ? 'border-[#8e2f4f] ring-2 ring-[#8e2f4f]/20' : 'border-transparent'
                }`}
                title="Estudio neutro suave"
              >
                {selectedBackdrop === 'neutral' && (
                  <span className="material-symbols-outlined text-[16px] text-[#8e2f4f]">check</span>
                )}
              </button>

              {/* Warm Boutique Beige */}
              <button
                onClick={() => setSelectedBackdrop('beige')}
                className={`w-7 h-7 rounded-full bg-[#f4ebd0] shadow-xs border flex items-center justify-center cursor-pointer ${
                  selectedBackdrop === 'beige' ? 'border-[#8e2f4f] ring-2 ring-[#8e2f4f]/20' : 'border-transparent'
                }`}
                title="Beige cálido de boutique"
              >
                {selectedBackdrop === 'beige' && (
                  <span className="material-symbols-outlined text-[16px] text-[#8e2f4f]">check</span>
                )}
              </button>

              {/* Cool Grey */}
              <button
                onClick={() => setSelectedBackdrop('grey')}
                className={`w-7 h-7 rounded-full bg-[#e8ecf2] shadow-xs border flex items-center justify-center cursor-pointer ${
                  selectedBackdrop === 'grey' ? 'border-[#8e2f4f] ring-2 ring-[#8e2f4f]/20' : 'border-transparent'
                }`}
                title="Piso gris frío"
              >
                {selectedBackdrop === 'grey' && (
                  <span className="material-symbols-outlined text-[16px] text-[#8e2f4f]">check</span>
                )}
              </button>

              {/* Transparent PNG */}
              <button
                onClick={() => setSelectedBackdrop('transparent')}
                className={`w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs border cursor-pointer ${
                  selectedBackdrop === 'transparent' ? 'border-[#8e2f4f] ring-2 ring-[#8e2f4f]/20' : 'border-[#e5e1e2]'
                }`}
                title="PNG transparente"
              >
                <span className="material-symbols-outlined text-[15px] text-[#554246]">grid_view</span>
              </button>
            </div>
          </div>

          {/* AI Softbox Lighting Balance Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f1edee] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8e2f4f]/10 flex items-center justify-center text-[#8e2f4f]">
                <span className="material-symbols-outlined text-[22px]">wb_incandescent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#1c1b1c]">Mejorar iluminación</span>
                <span className="text-[12px] text-[#554246]">
                  Balance softbox de estudio con IA y reducción de brillos
                </span>
              </div>
            </div>

            {/* Burgundy Toggle */}
            <button
              aria-checked={isLightingImproved}
              onClick={() => setIsLightingImproved(!isLightingImproved)}
              className={`w-12 h-7 rounded-full p-0.5 flex items-center transition-colors duration-200 cursor-pointer ${
                isLightingImproved ? 'bg-[#8e2f4f] justify-end' : 'bg-[#e5e1e2] justify-start'
              }`}
              role="switch"
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-xs"></div>
            </button>
          </div>

          {/* Fine Tuning Sliders Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f1edee] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-[#1c1b1c]">Ajustar tono del producto</span>
              <button
                onClick={handleResetSliders}
                className="text-[12px] font-semibold text-[#8e2f4f] hover:underline flex items-center gap-0.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                <span>Restablecer</span>
              </button>
            </div>

            {/* Contrast Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#877276]">tonality</span>
                  <label htmlFor="contrast-range" className="text-[13px] text-[#1c1b1c] font-semibold">
                    Ajustar contraste
                  </label>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-[#ebe7e8]">
                  <span className="text-[11px] text-[#8e2f4f] font-bold">
                    {contrast >= 0 ? `+${contrast}%` : `${contrast}%`}
                  </span>
                </div>
              </div>
              <div className="relative flex items-center">
                <input
                  id="contrast-range"
                  type="range"
                  min="-50"
                  max="50"
                  value={contrast}
                  onChange={(e) => {
                    setContrast(parseInt(e.target.value, 10));
                    setActivePreset('Personalizado');
                  }}
                  className="w-full h-2 bg-[#ebe7e8] rounded-full appearance-none cursor-pointer accent-[#8e2f4f]"
                />
              </div>
              <div className="flex justify-between px-1 text-[10px] text-[#877276]">
                <span>-50%</span>
                <span>0</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Saturation Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#877276]">palette</span>
                  <label htmlFor="sat-range" className="text-[13px] text-[#1c1b1c] font-semibold">
                    Ajustar saturación
                  </label>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-[#ebe7e8]">
                  <span className="text-[11px] text-[#8e2f4f] font-bold">
                    {saturation >= 0 ? `+${saturation}%` : `${saturation}%`}
                  </span>
                </div>
              </div>
              <div className="relative flex items-center">
                <input
                  id="sat-range"
                  type="range"
                  min="-50"
                  max="50"
                  value={saturation}
                  onChange={(e) => {
                    setSaturation(parseInt(e.target.value, 10));
                    setActivePreset('Personalizado');
                  }}
                  className="w-full h-2 bg-[#ebe7e8] rounded-full appearance-none cursor-pointer accent-[#8e2f4f]"
                />
              </div>
              <div className="flex justify-between px-1 text-[10px] text-[#877276]">
                <span>-50%</span>
                <span>0</span>
                <span>+50%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-lg border-t border-[#f1edee] pb-safe">
          <div className="h-20 px-4 sm:px-6 flex items-center justify-between gap-3 max-w-2xl mx-auto">
            {/* Ghost Cancel Button */}
            <button
              onClick={onBack}
              className="flex-1 h-12 rounded-full bg-[#ebe7e8] hover:bg-[#e5e1e2] text-[#1c1b1c] text-[14px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <span>Cancelar</span>
            </button>

            {/* Rich Burgundy Primary Solid Button */}
            <button
              onClick={handleApplyAndNext}
              className="flex-[1.6] h-12 rounded-full bg-[#8e2f4f] hover:bg-[#701738] text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>Aplicar y continuar</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Quick Merchandising Modal Drawer (if user opens drawer) */}
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center">
            <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl flex flex-col gap-4 pb-safe animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1.5 bg-[#e5e1e2] rounded-full mx-auto"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#ffd9e0] flex items-center justify-center text-[#701738]">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1c1b1c] leading-tight">¡Foto maestra lista!</h3>
                    <p className="text-[12px] text-[#554246]">
                      Mejorada y calibrada en color para máxima conversión
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#f1edee] flex items-center justify-center text-[#554246] hover:bg-[#ebe7e8] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="p-3 bg-[#f6f3f4] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#8e2f4f]">shopping_bag</span>
                    <div>
                      <span className="text-[13px] font-semibold text-[#1c1b1c] block">Pack para tiendas y marketplaces</span>
                      <span className="text-[11px] text-[#554246]">JPEG cuadrado 1:1 y vertical 4:5</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#8e2f4f]">check_circle</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="flex-1 h-12 rounded-full bg-[#ebe7e8] text-[#1c1b1c] text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Guardar en fotos</span>
                </button>
                <button
                  onClick={onProceedToExport}
                  className="flex-1 h-12 rounded-full bg-[#8e2f4f] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  <span>Continuar a exportar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
