import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const GalleryPreviewCarousel: React.FC = () => {
  const { draft } = usePackageWizard();
  const galleryImages = draft?.step5?.galleryImages || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (galleryImages.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-2 select-none">
      <div className="space-y-0.5">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Gallery Preview</h3>
        <p className="text-xs font-semibold text-slate-400">
          This is how travelers will see your gallery
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative pt-2">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2">
          {galleryImages.map((image, idx) => {
            const isActive = idx === currentIndex;

            return (
              <div
                key={image.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-40 sm:w-56 aspect-4/3 rounded-3xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'border-[#583BE8] shadow-lg shadow-[#583BE8]/20 scale-105 z-10'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={image.url} alt={image.name || 'Preview'} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-white cursor-pointer z-20"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-white cursor-pointer z-20"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {galleryImages.slice(0, 10).map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                dotIdx === currentIndex ? 'w-5 bg-[#583BE8]' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPreviewCarousel;
