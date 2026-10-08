import React from 'react';
import { Search, SlidersHorizontal, Download, Car } from 'lucide-react';

interface CarRentalApprovalHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleFilter: () => void;
  isFilterOpen: boolean;
  onExport: () => void;
}

export const CarRentalApprovalHeader: React.FC<CarRentalApprovalHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilter,
  isFilterOpen,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100/80 shadow-xs">
      {/* Title & Badge */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#6356E5]/10 text-[#6356E5] flex items-center justify-center shadow-xs">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">
              Car Rental Approvals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-[#6356E5] border border-indigo-100/60">
              Fleet Partners
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Review commercial fleet registrations, vehicle permits, chauffeurs, and compliance certifications.
          </p>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Quick Search */}
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search provider, ID, city..."
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200/70 rounded-xl text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={onToggleFilter}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isFilterOpen
              ? 'bg-[#6356E5] text-white border-[#6356E5] shadow-xs'
              : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {/* Export CSV Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
