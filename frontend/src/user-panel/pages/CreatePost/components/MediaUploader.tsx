import React, { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { cloudinaryUploadService } from '../../../../services/cloudinaryUpload.service';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setIsUploading(true);
    try {
      const uploadResults = await cloudinaryUploadService.uploadMultipleImages(
        filesToUpload,
        'travelos/customers/gallery'
      );
      const newUrls = uploadResults.map((res) => res.secureUrl);
      onChange([...images, ...newUrls]);
    } catch (err: any) {
      console.error('Failed to upload images to Cloudinary:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

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
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-[#6356E5] flex flex-col items-center justify-center p-3 gap-1 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-[10px] font-bold">Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-6 h-6" />
                <span className="text-[11px] font-black">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
