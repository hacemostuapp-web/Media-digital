import React, { useState, useRef } from 'react';
import { StudioPhoto, UserProfile, PhotoStatus } from '../types';
import { uploadPhotoToCloudinary } from '../services/cloudinaryService';

interface DashboardViewProps {
  photos: StudioPhoto[];
  user: UserProfile;
  onSelectPhotoForEdit: (photo: StudioPhoto) => void;
  onAddNewPhoto: (newPhoto: StudioPhoto) => void;
  onUpgradeClick: () => void;
  onOpenStoreSwitch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  photos,
  user,
  onSelectPhotoForEdit,
  onAddNewPhoto,
  onUpgradeClick,
  onOpenStoreSwitch,
}) => {
  const [activeFilter, setActiveFilter] = useState<PhotoStatus>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered photos
  const filteredPhotos = photos.filter((photo) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'edited') return photo.status === 'edited';
    if (activeFilter === 'raw') return photo.status === 'raw';
    if (activeFilter === 'exported') return photo.status === 'exported';
    return true;
  });

  const counts = {
    all: photos.length,
    edited: photos.filter((p) => p.status === 'edited').length,
    raw: photos.filter((p) => p.status === 'raw').length,
    exported: photos.filter((p) => p.status === 'exported').length,
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor subí una imagen');
      return;
    }

    setIsUploading(true);
    try {
      const { originalUrl, publicId } = await uploadPhotoToCloudinary(file);

      const newPhoto: StudioPhoto = {
        id: `photo-${publicId}`,
        filename: file.name || 'producto_importado.jpg',
        dimensions: '2400 × 3000 px',
        filesize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'raw',
        badgeText: 'Original sin editar',
        badgeType: 'neutral',
        timeAgo: 'Recién',
        thumbnailUrl: originalUrl,
        rawImageUrl: originalUrl,
        isolatedImageUrl: originalUrl,
        altText: file.name,
        presetApplied: 'Natural Original',
        contrast: 0,
        saturation: 0,
        brightness: 0,
        isBgRemoved: false,
        selectedBackdrop: 'neutral',
        isLightingImproved: false,
        platformPreset: '1200 × 1600 px',
        exportFormat: 'jpg',
        exportQuality: 90,
      };
      onAddNewPhoto(newPhoto);
      onSelectPhotoForEdit(newPhoto);
    } catch (error) {
      console.error('Error subiendo foto:', error);
      alert('Error subiendo la foto. Intentá de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 sm:px-6 max-w-2xl mx-auto w-full space-y-5">
        {/* User Welcome Greeting Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f1edee] flex items-center justify-between transition-all">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8e2f4f]/20 shadow-xs"
                src={user.avatarUrl}
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[19px] font-bold text-[#1c1b1c] truncate tracking-tight">
                ¡Qué bueno verte, {user.name}! 👋
              </h1>
              <span className="text-[12px] text-[#8e2f4f] font-semibold">
                {user.storeName}
              </span>
            </div>
          </div>
          <button
            aria-label="Cambiar de tienda"
            onClick={onOpenStoreSwitch}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f3f4] text-[#554246] hover:text-[#701738] hover:bg-[#ebe7e8] transition-colors flex-shrink-0 cursor-pointer"
            type="button"
            title="Cambiar de tienda o local"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </button>
        </div>

        {/* Interactive Upload Zone (Drag & Drop Canvas) */}
        <div
          id="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-2xl bg-[#f6f3f4] transition-all duration-300 p-6 flex flex-col items-center justify-center text-center overflow-hidden active:scale-[0.99] shadow-sm ${
            isDragging ? 'bg-[#e5e1e2] ring-2 ring-[#8e2f4f]' : 'hover:bg-[#ebe7e8]/70'
          }`}
        >
          <div className="absolute inset-0 border-2 border-dashed border-[#8e2f4f]/30 rounded-2xl pointer-events-none group-hover:border-[#8e2f4f] transition-colors"></div>
          {/* Ambient Sparkle Glow Overlay */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#ffd9e0]/40 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            {isUploading ? (
              <>
                {/* Loading State */}
                <div className="w-16 h-16 rounded-full bg-[#ffd9e0] text-[#8e2f4f] flex items-center justify-center shadow-md mb-3.5 animate-pulse">
                  <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
                </div>
                <h2 className="text-[17px] font-semibold text-[#1c1b1c] mb-1">
                  Subiendo tu foto...
                </h2>
                <p className="text-[12px] text-[#554246] max-w-[320px]">
                  Procesando en Cloudinary ✨
                </p>
              </>
            ) : (
              <>
                {/* Prominent Burgundy Icon */}
                <div className="w-16 h-16 rounded-full bg-[#8e2f4f] text-white flex items-center justify-center shadow-md mb-3.5 transform group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                </div>
                <h2 className="text-[17px] font-semibold text-[#1c1b1c] mb-1">
                  Tocá para subir o arrastrá fotos acá
                </h2>
                <p className="text-[12px] text-[#554246] max-w-[320px] mb-4">
                  JPG, PNG, HEIC en alta resolución hasta 25 MB • Listo para auto-mejora
                </p>
                {/* Action Button */}
                <button
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-[#8e2f4f] text-[13px] font-semibold rounded-full shadow-xs hover:bg-[#fcf8f9] hover:shadow transition-all pointer-events-none"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_library</span>
                  <span>Elegir del carrete o galería</span>
                </button>
              </>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/heic"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Photo Gallery Section */}
        <div className="space-y-3.5">
          {/* Section Header & Filter Controls */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#1c1b1c]">Fotos recientes de estudio</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffd9e0] text-[#3f0019] text-[11px] font-bold">
                  {photos.length} fotos
                </span>
              </div>
              <button
                onClick={() => setActiveFilter('all')}
                className="text-[#8e2f4f] text-[12px] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                type="button"
              >
                Ver todas
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Filter Pills Scrollable Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#8e2f4f] text-white shadow-xs'
                    : 'bg-white text-[#554246] hover:bg-[#f1edee] border border-[#f1edee]'
                }`}
                type="button"
              >
                Todas ({counts.all})
              </button>
              <button
                onClick={() => setActiveFilter('edited')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'edited'
                    ? 'bg-[#8e2f4f] text-white shadow-xs'
                    : 'bg-white text-[#554246] hover:bg-[#f1edee] border border-[#f1edee]'
                }`}
                type="button"
              >
                Editadas ({counts.edited})
              </button>
              <button
                onClick={() => setActiveFilter('raw')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'raw'
                    ? 'bg-[#8e2f4f] text-white shadow-xs'
                    : 'bg-white text-[#554246] hover:bg-[#f1edee] border border-[#f1edee]'
                }`}
                type="button"
              >
                Originales ({counts.raw})
              </button>
              <button
                onClick={() => setActiveFilter('exported')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'exported'
                    ? 'bg-[#8e2f4f] text-white shadow-xs'
                    : 'bg-white text-[#554246] hover:bg-[#f1edee] border border-[#f1edee]'
                }`}
                type="button"
              >
                Exportadas ({counts.exported})
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Thumbnail Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhotoForEdit(photo)}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-[#f1edee] transition-all cursor-pointer"
              >
                <div className="relative w-full aspect-[4/5] bg-[#ebe7e8] overflow-hidden">
                  <img
                    alt={photo.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={photo.thumbnailUrl}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    {photo.badgeType === 'emerald' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/90 backdrop-blur-md text-emerald-800 text-[10px] font-bold shadow-xs">
                        {photo.status === 'exported' ? (
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        )}
                        {photo.badgeText}
                      </span>
                    ) : photo.badgeType === 'amber' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/90 backdrop-blur-md text-amber-900 text-[10px] font-bold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        {photo.badgeText}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e5e1e2]/90 backdrop-blur-md text-[#554246] text-[10px] font-bold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#877276]"></span>
                        {photo.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Quick Floating Action Button */}
                  <button
                    aria-label={`Abrir editor para ${photo.filename}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPhotoForEdit(photo);
                    }}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#8e2f4f] flex items-center justify-center shadow-xs opacity-90 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {photo.status === 'raw'
                        ? 'auto_fix_high'
                        : photo.status === 'in_progress'
                        ? 'tune'
                        : photo.status === 'exported'
                        ? 'share'
                        : 'edit'}
                    </span>
                  </button>
                </div>

                <div className="p-2.5 flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold text-[#1c1b1c] truncate">
                    {photo.filename}
                  </span>
                  <span className="text-[11px] text-[#554246] mt-0.5">
                    {photo.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quota Display Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f1edee] space-y-3.5 relative overflow-hidden">
          {/* Decorative faint gradient flair */}
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#ffd9e0]/50 rounded-full blur-xl pointer-events-none"></div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-[#1c1b1c]">Uso mensual</span>
              <span className="text-[12px] font-semibold text-[#8e2f4f]">
                {user.usedCredits} de {user.totalCredits} usadas
              </span>
            </div>

            {/* Progress Bar (30% Filled) */}
            <div className="w-full h-2.5 bg-[#f1edee] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#8e2f4f] rounded-full transition-all duration-500"
                style={{ width: `${(user.usedCredits / user.totalCredits) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[12px] text-[#554246]">{user.tier}</span>
              <span className="text-[11px] text-[#877276]">Se renueva en {user.renewsInDays} días</span>
            </div>
          </div>

          {/* Upgrade Action Button */}
          <button
            onClick={onUpgradeClick}
            className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-[#701738] hover:bg-[#8e2f4f] text-white rounded-full text-[14px] font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ffd9e0]">auto_awesome</span>
            <span>Pasar al Plan Ilimitado</span>
          </button>
        </div>
      </div>
    </div>
  );
};
