import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Banknote,
  Receipt,
  ShieldCheck,
  XCircle,
  RotateCcw,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PaymentKPIStats } from '../../../types/paymentManagement';

interface PaymentKPISectionProps {
  stats: PaymentKPIStats;
  onFilterByStatus?: (status: string) => void;
}

export const PaymentKPISection: React.FC<PaymentKPISectionProps> = ({
  stats,
  onFilterByStatus,
}) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Transactions',
      value: stats.totalTransactions.count.toLocaleString(),
      growth: stats.totalTransactions.growth,
      isPositive: stats.totalTransactions.isPositive,
      comparison: 'from last 30 days',
      icon: <CreditCard className="w-4 h-4 text-[#6356E5]" />,
      bgColor: 'bg-purple-50',
      waveColor: 'stroke-purple-400',
      filterVal: 'All Status',
    },
    {
      id: 'today_revenue',
      title: "Today's Revenue",
      value: stats.todayRevenue.value,
      growth: stats.todayRevenue.growth,
      isPositive: stats.todayRevenue.isPositive,
      comparison: 'from yesterday',
      icon: <Banknote className="w-4 h-4 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      waveColor: 'stroke-emerald-400',
      filterVal: 'Success',
    },
    {
      id: 'pending_settlements',
      title: 'Pending Settlements',
      value: stats.pendingSettlements.value,
      growth: stats.pendingSettlements.growth,
      isPositive: stats.pendingSettlements.isPositive,
      comparison: 'from last 30 days',
      icon: <Receipt className="w-4 h-4 text-amber-600" />,
      bgColor: 'bg-amber-50',
      waveColor: 'stroke-amber-400',
      filterVal: 'Pending',
    },
    {
      id: 'successful',
      title: 'Successful Payments',
      value: stats.successfulPayments.count.toLocaleString(),
      growth: stats.successfulPayments.growth,
      isPositive: stats.successfulPayments.isPositive,
      comparison: 'from last 30 days',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      waveColor: 'stroke-emerald-400',
      filterVal: 'Success',
    },
    {
      id: 'failed',
      title: 'Failed Payments',
      value: stats.failedPayments.count.toLocaleString(),
      growth: stats.failedPayments.growth,
      isPositive: stats.failedPayments.isPositive,
      comparison: 'from last 30 days',
      icon: <XCircle className="w-4 h-4 text-rose-600" />,
      bgColor: 'bg-rose-50',
      waveColor: 'stroke-rose-400',
      filterVal: 'Failed',
    },
    {
      id: 'refunds',
      title: 'Completed Refunds',
      value: stats.completedRefunds.count.toLocaleString(),
      growth: stats.completedRefunds.growth,
      isPositive: stats.completedRefunds.isPositive,
      comparison: 'from last 30 days',
      icon: <RotateCcw className="w-4 h-4 text-[#6356E5]" />,
      bgColor: 'bg-purple-50',
      waveColor: 'stroke-purple-400',
      filterVal: 'Refunded',
    },
    {
      id: 'commission',
      title: 'Platform Commission',
      value: stats.platformCommission.value,
      growth: stats.platformCommission.growth,
      isPositive: stats.platformCommission.isPositive,
      comparison: 'from last 30 days',
      icon: <Percent className="w-4 h-4 text-[#6356E5]" />,
      bgColor: 'bg-purple-50',
      waveColor: 'stroke-purple-400',
      filterVal: 'All Status',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 w-full select-none">
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.03 }}
          whileHover={{ y: -3 }}
          onClick={() => onFilterByStatus && onFilterByStatus(card.filterVal)}
          className="bg-white rounded-2xl p-3.5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between gap-1.5">
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 truncate">{card.title}</p>
              <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors">
                {card.value}
              </h3>
            </div>

            <div
              className={`w-8 h-8 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
            >
              {card.icon}
            </div>
          </div>

          {/* Mini Wave SVG */}
          <div className="my-2 h-4 w-full opacity-70 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 20" className="w-full h-full preserve-3d" fill="none">
              <path
                d={
                  card.isPositive
                    ? 'M0 16 Q 25 18, 50 10 T 100 4'
                    : 'M0 6 Q 25 4, 50 12 T 100 16'
                }
                fill="none"
                className={card.waveColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="pt-1.5 flex items-center gap-1 text-[9px] font-extrabold border-t border-slate-50">
            <span
              className={`inline-flex items-center gap-0.5 px-1 py-0.2 rounded-md font-black ${
                card.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}
            >
              {card.isPositive ? (
                <ArrowUpRight className="w-2.5 h-2.5 stroke-[3]" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5 stroke-[3]" />
              )}
              <span>{card.growth}</span>
            </span>
            <span className="font-medium text-slate-400 truncate">{card.comparison}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
