import React from 'react';
import { ImagePlus, X } from 'lucide-react';

interface MediaUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
}) => {
  const sampleDemoImages = [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
  ];

  const handleAddSampleImage = () => {
    if (images.length >= maxImages) return;
    const nextImg = sampleDemoImages[images.length % sampleDemoImages.length];
    onChange([...images, nextImg]);
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Trip Photos ({images.length}/{maxImages})
        </label>
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 group border border-slate-200/80">
            <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleAddSampleImage}
            className="aspect-square rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-[#6356E5] flex flex-col items-center justify-center p-3 gap-1 cursor-pointer transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-[11px] font-black">Add Photo</span>
          </button>
        )}
      </div>
    </div>
  );
};
