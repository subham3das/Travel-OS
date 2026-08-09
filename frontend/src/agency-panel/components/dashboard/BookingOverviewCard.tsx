import React from 'react';
import { BookingOverviewData } from '../../data/dashboardInsights';

interface BookingOverviewCardProps {
  data: BookingOverviewData;
  selectedRange: string;
  onRangeChange: (range: any) => void;
}

export const BookingOverviewCard: React.FC<BookingOverviewCardProps> = ({
  data,
  selectedRange,
  onRangeChange,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header with Title & Dropdown */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-slate-500">
          Bookings Overview
        </span>

        <select
          value={selectedRange}
          onChange={(e) => onRangeChange(e.target.value)}
          className="appearance-none bg-slate-50 border border-slate-200/80 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-xl focus:outline-none shadow-2xs cursor-pointer"
        >
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
          <option value="Today">Today</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      {/* Breakdown Items List */}
      <div className="space-y-3.5 pt-1">
        {/* Confirmed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Confirmed</span>
          </div>
          <span className="text-sm font-black text-[#0F172A]">{data.confirmed}</span>
        </div>

        {/* Pending */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Pending</span>
          </div>
          <span className="text-sm font-black text-[#0F172A]">{data.pending}</span>
        </div>

        {/* Cancelled */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Cancelled</span>
          </div>
          <span className="text-sm font-black text-[#0F172A]">{data.cancelled}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-700">Total</span>
          <span className="text-base font-black text-[#583BE8]">{data.total}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingOverviewCard;
