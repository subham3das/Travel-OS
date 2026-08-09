import React from 'react';
import { Plus } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { GalleryImageCard } from './GalleryImageCard';

export const GalleryGrid: React.FC = () => {
  const { draft, addGalleryImage, removeGalleryImage } = usePackageWizard();

  const galleryImages = draft?.step5?.galleryImages || [];

  const handleAddMore = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1476514525535-ce74f45814d1?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80',
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    addGalleryImage(randomPhoto);
  };

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Gallery Images <span className="text-rose-500">*</span>{' '}
          <span className="text-xs font-semibold text-slate-400">(Min. 3 images)</span>
        </label>
        <span className="text-xs font-bold text-slate-400">
          {galleryImages.length} / 20 images
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {galleryImages.map((image) => (
          <GalleryImageCard key={image.id} image={image} onRemove={removeGalleryImage} />
        ))}
      </div>

      {/* Add More Button */}
      <button
        type="button"
        onClick={handleAddMore}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-[#583BE8]/50 hover:border-[#583BE8] bg-purple-50/40 hover:bg-purple-50 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add More Images</span>
      </button>
    </div>
  );
};

export default GalleryGrid;
