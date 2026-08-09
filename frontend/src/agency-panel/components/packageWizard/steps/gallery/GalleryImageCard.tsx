import React from 'react';
import { X, Menu } from 'lucide-react';
import { GalleryImage } from '../../../../types/gallery';

interface GalleryImageCardProps {
  image: GalleryImage;
  onRemove: (id: string) => void;
}

export const GalleryImageCard: React.FC<GalleryImageCardProps> = ({ image, onRemove }) => {
  return (
    <div className="relative group w-full aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs select-none">
      <img src={image.url} alt={image.name || 'Gallery photo'} className="w-full h-full object-cover" />

      {/* Delete button top-right */}
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-rose-500 text-slate-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        aria-label="Remove Image"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Drag handle bottom-left */}
      <div className="absolute bottom-2 left-2 w-6 h-6 rounded-xl bg-slate-900/60 backdrop-blur-xs text-white flex items-center justify-center">
        <Menu className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};

export default GalleryImageCard;
