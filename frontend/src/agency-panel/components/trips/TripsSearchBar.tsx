import React from 'react';
import { Search, Calendar, Filter, ArrowUpDown } from 'lucide-react';

interface TripsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  onDateClick?: () => void;
  onSortClick?: () => void;
}

export const TripsSearchBar: React.FC<TripsSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  onDateClick,
  onSortClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2.5 select-none">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search trips..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] focus:ring-2 focus:ring-[#583BE8]/10 transition-all shadow-2xs"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
        <button
          type="button"
          onClick={onDateClick}
          className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#583BE8] hover:border-purple-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs flex-1 sm:flex-none justify-center"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Date</span>
          <span className="text-[10px] text-slate-400">▾</span>
        </button>

        <button
          type="button"
          onClick={onFilterClick}
          className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#583BE8] hover:border-purple-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs flex-1 sm:flex-none justify-center"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter</span>
          <span className="text-[10px] text-slate-400">▾</span>
        </button>

        <button
          type="button"
          onClick={onSortClick}
          className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#583BE8] hover:border-purple-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs flex-1 sm:flex-none justify-center"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort</span>
          <span className="text-[10px] text-slate-400">▾</span>
        </button>
      </div>
    </div>
  );
};

export default TripsSearchBar;
