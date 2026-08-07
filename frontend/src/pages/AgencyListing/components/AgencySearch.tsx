import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface AgencySearchProps {
  value: string;
  onChange: (val: string) => void;
  onFilterClick?: () => void;
}

export const AgencySearch: React.FC<AgencySearchProps> = ({
  value,
  onChange,
  onFilterClick,
}) => {
  return (
    <div className="w-full relative flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search agencies..."
          className="w-full bg-white border border-slate-100/90 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm font-semibold text-[#0F172A] placeholder-slate-400 shadow-2xs focus:outline-none focus:border-[#6356E5]/40 transition-all"
        />
      </div>

      <button
        onClick={onFilterClick}
        className="w-12 h-12 rounded-2xl bg-white border border-slate-100/90 flex items-center justify-center text-slate-600 hover:text-[#6356E5] hover:border-[#6356E5]/30 shadow-2xs transition-all shrink-0 focus:outline-none cursor-pointer"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};
