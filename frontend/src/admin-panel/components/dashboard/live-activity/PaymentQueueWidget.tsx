import React from 'react';
import { CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentQueueItem } from '../../../types/liveActivityCenter';

interface PaymentQueueWidgetProps {
  queue: PaymentQueueItem[];
}

export const PaymentQueueWidget: React.FC<PaymentQueueWidgetProps> = ({ queue }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: PaymentQueueItem['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-black">
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-black animate-pulse">
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-black">
            Pending
          </span>
        );
      case 'Failed':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-black">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col justify-between">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black text-[#0F172A]">Payment Queue</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/payments')}
          className="text-[10px] font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {queue.map((pay) => (
          <div
            key={pay.id}
            onClick={() => navigate(pay.targetRoute)}
            className="p-2.5 rounded-2xl bg-slate-50/70 hover:bg-purple-50/70 border border-slate-100 transition-all cursor-pointer flex items-center justify-between gap-2"
          >
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-700">{pay.id}</span>
                <span className="text-[10px] font-bold text-slate-400">({pay.bookingId})</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">{pay.method}</p>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs font-black text-[#0F172A] font-mono">{pay.amount}</span>
              <div className="flex items-center gap-1">
                {getStatusBadge(pay.status)}
                <span className="text-[9px] text-slate-400 font-semibold">{pay.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
