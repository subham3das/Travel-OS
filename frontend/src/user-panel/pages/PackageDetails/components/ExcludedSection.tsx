import React from 'react';
import { XCircle, ChevronRight } from 'lucide-react';

interface ExcludedSectionProps {
  excludes: string[];
}

export const ExcludedSection: React.FC<ExcludedSectionProps> = ({ excludes }) => {
  return (
    <div className="bg-[#FEF2F2] rounded-3xl p-5 border border-rose-100 shadow-2xs space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-rose-800">
          <XCircle className="w-5 h-5 text-rose-600 fill-rose-600/10" />
          <h3 className="text-base font-black tracking-tight">Package Excludes</h3>
        </div>

        <ul className="space-y-2">
          {excludes.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <span className="text-rose-500 font-bold text-xs">›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="text-xs font-extrabold text-[#6356E5] hover:underline flex items-center gap-0.5 self-start pt-2 cursor-pointer focus:outline-none">
        <span>View all ({excludes.length})</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
