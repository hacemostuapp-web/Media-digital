import React, { useState } from 'react';
import { StudioPhoto } from '../types';

interface ExportViewProps {
  photo: StudioPhoto;
  onBackToEditor: () => void;
  onDoneToDashboard: () => void;
}

interface PresetOption {
  title: string;
  desc: string;
  size: string;
  aspect: string;
}

export const ExportView: React.FC<ExportViewProps> = ({
  photo,
  onBackToEditor,
  onDoneToDashboard,
}) => {
  const presets: PresetOption[] = [
    {
      title: '1200 × 1600 px',
      desc: 'Tiendas online y Mercado Libre (Recomendado)',
      size: '1.4 MB',
      aspect: 'Optimizado (3:4)',
    },
    {
      title: '1080 × 1440 px',
      desc: 'Historias de Instagram y redes (3:4)',
      size: '1.1 MB',
      aspect: 'Historias (3:4)',
    },
    {
      title: '1000 × 1333 px',
      desc: 'Feed de publicaciones y catálogos',
      size: '890 KB',
      aspect: 'Feed (3:4)',
    },
    {
      title: 'Original 3024 × 4032 px',
      desc: 'Resolución máxima del sensor',
      size: '4.6 MB',
      aspect: 'Original máster (3:4)',
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(presets[0]);
  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const [fileFormat, setFileFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');
  const [quality, setQuality] = useState<number>(100);
  const [downloadState, setDownloadState] = useState<'idle' | 'packaging' | 'success'>('idle');
  const [copySuccess, setCopySuccess] = useState(false);
  const [queueModalOpen, setQueueModalOpen] = useState(false);

  const getQualityText = () => {
    if (quality === 100) return '100% Ultra HD (Sin pérdida)';
    if (quality >= 90) return `${quality}% Estudio Alta`;
    return `${quality}% Balanceada Web`;
  };

  const handleDownload = () => {
    setDownloadState('packaging');

    setTimeout(() => {
      // Create a temporary link to download the photo
      const downloadUrl = photo.isolatedImageUrl || photo.thumbnailUrl;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${photo.filename.replace(/\.[^/.]+$/, '')}_estudio_export.${fileFormat}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadState('success');

      setTimeout(() => {
        setDownloadState('idle');
      }, 3000);
    }, 1200);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://studiodrop.art/p/${photo.id}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: photo.filename,
          text: 'Foto de producto optimizada desde StudioDrop lista para publicar.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      setQueueModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col w-full relative pb-16 pt-0">
      {/* Background Banner with blurred ambient product photography */}
      <div className="relative w-full h-44 overflow-hidden rounded-b-3xl">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5DEiQ01d0bqN0asAmus9SlrKxnWh0J0KubzB3ae8V73IH2WuTywo0e50hwrcrO7g6G_X6YOiHVtu30FN5HRTwZe7eE3soqnE8-FOETjHxtTIKYZ8LLC5em64kIZ3rULEEqgx7tndEYX_t89D-zuepoqyopKmrVDlpN_TDyEoqKi_RE42f7CWA-yS2LOVDYtFFltCgY0zPYL24CoB2xfdZ7V20GUfQpRePQhtFFfmO0FMbpemWWELN')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-[#701738]/20 backdrop-blur-md"></div>

        {/* Live Canvas Render Pill */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/85 backdrop-blur-md py-1 px-3 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#8e2f4f] animate-pulse"></span>
          <span className="text-[11px] font-semibold text-[#1c1b1c]">Renderizado en vivo</span>
        </div>
      </div>

      {/* Main Elevated Container */}
      <div className="relative -mt-16 px-4 sm:px-6 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-[#f1edee] flex flex-col gap-4">
          {/* Header Title and Subtitle */}
          <div className="flex flex-col items-center text-center pt-2">
            <div className="w-12 h-12 rounded-full bg-[#8e2f4f] text-white flex items-center justify-center shadow-md shadow-[#701738]/25 mb-3">
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h2 className="text-[22px] font-bold text-[#1c1b1c] tracking-tight">
              ¡Lista para publicar y vender!
            </h2>
            <p className="text-[12px] text-[#554246] max-w-xs mt-1">
              Tu foto de producto editada está optimizada para maximizar tus ventas y cargar al instante.
            </p>
          </div>

          {/* Product Summary Preview Card */}
          <div className="bg-[#f6f3f4] p-3 rounded-2xl flex items-center gap-3.5 border border-[#f1edee]">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#ebe7e8] shadow-xs relative">
              <img
                alt={photo.filename}
                className="w-full h-full object-cover"
                src={
                  photo.thumbnailUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ0S2JKTF9WjF6H1lJljurMqTR0Dph7hF9z8CYbmu6rD_Mjlpm7mu1RZnCgr16IXtNpnv_L-ZlLUV2W3y4V8exHASTOdxxrzsitnyI2_8VjQXY6T0B5AMIhoXKcShJURRpp5v7RfSksukGZdV3KIAt8GWsLObOkfHVxY9nyFhWynEtU2PiaCwgt_SYkP9ukdh9xuGjUnp38RrsjEujgSUWcW1gz3YUC4AZGH9M4NkxmdT4TpK6ccN0'
                }
              />
              <span className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-xs rounded-full p-0.5 text-[#8e2f4f]">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </span>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[14px] font-bold text-[#1c1b1c] truncate">
                  {photo.filename}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="bg-[#ffd9e0] text-[#3f0019] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">auto_fix_high</span>
                  Luz de estudio impecable
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[#554246] text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">photo_size_select_actual</span>
                  {selectedPreset.title.split(' ')[0]} × {selectedPreset.title.split(' ')[2]}
                </span>
                <span>•</span>
                <span className="text-[#8e2f4f] font-bold">{selectedPreset.size}</span>
              </div>
            </div>
          </div>

          {/* Export Dimensions & Preset Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1c1b1c] flex items-center justify-between">
              <span>Dimensiones y ajuste de exportación</span>
              <span className="text-[#8e2f4f] text-[11px] font-bold">{selectedPreset.aspect}</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPresetMenuOpen(!isPresetMenuOpen)}
                className="w-full bg-[#f1edee] hover:bg-[#ebe7e8] p-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#8e2f4f] flex-shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-[#1c1b1c] truncate">
                      {selectedPreset.title}
                    </span>
                    <span className="text-[11px] text-[#554246] truncate">
                      {selectedPreset.desc}
                    </span>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-[#554246] transition-transform duration-200 ${
                    isPresetMenuOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  expand_more
                </span>
              </button>

              {isPresetMenuOpen && (
                <div className="absolute top-full left-0 right-0 z-30 flex flex-col gap-1 mt-1.5 bg-[#f6f3f4] p-1.5 rounded-2xl shadow-xl border border-[#ebe7e8] animate-in fade-in duration-150">
                  {presets.map((p) => {
                    const isSelected = selectedPreset.title === p.title;
                    return (
                      <button
                        key={p.title}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(p);
                          setIsPresetMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-white shadow-xs text-[#1c1b1c]'
                            : 'hover:bg-[#f1edee] text-[#1c1b1c]'
                        }`}
                      >
                        <div>
                          <p className="text-[13px] font-bold">{p.title}</p>
                          <p className="text-[11px] text-[#554246]">{p.desc}</p>
                        </div>
                        {isSelected ? (
                          <span className="material-symbols-outlined text-[#8e2f4f] text-[18px]">
                            check
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#877276] font-semibold">{p.size}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* File Format Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1c1b1c]">Formato de archivo</label>
            <div className="grid grid-cols-3 gap-2 bg-[#f1edee] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setFileFormat('jpg')}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                  fileFormat === 'jpg'
                    ? 'bg-white shadow-xs text-[#1c1b1c]'
                    : 'text-[#554246] hover:bg-[#ebe7e8]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold">JPG</span>
                  {fileFormat === 'jpg' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8e2f4f]"></span>
                  )}
                </div>
                <span className="text-[10px] text-[#8e2f4f] font-semibold">Más liviano</span>
              </button>

              <button
                type="button"
                onClick={() => setFileFormat('png')}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                  fileFormat === 'png'
                    ? 'bg-white shadow-xs text-[#1c1b1c]'
                    : 'text-[#554246] hover:bg-[#ebe7e8]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold">PNG</span>
                  {fileFormat === 'png' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8e2f4f]"></span>
                  )}
                </div>
                <span className="text-[10px] text-[#554246]">Transparente</span>
              </button>

              <button
                type="button"
                onClick={() => setFileFormat('webp')}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                  fileFormat === 'webp'
                    ? 'bg-white shadow-xs text-[#1c1b1c]'
                    : 'text-[#554246] hover:bg-[#ebe7e8]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold">WebP</span>
                  {fileFormat === 'webp' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8e2f4f]"></span>
                  )}
                </div>
                <span className="text-[10px] text-[#554246]">Carga rápida</span>
              </button>
            </div>
          </div>

          {/* Quality Profile Slider */}
          <div className="flex flex-col gap-2 bg-[#f6f3f4] p-3.5 rounded-2xl border border-[#f1edee]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8e2f4f] text-[18px]">
                  high_density
                </span>
                <span className="text-[13px] font-semibold text-[#1c1b1c]">Perfil de calidad</span>
              </div>
              <span className="text-[11px] font-bold text-[#8e2f4f] bg-[#ffd9e0] px-2.5 py-0.5 rounded-full">
                {getQualityText()}
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="range"
                min="80"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-[#8e2f4f] h-2 bg-[#ebe7e8] rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-[10px] text-[#554246]">
              <span>Balanceada Web (80%)</span>
              <span>Estudio Alta (90%)</span>
              <span>Ultra HD (100%)</span>
            </div>
          </div>

          {/* Download & Export Action Group */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              disabled={downloadState === 'packaging'}
              onClick={handleDownload}
              className={`w-full py-3.5 px-6 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 shadow-md shadow-[#701738]/20 active:scale-[0.99] transition-all cursor-pointer ${
                downloadState === 'success'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#8e2f4f] hover:bg-[#701738] text-white'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  downloadState === 'packaging' ? 'animate-spin' : ''
                }`}
              >
                {downloadState === 'packaging'
                  ? 'progress_activity'
                  : downloadState === 'success'
                  ? 'task_alt'
                  : 'download'}
              </span>
              <span>
                {downloadState === 'packaging'
                  ? 'Empaquetando imagen en alta...'
                  : downloadState === 'success'
                  ? '¡Guardada en tu galería!'
                  : `Descargar foto (${selectedPreset.size})`}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 bg-[#f1edee] hover:bg-[#ebe7e8] text-[#1c1b1c] rounded-full text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copySuccess ? 'check' : 'link'}
                </span>
                <span>{copySuccess ? '¡Enlace copiado!' : 'Copiar enlace del archivo'}</span>
              </button>

              <button
                type="button"
                onClick={onBackToEditor}
                className="py-2.5 px-3 bg-[#f1edee] hover:bg-[#ebe7e8] text-[#1c1b1c] rounded-full text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">palette</span>
                <span>Volver a editar</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2 text-center text-[#701738] text-[12px] font-semibold flex items-center justify-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>Exportación directa a Mercado Libre, Tiendanube y redes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Queue Modal Simulation */}
      {queueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#f1edee] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#ffd9e0] text-[#8e2f4f] flex items-center justify-center font-bold">
                  ⚡
                </span>
                <h3 className="text-[16px] font-bold text-[#1c1b1c]">Sincronización con canales de venta</h3>
              </div>
              <button
                onClick={() => setQueueModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1edee] flex items-center justify-center text-[#554246] hover:bg-[#ebe7e8] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-[#554246]">
              Tu foto está formateada a 1200×1600 px con perfil de color optimizado para:
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-[#f6f3f4] rounded-xl text-[13px]">
                <span className="font-semibold text-[#1c1b1c]">Tiendanube / Tiendas Web</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span> Lista
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#f6f3f4] rounded-xl text-[13px]">
                <span className="font-semibold text-[#1c1b1c]">Mercado Libre y Marketplaces</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span> Lista
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#f6f3f4] rounded-xl text-[13px]">
                <span className="font-semibold text-[#1c1b1c]">Catálogo de Instagram y WhatsApp</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span> Lista
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setQueueModalOpen(false);
                onDoneToDashboard();
              }}
              className="w-full py-3 bg-[#8e2f4f] hover:bg-[#701738] text-white rounded-full font-bold text-[13px] shadow-sm cursor-pointer"
            >
              Enviar a borradores y volver al estudio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
