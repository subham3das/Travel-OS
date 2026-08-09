import React from 'react';
import { Image, Video } from 'lucide-react';

interface PackageGalleryProps {
  images: string[];
}

export const PackageGallery: React.FC<PackageGalleryProps> = ({ images }) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2">
          <Image className="w-5 h-5 text-[#583BE8]" />
          <span>Package Gallery & Visual Assets</span>
        </h3>

        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold flex items-center gap-1">
          <Video className="w-3 h-3 text-purple-600" />
          <span>Video Ready 4K</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((imgUrl, index) => (
          <div
            key={index}
            className="group relative h-28 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs cursor-pointer"
          >
            <img
              src={imgUrl}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageGallery;
