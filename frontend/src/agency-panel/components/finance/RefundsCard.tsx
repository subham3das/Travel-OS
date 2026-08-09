import React from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { CompleteFinanceData } from '../../data/finance';

interface RefundsCardProps {
  refundSummary: CompleteFinanceData['refundSummary'];
}

export const RefundsCard: React.FC<RefundsCardProps> = ({ refundSummary }) => {
  const req = refundSummary.recentRequest;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-rose-500" />
          <span>Refunds</span>
        </h3>

        <button
          type="button"
          onClick={() => alert('Navigating to full refund requests manager...')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Status Badges */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-black">
        <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 space-y-0.5">
          <span className="text-lg block leading-none">{refundSummary.approvedCount}</span>
          <span className="text-[10px] font-bold block text-emerald-700">Approved</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 space-y-0.5">
          <span className="text-lg block leading-none">{refundSummary.pendingCount}</span>
          <span className="text-[10px] font-bold block text-amber-700">Pending</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 space-y-0.5">
          <span className="text-lg block leading-none">{refundSummary.rejectedCount}</span>
          <span className="text-[10px] font-bold block text-rose-700">Rejected</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 space-y-0.5">
          <span className="text-lg block leading-none">{refundSummary.totalCount}</span>
          <span className="text-[10px] font-bold block text-blue-700">Total</span>
        </div>
      </div>

      {/* Recent Refund Item */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold text-slate-400 block truncate">{req.bookingId}</span>
            <h4 className="text-xs font-black text-[#0F172A] truncate">{req.packageName}</h4>
            <p className="text-[11px] font-semibold text-slate-500 truncate">{req.travelerName}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-black text-rose-600 block">{req.formattedAmount}</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block">
              {req.status}
            </span>
          </div>
        </div>

        <div className="text-[11px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="italic truncate">Reason: {req.reason}</span>
          <span className="text-[10px] text-slate-400 font-bold shrink-0">Requested: {req.requestDate}</span>
        </div>
      </div>
    </div>
  );
};

export default RefundsCard;
