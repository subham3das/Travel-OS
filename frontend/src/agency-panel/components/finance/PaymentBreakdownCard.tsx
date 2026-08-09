import React from 'react';
import { PieChart } from 'lucide-react';
import { PaymentStatusBreakdown } from '../../data/finance';

interface PaymentBreakdownCardProps {
  breakdown: PaymentStatusBreakdown[];
}

export const PaymentBreakdownCard: React.FC<PaymentBreakdownCardProps> = ({ breakdown }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
        <PieChart className="w-4 h-4 text-[#583BE8]" />
        <span>Payment Breakdown</span>
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut Ring */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Donut Segments */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="16" strokeDasharray="155 238" strokeDashoffset="0" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="47 238" strokeDashoffset="-155" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="16" strokeDasharray="12 238" strokeDashoffset="-202" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="16" strokeDasharray="24 238" strokeDashoffset="-214" />
          </svg>
        </div>

        {/* Legend & Amounts List */}
        <div className="flex-1 w-full space-y-2.5 text-xs font-bold">
          {breakdown.map((item) => (
            <div key={item.status} className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.status}</span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[#0F172A] font-black mr-2">{item.percentage}%</span>
                <span className="text-slate-400 font-semibold text-[11px]">{item.formattedAmount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdownCard;
