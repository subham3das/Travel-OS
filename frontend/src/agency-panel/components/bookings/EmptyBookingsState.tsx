import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface EmptyBookingsStateProps {
  onResetSearch?: () => void;
}

export const EmptyBookingsState: React.FC<EmptyBookingsStateProps> = ({ onResetSearch }) => {
  return (
    <div className="py-16 text-center bg-white rounded-3xl border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto shadow-2xs">
        <ShoppingBag className="w-8 h-8" />
      </div>

      <div className="space-y-1.5 max-w-xs mx-auto">
        <h4 className="text-base font-extrabold text-[#0F172A]">No Bookings Found</h4>
        <p className="text-xs font-semibold text-slate-400 leading-relaxed">
          Bookings will appear here once travelers reserve your travel packages.
        </p>
      </div>

      {onResetSearch && (
        <button
          type="button"
          onClick={onResetSearch}
          className="px-5 py-2.5 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          Clear Search & Filters
        </button>
      )}
    </div>
  );
};

export default EmptyBookingsState;
