import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Banknote,
  TrendingUp,
  Lock,
  CheckCircle2,
  RotateCcw,
  Building2,
  BadgePercent,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { FinanceKPIStats, FinanceKPICardItem } from '../../../types/financeManagement';

interface FinanceStatsProps {
  stats: FinanceKPIStats;
  onCardClick?: (id: string) => void;
}

export const FinanceStats: React.FC<FinanceStatsProps> = ({ stats, onCardClick }) => {
  const getCardIcon = (type: FinanceKPICardItem['iconType']) => {
    switch (type) {
      case 'gmv':
        return { icon: <CreditCard className="w-4 h-4 text-[#6356E5]" />, bg: 'bg-purple-50', wave: 'stroke-purple-400' };
      case 'revenue':
        return { icon: <Banknote className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50', wave: 'stroke-emerald-400' };
      case 'profit':
        return { icon: <TrendingUp className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50', wave: 'stroke-blue-400' };
      case 'payouts':
        return { icon: <Lock className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50', wave: 'stroke-amber-400' };
      case 'settlements':
        return { icon: <CheckCircle2 className="w-4 h-4 text-[#6356E5]" />, bg: 'bg-purple-50', wave: 'stroke-purple-400' };
      case 'refund':
        return { icon: <RotateCcw className="w-4 h-4 text-rose-600" />, bg: 'bg-rose-50', wave: 'stroke-rose-400' };
      case 'taxes':
        return { icon: <Building2 className="w-4 h-4 text-teal-600" />, bg: 'bg-teal-50', wave: 'stroke-teal-400' };
      case 'earnings':
      default:
        return { icon: <BadgePercent className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50', wave: 'stroke-emerald-400' };
    }
  };

  const cardsList: FinanceKPICardItem[] = [
    stats.gmv,
    stats.revenue,
    stats.profit,
    stats.pendingPayouts,
    stats.completedSettlements,
    stats.refundAmount,
    stats.taxesCollected,
    stats.netEarnings,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 w-full select-none">
      {cardsList.map((card, idx) => {
        const { icon, bg, wave } = getCardIcon(card.iconType);

        return (
          <motion.div
            key={card.id || idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.02 }}
            whileHover={{ y: -3 }}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="bg-white rounded-2xl p-3.5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between gap-1.5">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 truncate">{card.title}</p>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors">
                  {card.value}
                </h3>
              </div>

              <div
                className={`w-7 h-7 rounded-xl ${bg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                {icon}
              </div>
            </div>

            {/* Mini Wave SVG */}
            <div className="my-2 h-3.5 w-full opacity-70 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 20" className="w-full h-full preserve-3d" fill="none">
                <path
                  d={
                    card.isPositive
                      ? 'M0 16 Q 25 18, 50 10 T 100 4'
                      : 'M0 6 Q 25 4, 50 12 T 100 16'
                  }
                  fill="none"
                  className={wave}
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
        );
      })}
    </div>
  );
};
