import React from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, ChevronDown, Calendar } from 'lucide-react';
import { BookingFilters } from '../../../types/bookingManagement';

interface BookingFilterPanelProps {
  filters: BookingFilters;
  onChange: (key: keyof BookingFilters, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export const BookingFilterPanel: React.FC<BookingFilterPanelProps> = ({
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
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3.5 select-none"
    >
      {/* Row 1: 5 Filters (Booking Status, Payment Status, Package, Agency, Travel Date) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Booking Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Booking Status
          </label>
          <div className="relative">
            <select
              value={filters.bookingStatus}
              onChange={(e) => onChange('bookingStatus', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Payment Status
          </label>
          <div className="relative">
            <select
              value={filters.paymentStatus}
              onChange={(e) => onChange('paymentStatus', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Payment Status">All Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Package */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Package
          </label>
          <div className="relative">
            <select
              value={filters.package}
              onChange={(e) => onChange('package', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer truncate"
            >
              <option value="All Packages">All Packages</option>
              <option value="Swiss Alps Explorer">Swiss Alps Explorer</option>
              <option value="Bali Paradise">Bali Paradise</option>
              <option value="Rajasthan Royal Tour">Rajasthan Royal Tour</option>
              <option value="Maldives Escape">Maldives Escape</option>
              <option value="Manali Adventure">Manali Adventure</option>
              <option value="Dubai Luxury Tour">Dubai Luxury Tour</option>
              <option value="Kerala Backwaters">Kerala Backwaters</option>
              <option value="Bali Volcano Trek">Bali Volcano Trek</option>
              <option value="Leh Ladakh Road Trip">Leh Ladakh Road Trip</option>
              <option value="Singapore Getaway">Singapore Getaway</option>
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
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer truncate"
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
              <option value="Ladakh Diaries">Ladakh Diaries</option>
              <option value="Global Holidays">Global Holidays</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Travel Date */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Travel Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.travelDate}
              onChange={(e) => onChange('travelDate', e.target.value)}
              placeholder="Select Date Range"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#6356E5]"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 2: Destination, Booking Date, User Input, Amount Range, Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 items-end">
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
              <option value="Singapore">Singapore</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Booking Date */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Booking Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.bookingDate}
              onChange={(e) => onChange('bookingDate', e.target.value)}
              placeholder="Select Date Range"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#6356E5]"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* User Search Input */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            User
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.user}
              onChange={(e) => onChange('user', e.target.value)}
              placeholder="Search by user name, email or user ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#6356E5]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Amount Range
          </label>
          <div className="relative">
            <select
              value={filters.amountRange}
              onChange={(e) => onChange('amountRange', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
            >
              <option value="All Amounts">All Amounts</option>
              <option value="Under ₹25,000">Under ₹25,000</option>
              <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
              <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
              <option value="Above ₹1,00,000">Above ₹1,00,000</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Reset & Apply Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={onApply}
            className="flex-1 py-2 px-3 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/20 transition-colors cursor-pointer text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};
