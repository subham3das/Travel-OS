import React from 'react';
import { Landmark, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { SettlementOverview } from '../../data/finance';

interface PayoutsCardProps {
  settlement: SettlementOverview;
}

export const PayoutsCard: React.FC<PayoutsCardProps> = ({ settlement }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#583BE8]" />
          <span>Payouts</span>
        </h3>

        <button
          type="button"
          onClick={() => alert('Navigating to full settlement payouts history...')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 text-xs font-bold">
        {/* Last Settlement */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Last Settlement</span>
            <span className="text-sm sm:text-base font-black text-[#0F172A]">
              {settlement.lastSettlement.formattedAmount}
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold">{settlement.lastSettlement.date}</span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        </div>

        {/* Next Settlement */}
        <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Next Settlement</span>
            <span className="text-sm sm:text-base font-black text-[#0F172A]">
              {settlement.nextSettlement.formattedAmount}
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold">{settlement.nextSettlement.date}</span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Upcoming</span>
          </span>
        </div>

        {/* Frequency & Bank Account */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">Frequency</span>
            <span className="font-extrabold text-slate-800">{settlement.settlementFrequency}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <Landmark className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 uppercase block font-semibold">Bank</span>
              <span className="font-extrabold text-slate-800 truncate block">•••• {settlement.bankAccountLast4}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutsCard;
