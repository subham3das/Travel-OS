import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourPackage } from '../../../types/package';

interface PackageHeroProps {
  pkg: TourPackage;
  onOpenGallery?: () => void;
}

export const PackageHero: React.FC<PackageHeroProps> = ({ pkg, onOpenGallery }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const images = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [pkg.coverImage];
  const totalImages = images.length;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pkg.title,
          text: `Check out ${pkg.title} on ApnaTrip!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="relative w-full h-[340px] sm:h-[450px] bg-slate-900 overflow-hidden select-none">
      {/* Cover Image */}
      <img
        src={images[currentIdx]}
        alt={pkg.title}
        className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
        onClick={onOpenGallery}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

      {/* Top Floating Buttons */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-slate-700'
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
          >
            <Share2 className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Next/Prev Navigation Controls */}
      {totalImages > 1 && (
        <>
          <button
            onClick={() => setCurrentIdx((prev) => (prev === 0 ? totalImages - 1 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all focus:outline-none cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIdx((prev) => (prev === totalImages - 1 ? 0 : prev + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all focus:outline-none cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Counter Overlay & Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-auto">
        <button
          onClick={onOpenGallery}
          className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-extrabold tracking-wider shadow-md hover:bg-black/80 transition-all cursor-pointer"
        >
          {currentIdx + 1} / {totalImages}
        </button>

        {totalImages > 1 && (
          <div className="flex items-center gap-1.5">
            {images.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
