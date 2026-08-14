import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FinancialSummaryData } from '../../../types/financeManagement';

interface FinancialSummaryProps {
  summary: FinancialSummaryData;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const items = [
    { title: 'Gross Revenue', data: summary.grossRevenue },
    { title: 'Net Revenue', data: summary.netRevenue },
    { title: 'Total Refunds', data: summary.totalRefunds },
    { title: 'Total Discounts', data: summary.totalDiscounts },
    { title: 'Taxes Paid', data: summary.taxesPaid },
    { title: 'Gateway Charges', data: summary.gatewayCharges },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none flex flex-col justify-between h-full">
      <h3 className="text-sm font-black text-[#0F172A]">Monthly Financial Summary</h3>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/80 flex flex-col justify-between"
          >
            <span className="text-[10px] font-bold text-slate-400 truncate">
              {item.title}
            </span>
            <div className="mt-1">
              <span className="text-base font-black text-[#0F172A] block tracking-tight">
                {item.data.value}
              </span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-black ${
                    item.data.isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {item.data.isPositive ? (
                    <ArrowUpRight className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    <ArrowDownRight className="w-2.5 h-2.5 stroke-[3]" />
                  )}
                  <span>{item.data.growth}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
