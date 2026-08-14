import React from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, ChevronDown, Calendar } from 'lucide-react';
import { PaymentFilters } from '../../../types/paymentManagement';

interface PaymentFilterBarProps {
  filters: PaymentFilters;
  onChange: (key: keyof PaymentFilters, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export const PaymentFilterBar: React.FC<PaymentFilterBarProps> = ({
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
      {/* Row 1: 7 Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Payment Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Payment Status
          </label>
          <div className="relative">
            <select
              value={filters.paymentStatus}
              onChange={(e) => onChange('paymentStatus', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-7 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Settlement Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Settlement Status
          </label>
          <div className="relative">
            <select
              value={filters.settlementStatus}
              onChange={(e) => onChange('settlementStatus', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-7 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Settled">Settled</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payment Gateway */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Payment Gateway
          </label>
          <div className="relative">
            <select
              value={filters.gateway}
              onChange={(e) => onChange('gateway', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-7 cursor-pointer"
            >
              <option value="All Gateways">All Gateways</option>
              <option value="Razorpay">Razorpay</option>
              <option value="PhonePe">PhonePe</option>
              <option value="PayU">PayU</option>
              <option value="Stripe">Stripe</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Payment Method
          </label>
          <div className="relative">
            <select
              value={filters.paymentMethod}
              onChange={(e) => onChange('paymentMethod', e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-7 cursor-pointer"
            >
              <option value="All Methods">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Netbanking">Netbanking</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-7 cursor-pointer truncate"
            >
              <option value="All Agencies">All Agencies</option>
              <option value="Wanderlust Holidays">Wanderlust Holidays</option>
              <option value="Himalayan Treks">Himalayan Treks</option>
              <option value="Goa Getaways">Goa Getaways</option>
              <option value="Kerala Backwaters">Kerala Backwaters</option>
              <option value="Adventure India">Adventure India</option>
              <option value="Cityscape Holidays">Cityscape Holidays</option>
              <option value="Desert Dunes Travels">Desert Dunes Travels</option>
              <option value="Holiday Hub Agency">Holiday Hub Agency</option>
              <option value="NorthEast Explorers">NorthEast Explorers</option>
              <option value="Maldives Escape">Maldives Escape</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] pr-7 cursor-pointer"
            >
              <option value="All Destinations">All Destinations</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Spiti Valley">Spiti Valley</option>
              <option value="Goa">Goa</option>
              <option value="Kerala">Kerala</option>
              <option value="Leh Ladakh">Leh Ladakh</option>
              <option value="Singapore">Singapore</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Bali">Bali</option>
              <option value="Maldives">Maldives</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Date Range
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.dateRange}
              onChange={(e) => onChange('dateRange', e.target.value)}
              placeholder="Jun 1, 2024 - Jun 12, 2024"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-2 py-2 text-[11px] font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#6356E5]"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 2: Amount Range, Search, Reset, Apply */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="w-full sm:w-48 shrink-0">
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

        <div className="relative flex-1 w-full self-end">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search by transaction ID, booking ID, traveler, agency, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end">
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
