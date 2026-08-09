import React from 'react';
import { FinancialMetric } from '../../data/finance';
import { TrendingUp, Wallet, Clock, RefreshCw, Percent, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface FinanceSummaryGridProps {
  summary: FinancialMetric[];
}

export const FinanceSummaryGrid: React.FC<FinanceSummaryGridProps> = ({ summary }) => {
  const getIcon = (type: FinancialMetric['type']) => {
    switch (type) {
      case 'revenue':
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        );
      case 'balance':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
        );
      case 'settlement':
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        );
      case 'refunds':
        return (
          <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20">
            <RefreshCw className="w-5 h-5" />
          </div>
        );
      case 'commission':
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
            <Percent className="w-5 h-5" />
          </div>
        );
      case 'earnings':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
            <DollarSign className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 select-none">
      {summary.map((metric) => (
        <div
          key={metric.id}
          className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs space-y-2 min-w-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2">
            {getIcon(metric.type)}
          </div>

          <div className="min-w-0 space-y-0.5 pt-1">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 block truncate">
              {metric.title}
            </span>
            <span className="text-base sm:text-xl font-black text-[#0F172A] block truncate tracking-tight">
              {metric.formattedAmount}
            </span>

            <div className="flex items-center gap-1 pt-0.5">
              {metric.isPositive ? (
                <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5 truncate">
                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                  <span className="truncate">{metric.growth}</span>
                </span>
              ) : (
                <span className="text-[10px] font-black text-rose-600 flex items-center gap-0.5 truncate">
                  <ArrowDownRight className="w-3 h-3 shrink-0" />
                  <span className="truncate">{metric.growth}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinanceSummaryGrid;
