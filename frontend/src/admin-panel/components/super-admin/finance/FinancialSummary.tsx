import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  RotateCcw,
  Tag,
  Receipt,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from 'lucide-react';
import { FinancialSummaryData } from '../../../types/financeManagement';

interface FinancialSummaryProps {
  summary: FinancialSummaryData;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const summaryCards = [
    {
      title: 'Gross Revenue',
      amount: summary.grossRevenue.value,
      change: summary.grossRevenue.growth,
      isPositive: summary.grossRevenue.isPositive,
      icon: DollarSign,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Net Revenue',
      amount: summary.netRevenue.value,
      change: summary.netRevenue.growth,
      isPositive: summary.netRevenue.isPositive,
      icon: TrendingUp,
      iconBg: 'bg-purple-50 text-[#6356E5]',
    },
    {
      title: 'Total Refunds',
      amount: summary.totalRefunds.value,
      change: summary.totalRefunds.growth,
      isPositive: summary.totalRefunds.isPositive,
      icon: RotateCcw,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Total Discounts',
      amount: summary.totalDiscounts.value,
      change: summary.totalDiscounts.growth,
      isPositive: summary.totalDiscounts.isPositive,
      icon: Tag,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Taxes Paid (GST)',
      amount: summary.taxesPaid.value,
      change: summary.taxesPaid.growth,
      isPositive: summary.taxesPaid.isPositive,
      icon: Receipt,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Gateway Charges',
      amount: summary.gatewayCharges.value,
      change: summary.gatewayCharges.growth,
      isPositive: summary.gatewayCharges.isPositive,
      icon: CreditCard,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-[#0F172A]">Monthly Financial Summary</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
              June 2024
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Key operational cost and revenue streams
          </p>
        </div>

        <button className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of 6 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg} shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-[10px] font-black ${
                    card.isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {card.title}
              </span>
              <span className="text-sm font-black text-[#0F172A] font-mono tracking-tight block mt-0.5 group-hover:text-[#6356E5] transition-colors">
                {card.amount}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <span>Updated automatically on daily reconciliation</span>
        <span className="font-mono text-emerald-600 font-bold">● Healthy Liquidity</span>
      </div>
    </div>
  );
};
