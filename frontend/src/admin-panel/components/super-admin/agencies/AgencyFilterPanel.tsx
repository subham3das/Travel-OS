import React from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';
import { AgencyFilters } from '../../../types/agency';

interface AgencyFilterPanelProps {
  filters: AgencyFilters;
  onChange: (key: keyof AgencyFilters, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export const AgencyFilterPanel: React.FC<AgencyFilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  onApply,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      {/* Top Row: 7 Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Verification Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Verification
          </label>
          <div className="relative">
            <select
              value={filters.verification}
              onChange={(e) => onChange('verification', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Verification">All Verification</option>
              <option value="Verified">Verified</option>
              <option value="Under Review">Under Review</option>
              <option value="Documents Missing">Documents Missing</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Business Type Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Business Type
          </label>
          <div className="relative">
            <select
              value={filters.businessType}
              onChange={(e) => onChange('businessType', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Tour Operator">Tour Operator</option>
              <option value="Adventure">Adventure</option>
              <option value="Travel Agency">Travel Agency</option>
              <option value="DMC">DMC</option>
              <option value="OTA">OTA</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            State
          </label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) => onChange('state', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All States">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="Goa">Goa</option>
              <option value="Kerala">Kerala</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            City
          </label>
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Cities">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Dehradun">Dehradun</option>
              <option value="Goa">Goa</option>
              <option value="Kochi">Kochi</option>
              <option value="Manali">Manali</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Rating
          </label>
          <div className="relative">
            <select
              value={filters.rating}
              onChange={(e) => onChange('rating', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Ratings">All Ratings</option>
              <option value="4.5+">4.5+ Stars</option>
              <option value="4.0+">4.0+ Stars</option>
              <option value="3.5+">3.5+ Stars</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Date Joined Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Date Joined
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.dateJoined}
              placeholder="Select Date Range"
              onChange={(e) => onChange('dateJoined', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] placeholder-slate-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Detailed Search + Reset & Apply */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search by agency name, owner, email, phone, GST..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5]"
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={onApply}
            className="px-5 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/20 transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};
