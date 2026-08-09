import React from 'react';
import { Info, Check } from 'lucide-react';

export const UploadGuidelinesCard: React.FC = () => {
  return (
    <div className="bg-purple-50/50 rounded-3xl p-5 border border-purple-100 space-y-3 select-none">
      <div className="flex items-center gap-2 text-xs font-black text-[#583BE8]">
        <Info className="w-4 h-4" />
        <span>Upload Guidelines</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
        <div className="flex items-start gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>High-resolution images recommended (Min. 1920×1080)</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>Maximum 10MB per image</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>JPG, PNG, WEBP formats only</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>Avoid watermarks and promotional text</span>
        </div>
      </div>
    </div>
  );
};

export default UploadGuidelinesCard;
