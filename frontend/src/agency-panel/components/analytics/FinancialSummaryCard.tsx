import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Wallet, Clock, ArrowRight } from 'lucide-react';
import { FinancialSummaryData } from '../../data/analytics';

interface FinancialSummaryCardProps {
  data: FinancialSummaryData;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-black text-[#0F172A]">
          Financial Overview
        </span>

        <button
          type="button"
          onClick={() => navigate('/agency/finance')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>View Full Finance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Revenue */}
        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-purple-700 block flex items-center gap-1">
            <IndianRupee className="w-3 h-3 text-[#583BE8]" />
            <span>Revenue</span>
          </span>
          <span className="text-base sm:text-lg font-black text-[#0F172A] block truncate">
            {data.grossRevenue || '₹12,45,800'}
          </span>
          <span className="text-[10px] font-bold text-emerald-600">↑ 18.6% vs Apr</span>
        </div>

        {/* Net Earnings */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-emerald-800 block flex items-center gap-1">
            <Wallet className="w-3 h-3 text-emerald-600" />
            <span>Net Earnings</span>
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-700 block truncate">
            {data.netRevenue || '₹8,74,670'}
          </span>
          <span className="text-[10px] font-bold text-emerald-600">↑ 16.2% vs Apr</span>
        </div>

        {/* Pending Settlement */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-amber-800 block flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Settlement</span>
          </span>
          <span className="text-base sm:text-lg font-black text-amber-800 block truncate">
            ₹2,15,600
          </span>
          <span className="text-[10px] font-bold text-amber-700">Upcoming 04 Jun</span>
        </div>
      </div>

      {/* View Full Finance CTA Button */}
      <button
        type="button"
        onClick={() => navigate('/agency/finance')}
        className="w-full py-3 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
      >
        <span>View Full Finance Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FinancialSummaryCard;
