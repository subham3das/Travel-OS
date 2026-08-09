import React from 'react';
import { ShoppingBag, Users, Clock, XCircle } from 'lucide-react';

interface BookingSummaryCardsProps {
  summary: {
    total: number;
    confirmed: number;
    confirmedPct: string;
    pending: number;
    pendingPct: string;
    cancelled: number;
    cancelledPct: string;
  };
}

export const BookingSummaryCards: React.FC<BookingSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 select-none">
      {/* 1. Total Bookings */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100/90 shadow-2xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 truncate">Total Bookings</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-[#0F172A]">{summary.total}</span>
            <span className="text-[9px] font-bold text-slate-400">All time</span>
          </div>
        </div>
      </div>

      {/* 2. Confirmed */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100/90 shadow-2xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 truncate">Confirmed</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-[#0F172A]">{summary.confirmed}</span>
            <span className="text-[9px] font-bold text-emerald-600">{summary.confirmedPct}</span>
          </div>
        </div>
      </div>

      {/* 3. Pending */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100/90 shadow-2xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 truncate">Pending</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-[#0F172A]">{summary.pending}</span>
            <span className="text-[9px] font-bold text-amber-600">{summary.pendingPct}</span>
          </div>
        </div>
      </div>

      {/* 4. Cancelled */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100/90 shadow-2xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <XCircle className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 truncate">Cancelled</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-[#0F172A]">{summary.cancelled}</span>
            <span className="text-[9px] font-bold text-rose-600">{summary.cancelledPct}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCards;
