import React from 'react';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  return (
    <div className="space-y-3 select-none">
      {/* Instant Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, phone or booking ID..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all shadow-2xs"
        />
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full appearance-none bg-white text-[#0F172A] font-extrabold text-xs px-3.5 py-2.5 pr-8 rounded-2xl border border-slate-200 cursor-pointer focus:outline-none focus:border-[#2563EB] shadow-2xs truncate"
          >
            <option value="All">All Status</option>
            <option value="VIP">VIP</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Customer Type Dropdown */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="w-full appearance-none bg-white text-[#0F172A] font-extrabold text-xs px-3.5 py-2.5 pr-8 rounded-2xl border border-slate-200 cursor-pointer focus:outline-none focus:border-[#2563EB] shadow-2xs truncate"
          >
            <option value="All">All Customer Type</option>
            <option value="Solo Traveler">Solo Traveler</option>
            <option value="Group Traveler">Group Traveler</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filters Button */}
        <button
          type="button"
          onClick={() => alert('Advanced Filter options coming soon')}
          className="w-full bg-white text-[#0F172A] font-extrabold text-xs px-3 py-2.5 rounded-2xl border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs hover:border-[#2563EB] transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Filters</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default CustomerSearch;
