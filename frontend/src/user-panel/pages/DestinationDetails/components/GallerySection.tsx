import React, { useState } from 'react';
import { Camera, Play, Image as ImageIcon, X } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface GallerySectionProps {
  destination: Destination;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ destination }) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | '360'>('photos');
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Gallery
        </h2>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
              activeTab === 'photos' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
              activeTab === 'videos' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('360')}
            className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
              activeTab === '360' ? 'bg-[#6356E5] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            360°
          </button>
        </div>
      </div>

      {/* Grid of media items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {destination.gallery.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setFullscreenImg(img)}
            className="relative h-28 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 shadow-2xs group cursor-pointer"
          >
            <img
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {activeTab === 'videos' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-white/90 text-[#FF4D6D] flex items-center justify-center pl-0.5 shadow-md">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImg && (
        <div
          onClick={() => setFullscreenImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setFullscreenImg(null)}
            className="absolute top-4 right-4 p-2 text-white bg-white/20 rounded-full hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImg}
            alt="Fullscreen view"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
