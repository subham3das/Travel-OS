import React from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';
import { PackageFilters } from '../../../types/packageManagement';

interface PackageFilterPanelProps {
  filters: PackageFilters;
  onChange: (key: keyof PackageFilters, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export const PackageFilterPanel: React.FC<PackageFilterPanelProps> = ({
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
      {/* Top Row: 8 Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Status */}
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
              <option value="Draft">Draft</option>
              <option value="Sold Out">Sold Out</option>
              <option value="Hidden">Hidden</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Destination
          </label>
          <div className="relative">
            <select
              value={filters.destination}
              onChange={(e) => onChange('destination', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Destinations">All Destinations</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Indonesia">Indonesia</option>
              <option value="India">India</option>
              <option value="Maldives">Maldives</option>
              <option value="UAE">UAE</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Agency */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Agency
          </label>
          <div className="relative">
            <select
              value={filters.agency}
              onChange={(e) => onChange('agency', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Agencies">All Agencies</option>
              <option value="Wanderlust Holidays">Wanderlust Holidays</option>
              <option value="Himalayan Treks">Himalayan Treks</option>
              <option value="Goa Getaways">Goa Getaways</option>
              <option value="Kerala Backwaters">Kerala Backwaters</option>
              <option value="Adventure India">Adventure India</option>
              <option value="Holiday Hub Agency">Holiday Hub Agency</option>
              <option value="Explore NorthEast">Explore NorthEast</option>
              <option value="Desert Dunes Travels">Desert Dunes Travels</option>
              <option value="Sikkim Serenity">Sikkim Serenity</option>
              <option value="Cityscape Holidays">Cityscape Holidays</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Luxury">Luxury</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
              <option value="Beach">Beach</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Trekking">Trekking</option>
              <option value="Family">Family</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Trip Duration */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Trip Duration
          </label>
          <div className="relative">
            <select
              value={filters.duration}
              onChange={(e) => onChange('duration', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Durations">All Durations</option>
              <option value="1-3 Days">1-3 Days</option>
              <option value="4-6 Days">4-6 Days</option>
              <option value="7-10 Days">7-10 Days</option>
              <option value="10+ Days">10+ Days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Price Range
          </label>
          <div className="relative">
            <select
              value={filters.priceRange}
              onChange={(e) => onChange('priceRange', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Prices">All Prices</option>
              <option value="Under ₹25,000">Under ₹25,000</option>
              <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
              <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
              <option value="Above ₹1,00,000">Above ₹1,00,000</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Departure Month */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Departure Month
          </label>
          <div className="relative">
            <select
              value={filters.departureMonth}
              onChange={(e) => onChange('departureMonth', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Months">All Months</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Rating */}
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
              <option value="4.5 & above">4.5 & above</option>
              <option value="4.0 & above">4.0 & above</option>
              <option value="3.5 & above">3.5 & above</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Row: Search + Reset & Apply */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search by package title, package ID or agency..."
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
