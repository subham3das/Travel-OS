import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Check, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { CarRentalFilters } from '../../../types/carRentalApproval';

interface CarRentalApprovalFilterPanelProps {
  filters: CarRentalFilters;
  onChange: (key: keyof CarRentalFilters, value: any) => void;
  onReset: () => void;
  onApply: () => void;
}

const INDIAN_STATES = [
  'All States',
  'Maharashtra',
  'Delhi',
  'Goa',
  'Karnataka',
  'Rajasthan',
  'Tamil Nadu',
  'Kerala',
  'Gujarat',
  'Uttar Pradesh',
  'West Bengal',
  'Himachal Pradesh',
  'Uttarakhand',
  'Punjab',
];

const STATUS_OPTIONS = [
  'All Status',
  'PENDING',
  'UNDER_REVIEW',
  'CHANGES_REQUESTED',
  'APPROVED',
  'REJECTED',
  'SUSPENDED',
];

export const CarRentalApprovalFilterPanel: React.FC<CarRentalApprovalFilterPanelProps> = ({
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
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#0F172A] tracking-tight uppercase">
              Advanced Filter Matrix
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              Refine commercial fleet applications
            </span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* State Filter */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Operating State</span>
            </label>
            <select
              value={filters.state}
              onChange={(e) => onChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all cursor-pointer"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Operating City / Hub</span>
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="e.g. Mumbai, Goa, Bengaluru"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
            />
          </div>

          {/* Specific Status Override */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Verification Status</span>
            </label>
            <select
              value={filters.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Registered Date Range</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onChange('dateFrom', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] focus:bg-white"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onChange('dateTo', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold bg-[#6356E5] hover:bg-[#5244e0] text-white shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
