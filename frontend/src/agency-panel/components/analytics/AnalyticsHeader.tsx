import React from 'react';
import { Search, SlidersHorizontal, BarChart3 } from 'lucide-react';

interface AnalyticsHeaderProps {
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  onOpenFilters: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  isSearchOpen,
  onToggleSearch,
  onOpenFilters,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Track your business performance and growth
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSearch}
          className={`p-2.5 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isSearchOpen
              ? 'bg-[#583BE8] text-white border-[#583BE8]'
              : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200 shadow-2xs'
          }`}
          aria-label="Search Analytics"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenFilters}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-[#583BE8] hover:text-[#583BE8] transition-colors cursor-pointer shadow-2xs"
          aria-label="Filter Analytics"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
