import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  Hourglass,
  PauseCircle,
  XCircle,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AgencySummaryStats, AgencySummaryItem } from '../../../types/agency';

interface AgencySummaryCardsProps {
  stats: AgencySummaryStats;
  onSelectFilterStatus?: (statusKey: string) => void;
}

export const AgencySummaryCards: React.FC<AgencySummaryCardsProps> = ({
  stats,
  onSelectFilterStatus,
}) => {
  const cardsList: AgencySummaryItem[] = [
    stats.totalAgencies,
    stats.activeAgencies,
    stats.pendingApproval,
    stats.suspendedAgencies,
    stats.rejectedAgencies,
    stats.verifiedAgencies,
  ];

  const getIcon = (type: AgencySummaryItem['iconType']) => {
    switch (type) {
      case 'total':
        return <Building2 className="w-5 h-5 text-[#6356E5]" />;
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'pending':
        return <Hourglass className="w-5 h-5 text-amber-600" />;
      case 'suspended':
        return <PauseCircle className="w-5 h-5 text-rose-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'verified':
      default:
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full select-none">
      {cardsList.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.04 }}
          whileHover={{ y: -3 }}
          onClick={() => onSelectFilterStatus && onSelectFilterStatus(card.id)}
          className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-500 truncate">{card.title}</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors">
                {card.count.toLocaleString()}
              </h3>
            </div>

            <div
              className={`w-9 h-9 rounded-2xl ${card.bgColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
            >
              {getIcon(card.iconType)}
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center gap-1 text-[10px] font-extrabold border-t border-slate-50">
            <span
              className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded-md font-black ${
                card.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}
            >
              {card.isPositive ? (
                <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[3]" />
              )}
              <span>{card.growth}</span>
            </span>
            <span className="font-medium text-slate-400 truncate">{card.comparisonText}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
