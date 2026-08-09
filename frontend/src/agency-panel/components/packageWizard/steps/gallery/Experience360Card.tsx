import React from 'react';
import { Compass } from 'lucide-react';

export const Experience360Card: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">
            360° Experience <span className="text-slate-400 font-semibold">(Coming Soon)</span>
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 truncate">
            Add 360° virtual tour to give travelers an immersive preview
          </p>
        </div>
      </div>

      <span className="px-3 py-1 rounded-xl bg-purple-50 text-[#583BE8] text-[11px] font-black shrink-0">
        Coming Soon
      </span>
    </div>
  );
};

export default Experience360Card;
