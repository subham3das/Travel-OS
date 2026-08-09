import React from 'react';
import { BookingStatusBreakdown } from '../../data/analytics';

interface BookingAnalyticsCardProps {
  data: BookingStatusBreakdown;
}

export const BookingAnalyticsCard: React.FC<BookingAnalyticsCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Booking Overview
        </span>
      </div>

      {/* SVG Donut Chart & Legend Grid */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        {/* Donut Circle */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Confirmed 61.9% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="0" />
            {/* Pending 22.0% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="147.7" />
            {/* Cancelled 11.9% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="200.2" />
            {/* Refunded 4.2% */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#94A3B8" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="228.6" />
          </svg>

          <div className="absolute text-center">
            <span className="text-sm font-black text-[#0F172A] block leading-tight">
              {data.total}
            </span>
            <span className="text-[9px] font-extrabold text-slate-400 block">Total</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2 w-full text-xs font-bold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-600">Confirmed</span>
            </div>
            <span className="text-[#0F172A] font-black">{data.confirmed} ({data.confirmedPct}%)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-600">Pending</span>
            </div>
            <span className="text-[#0F172A] font-black">{data.pending} ({data.pendingPct}%)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="text-slate-600">Cancelled</span>
            </div>
            <span className="text-[#0F172A] font-black">{data.cancelled} ({data.cancelledPct}%)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
              <span className="text-slate-600">Refunded</span>
            </div>
            <span className="text-[#0F172A] font-black">{data.refunded} ({data.refundedPct}%)</span>
          </div>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block">Cancellation Rate</span>
          <span className="text-xs font-black text-rose-600">{data.cancellationRate}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block">Refund Rate</span>
          <span className="text-xs font-black text-slate-700">{data.refundRate}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingAnalyticsCard;
