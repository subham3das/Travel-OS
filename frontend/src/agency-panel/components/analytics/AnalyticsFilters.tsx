import React, { useState } from 'react';
import { X, Filter, Check } from 'lucide-react';
import { AnalyticsFilterState } from '../../hooks/useAnalytics';

interface AnalyticsFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AnalyticsFilterState;
  onApply: (filters: AnalyticsFilterState) => void;
  onClear: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onClear,
}) => {
  const [localPkg, setLocalPkg] = useState(filters.package);
  const [localDest, setLocalDest] = useState(filters.destination);
  const [localTripStatus, setLocalTripStatus] = useState(filters.tripStatus);
  const [localPaymentStatus, setLocalPaymentStatus] = useState(filters.paymentStatus);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#583BE8]" />
            <h3 className="text-base font-black text-[#0F172A]">Filter Analytics</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter 1: Package */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Package Filter
          </label>
          <select
            value={localPkg}
            onChange={(e) => setLocalPkg(e.target.value)}
            className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#583BE8]"
          >
            <option value="ALL">All Packages</option>
            <option value="Ladakh Adventure">Ladakh Adventure</option>
            <option value="Spiti Expedition">Spiti Expedition</option>
            <option value="Meghalaya Explorer">Meghalaya Explorer</option>
            <option value="Valley of Flowers">Valley of Flowers</option>
            <option value="Kedarnath Yatra">Kedarnath Yatra</option>
          </select>
        </div>

        {/* Filter 2: Destination */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Destination
          </label>
          <select
            value={localDest}
            onChange={(e) => setLocalDest(e.target.value)}
            className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#583BE8]"
          >
            <option value="ALL">All Destinations</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Spiti Valley">Spiti Valley</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Sikkim">Sikkim</option>
          </select>
        </div>

        {/* Filter 3: Trip Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Trip Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['ALL', 'Upcoming', 'Completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setLocalTripStatus(st)}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                  localTripStatus === st
                    ? 'bg-[#583BE8] text-white border-[#583BE8]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Filter 4: Payment Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Payment Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['ALL', 'Paid', 'Pending'].map((pst) => (
              <button
                key={pst}
                type="button"
                onClick={() => setLocalPaymentStatus(pst)}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                  localPaymentStatus === pst
                    ? 'bg-[#583BE8] text-white border-[#583BE8]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pst}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClear();
              setLocalPkg('ALL');
              setLocalDest('ALL');
              setLocalTripStatus('ALL');
              setLocalPaymentStatus('ALL');
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={() => {
              onApply({
                package: localPkg,
                destination: localDest,
                tripStatus: localTripStatus,
                paymentStatus: localPaymentStatus,
                bookingStatus: 'ALL',
              });
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
