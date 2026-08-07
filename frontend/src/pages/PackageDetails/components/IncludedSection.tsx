import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface IncludedSectionProps {
  includes: string[];
}

export const IncludedSection: React.FC<IncludedSectionProps> = ({ includes }) => {
  return (
    <div className="bg-[#F0FDF4] rounded-3xl p-5 border border-emerald-100 shadow-2xs space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-600/10" />
          <h3 className="text-base font-black tracking-tight">Package Includes</h3>
        </div>

        <ul className="space-y-2">
          {includes.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <span className="text-emerald-600 font-bold text-xs">›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="text-xs font-extrabold text-[#6356E5] hover:underline flex items-center gap-0.5 self-start pt-2 cursor-pointer focus:outline-none">
        <span>View all ({includes.length})</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
