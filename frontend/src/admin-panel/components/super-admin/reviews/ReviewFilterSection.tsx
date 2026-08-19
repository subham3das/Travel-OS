import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Calendar, RotateCcw } from 'lucide-react';
import { ReviewFilters } from '../../../types/reviewManagement';

interface ReviewFilterSectionProps {
  filters: ReviewFilters;
  quickCounts: {
    all: number;
    pending: number;
    approved: number;
    reported: number;
    removed: number;
  };
  onQuickStatusChange: (status: ReviewFilters['quickStatus']) => void;
  onFilterChange: (key: keyof ReviewFilters, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export const ReviewFilterSection: React.FC<ReviewFilterSectionProps> = ({
  filters,
  quickCounts,
  onQuickStatusChange,
  onFilterChange,
  onReset,
  onApply,
}) => {
  const quickPills: { id: ReviewFilters['quickStatus']; label: string; count: number; badgeColor: string }[] = [
    { id: 'All', label: 'All', count: quickCounts.all, badgeColor: 'bg-purple-100 text-[#6356E5]' },
    { id: 'Pending', label: 'Pending', count: quickCounts.pending, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'Approved', label: 'Approved', count: quickCounts.approved, badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'Reported', label: 'Reported', count: quickCounts.reported, badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'Removed', label: 'Removed', count: quickCounts.removed, badgeColor: 'bg-slate-200 text-slate-700' },
  ];

  return (
    <div className="space-y-3.5 select-none">
      {/* ── 1. Quick Status Filter Pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-black text-slate-400 mr-1">Quick Status</span>

        {quickPills.map((pill) => {
          const isActive = filters.quickStatus === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => onQuickStatusChange(pill.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-black ${
                  isActive ? 'bg-white/20 text-white' : pill.badgeColor
                }`}
              >
                {pill.count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 2. Advanced Filters Row ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {/* Agency */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 block">Agency</label>
            <div className="relative">
              <select
                value={filters.agency}
                onChange={(e) => onFilterChange('agency', e.target.value)}
                className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer truncate"
              >
                <option value="All Agencies">All Agencies</option>
                <option value="Mountain Trails">Mountain Trails</option>
                <option value="Himalayan Treks">Himalayan Treks</option>
                <option value="Wanderlust Holidays">Wanderlust Holidays</option>
                <option value="Go Getaways">Go Getaways</option>
                <option value="Trip N Go">Trip N Go</option>
                <option value="Adventure India">Adventure India</option>
                <option value="Budget Tours">Budget Tours</option>
                <option value="Royal Roads">Royal Roads</option>
                <option value="NorthEast Explorers">NorthEast Explorers</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 block">Destination</label>
            <div className="relative">
              <select
                value={filters.destination}
                onChange={(e) => onFilterChange('destination', e.target.value)}
                className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer truncate"
              >
                <option value="All Destinations">All Destinations</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Goa">Goa</option>
                <option value="Kashmir">Kashmir</option>
                <option value="Kerala">Kerala</option>
                <option value="Andaman">Andaman</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Assam">Assam</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 block">Rating</label>
            <div className="relative">
              <select
                value={filters.rating}
                onChange={(e) => onFilterChange('rating', e.target.value)}
                className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer"
              >
                <option value="All Ratings">All Ratings</option>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★</option>
                <option value="3">3 Stars ★★★</option>
                <option value="2">2 Stars ★★</option>
                <option value="1">1 Star ★</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 block">Status</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Reported">Reported</option>
                <option value="Removed">Removed</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Reported */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 block">Reported</label>
            <div className="relative">
              <select
                value={filters.reported}
                onChange={(e) => onFilterChange('reported', e.target.value)}
                className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Reported Only">Reported Only</option>
                <option value="No Reports">No Reports</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Verified Booking */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 block">Verified Booking</label>
            <div className="relative">
              <select
                value={filters.verifiedBooking}
                onChange={(e) => onFilterChange('verifiedBooking', e.target.value)}
                className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Verified Only">Verified Only</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 block">Date Range</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filters.dateRange}
                onChange={(e) => onFilterChange('dateRange', e.target.value)}
                placeholder="Select date range"
                className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs placeholder:text-slate-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Search Bar + Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search review ID, traveler, package..."
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={onApply}
              className="px-5 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
