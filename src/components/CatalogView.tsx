import React, { useState } from 'react';
import { StudioPhoto } from '../types';

interface CatalogViewProps {
  photos: StudioPhoto[];
  onSelectPhoto: (photo: StudioPhoto) => void;
  onAddNewPhotoClick: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  photos,
  onSelectPhoto,
  onAddNewPhotoClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchActionMsg, setBatchActionMsg] = useState<string | null>(null);

  const filtered = photos.filter((p) =>
    p.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === photos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(photos.map((p) => p.id));
    }
  };

  const handleBatchDownload = () => {
    if (selectedIds.length === 0) return;
    setBatchActionMsg(`Packaging ${selectedIds.length} assets for bulk export...`);
    setTimeout(() => {
      setBatchActionMsg(null);
      alert(`Successfully downloaded ${selectedIds.length} marketplace ready photos!`);
      setSelectedIds([]);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 sm:px-6 max-w-2xl mx-auto w-full space-y-4">
        {/* Header & Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#1c1b1c]">Reseller Catalog</h2>
            <p className="text-[12px] text-[#554246]">
              {photos.length} items cataloged • Multi-platform formats ready
            </p>
          </div>
          <button
            onClick={onAddNewPhotoClick}
            className="flex items-center gap-1 px-3.5 py-2 bg-[#8e2f4f] hover:bg-[#701738] text-white rounded-full text-[12px] font-bold shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>Add Item</span>
          </button>
        </div>

        {/* Search & Bulk Select Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#877276] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search product inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-white text-[#1c1b1c] placeholder:text-[#877276] text-[13px] rounded-xl border border-[#f1edee] focus:outline-none focus:ring-2 focus:ring-[#8e2f4f]/20"
            />
          </div>

          <button
            type="button"
            onClick={handleSelectAll}
            className={`px-3 h-10 rounded-xl text-[12px] font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              selectedIds.length > 0
                ? 'bg-[#ffd9e0] text-[#701738] border-[#ffd9e0]'
                : 'bg-white text-[#554246] border-[#f1edee] hover:bg-[#f6f3f4]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {selectedIds.length === photos.length ? 'check_box' : 'check_box_outline_blank'}
            </span>
            <span>{selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select'}</span>
          </button>
        </div>

        {/* Bulk Action Banner */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-white rounded-2xl border border-[#8e2f4f]/30 shadow-sm flex items-center justify-between animate-in fade-in">
            <span className="text-[12px] font-semibold text-[#8e2f4f]">
              {selectedIds.length} items selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBatchDownload}
                className="px-3 py-1.5 bg-[#8e2f4f] text-white rounded-full text-[12px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Export Selected</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="p-1 text-[#877276] hover:text-[#1c1b1c] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        {batchActionMsg && (
          <div className="p-3 bg-[#ffd9e0] text-[#701738] rounded-xl text-[12px] font-bold text-center animate-pulse">
            {batchActionMsg}
          </div>
        )}

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {filtered.map((photo) => {
            const isSelected = selectedIds.includes(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className={`relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border transition-all cursor-pointer ${
                  isSelected ? 'border-[#8e2f4f] ring-2 ring-[#8e2f4f]/20' : 'border-[#f1edee]'
                }`}
              >
                <div className="relative w-full aspect-[4/5] bg-[#ebe7e8] overflow-hidden">
                  <img
                    alt={photo.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    src={photo.thumbnailUrl}
                  />

                  {/* Multi-select check */}
                  <button
                    type="button"
                    onClick={(e) => toggleSelect(photo.id, e)}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#8e2f4f] text-white'
                        : 'bg-white/80 text-[#554246] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check' : 'check_box_outline_blank'}
                    </span>
                  </button>

                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 text-[#1c1b1c] text-[10px] font-bold shadow-xs">
                      {photo.dimensions}
                    </span>
                  </div>
                </div>

                <div className="p-2.5">
                  <p className="text-[13px] font-semibold text-[#1c1b1c] truncate">
                    {photo.filename}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[#554246]">
                    <span>{photo.presetApplied || 'Clean Studio'}</span>
                    <span className="text-[#8e2f4f] font-semibold">{photo.filesize}</span>
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
