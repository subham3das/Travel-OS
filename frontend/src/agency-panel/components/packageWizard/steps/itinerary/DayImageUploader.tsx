import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface DayImageUploaderProps {
  image?: string;
  onChange: (image: string) => void;
}

export const DayImageUploader: React.FC<DayImageUploaderProps> = ({ image, onChange }) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=80';

  const currentImage = image || defaultImage;

  const handleUploadClick = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    ];
    const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
    onChange(randomImg);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 select-none flex-1">
      <div className="flex items-center gap-1.5 text-xs font-black text-[#0F172A]">
        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
        <span>Day Image</span>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="relative group cursor-pointer" onClick={handleUploadClick}>
          <img
            src={currentImage}
            alt="Day Preview"
            className="w-24 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
          />
          <div className="absolute inset-0 bg-slate-900/40 rounded-xl flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-0.5">
          <button
            type="button"
            onClick={handleUploadClick}
            className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
          >
            Upload a photo
          </button>
          <p className="text-[10px] font-semibold text-slate-400">JPG, PNG up to 5MB</p>
        </div>
      </div>
    </div>
  );
};

export default DayImageUploader;
