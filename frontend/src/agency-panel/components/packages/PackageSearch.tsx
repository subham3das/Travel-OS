import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface PackageSearchProps {
  value: string;
  onChange: (v: string) => void;
  filterCount?: number;
  onFilterClick?: () => void;
}

export const PackageSearch: React.FC<PackageSearchProps> = ({
  value,
  onChange,
  filterCount = 2,
  onFilterClick,
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search package by name, destination or ID..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors"
        />
      </div>

      <button
        type="button"
        onClick={onFilterClick}
        className="px-4 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-extrabold text-[#583BE8] hover:border-purple-200 flex items-center gap-2 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.03)] shrink-0"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {filterCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#583BE8] text-white text-[9px] font-black flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default PackageSearch;
