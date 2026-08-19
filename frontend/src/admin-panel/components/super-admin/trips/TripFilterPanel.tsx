import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, ChevronDown, RotateCcw } from 'lucide-react';
import { TripFilters } from '../../../types/tripManagement';

interface TripFilterPanelProps {
  filters: TripFilters;
  onChange: (key: keyof TripFilters, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export const TripFilterPanel: React.FC<TripFilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  onApply,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      {/* ── First Row of Dropdown Filters (5 fields) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Trip Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">Trip Status</label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full appearance-none bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Running">Running</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Agency */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">Agency</label>
          <div className="relative">
            <select
              value={filters.agency}
              onChange={(e) => onChange('agency', e.target.value)}
              className="w-full appearance-none bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <option value="All Agencies">All Agencies</option>
              <option value="Mountain Trails">Mountain Trails</option>
              <option value="Wanderlust Holidays">Wanderlust Holidays</option>
              <option value="Goa Getaways">Goa Getaways</option>
              <option value="Kashmir Trips">Kashmir Trips</option>
              <option value="Kerala Holidays">Kerala Holidays</option>
              <option value="Island Escapes">Island Escapes</option>
              <option value="Royal Roads">Royal Roads</option>
              <option value="NorthEast Explorers">NorthEast Explorers</option>
              <option value="Himalayan Treks">Himalayan Treks</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">Destination</label>
          <div className="relative">
            <select
              value={filters.destination}
              onChange={(e) => onChange('destination', e.target.value)}
              className="w-full appearance-none bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <option value="All Destinations">All Destinations</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Goa">Goa</option>
              <option value="Kashmir">Kashmir</option>
              <option value="Kerala">Kerala</option>
              <option value="Andaman">Andaman</option>
              <option value="Himachal">Himachal</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Assam">Assam</option>
              <option value="Uttarakhand">Uttarakhand</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Guide */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">Guide</label>
          <div className="relative">
            <select
              value={filters.guide}
              onChange={(e) => onChange('guide', e.target.value)}
              className="w-full appearance-none bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <option value="All Guides">All Guides</option>
              <option value="Rahul Das">Rahul Das</option>
              <option value="Tenzin Norbu">Tenzin Norbu</option>
              <option value="Amit Verma">Amit Verma</option>
              <option value="Irfan Ahmad">Irfan Ahmad</option>
              <option value="Sreejith Nair">Sreejith Nair</option>
              <option value="Vikram Singh">Vikram Singh</option>
              <option value="Manish Kumar">Manish Kumar</option>
              <option value="Pema Lhamu">Pema Lhamu</option>
              <option value="Ankit Rawat">Ankit Rawat</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Trip Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">Trip Type</label>
          <div className="relative">
            <select
              value={filters.tripType}
              onChange={(e) => onChange('tripType', e.target.value)}
              className="w-full appearance-none bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Group Tour">Group Tour</option>
              <option value="Private Tour">Private Tour</option>
              <option value="Trekking">Trekking</option>
              <option value="Road Trip">Road Trip</option>
              <option value="Weekend Getaway">Weekend Getaway</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Second Row of Filters: Dates, City, State, Extended Search & Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Departure Date */}
        <div className="lg:col-span-3 space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">Departure Date</label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.departureDate}
              onChange={(e) => onChange('departureDate', e.target.value)}
              placeholder="Select date range"
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs placeholder:text-slate-400 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="lg:col-span-3 space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">Return Date</label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.returnDate}
              onChange={(e) => onChange('returnDate', e.target.value)}
              placeholder="Select date range"
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs placeholder:text-slate-400 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* City */}
        <div className="lg:col-span-2 space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">City</label>
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="w-full appearance-none bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <option value="All Cities">All Cities</option>
              <option value="Cherrapunji">Cherrapunji</option>
              <option value="Leh">Leh</option>
              <option value="Panaji">Panaji</option>
              <option value="Gulmarg">Gulmarg</option>
              <option value="Alleppey">Alleppey</option>
              <option value="Havelock">Havelock</option>
              <option value="Kaza">Kaza</option>
              <option value="Udaipur">Udaipur</option>
              <option value="Kaziranga">Kaziranga</option>
              <option value="Mussoorie">Mussoorie</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* State */}
        <div className="lg:col-span-2 space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 block">State</label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) => onChange('state', e.target.value)}
              className="w-full appearance-none bg-slate-50/80 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <option value="All States">All States</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Goa">Goa</option>
              <option value="Jammu & Kashmir">Jammu & Kashmir</option>
              <option value="Kerala">Kerala</option>
              <option value="Andaman & Nicobar">Andaman & Nicobar</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Assam">Assam</option>
              <option value="Uttarakhand">Uttarakhand</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons: Reset & Apply */}
        <div className="lg:col-span-2 flex items-center gap-2 justify-end">
          <button
            onClick={onReset}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-black shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};
