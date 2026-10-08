import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Car, Zap } from 'lucide-react';
import { CarRentalStats } from '../../../types/carRentalApproval';

interface CarRentalApprovalStatsCardsProps {
  stats: CarRentalStats | null;
  onFilterByTab?: (tab: 'Pending' | 'Approved' | 'Rejected' | 'Needs Changes') => void;
}

export const CarRentalApprovalStatsCards: React.FC<CarRentalApprovalStatsCardsProps> = ({
  stats,
  onFilterByTab,
}) => {
  const cards = [
    {
      id: 'pending',
      tab: 'Pending' as const,
      label: 'Pending Requests',
      value: stats?.pendingRequests?.count ?? 0,
      growth: stats?.pendingRequests?.growth ?? '+0%',
      isPositive: stats?.pendingRequests?.isPositive ?? true,
      icon: Clock,
      color: 'amber',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100/70',
      activeRing: 'hover:ring-2 hover:ring-amber-400/40',
    },
    {
      id: 'approved',
      tab: 'Approved' as const,
      label: 'Approved Today',
      value: stats?.approvedToday?.count ?? 0,
      growth: stats?.approvedToday?.growth ?? '+100%',
      isPositive: true,
      icon: CheckCircle2,
      color: 'emerald',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100/70',
      activeRing: 'hover:ring-2 hover:ring-emerald-400/40',
    },
    {
      id: 'rejected',
      tab: 'Rejected' as const,
      label: 'Rejected Total',
      value: stats?.rejectedToday?.count ?? 0,
      growth: stats?.rejectedToday?.growth ?? '0%',
      isPositive: false,
      icon: XCircle,
      color: 'rose',
      bgLight: 'bg-rose-50',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-100/70',
      activeRing: 'hover:ring-2 hover:ring-rose-400/40',
    },
    {
      id: 'needsChanges',
      tab: 'Needs Changes' as const,
      label: 'Needs Changes',
      value: stats?.needsChanges?.count ?? 0,
      growth: stats?.needsChanges?.growth ?? '+0%',
      isPositive: true,
      icon: AlertTriangle,
      color: 'violet',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-100/70',
      activeRing: 'hover:ring-2 hover:ring-violet-400/40',
    },
    {
      id: 'totalVehicles',
      label: 'Total Fleet Vehicles',
      value: stats?.totalVehicles?.count ?? 0,
      growth: stats?.totalVehicles?.growth ?? '+0%',
      isPositive: true,
      icon: Car,
      color: 'indigo',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-100/70',
      activeRing: 'hover:ring-2 hover:ring-indigo-400/40',
    },
    {
      id: 'avgTime',
      label: 'Avg Approval Time',
      value: stats?.avgApprovalTime?.value ?? '1h 45m',
      growth: stats?.avgApprovalTime?.growth ?? '+0%',
      isPositive: true,
      icon: Zap,
      color: 'sky',
      bgLight: 'bg-sky-50',
      textColor: 'text-sky-600',
      borderColor: 'border-sky-100/70',
      activeRing: 'hover:ring-2 hover:ring-sky-400/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        const isClickable = Boolean(card.tab && onFilterByTab);

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            onClick={() => {
              if (card.tab && onFilterByTab) {
                onFilterByTab(card.tab);
              }
            }}
            className={`bg-white p-4 rounded-2xl border ${card.borderColor} shadow-xs transition-all ${
              isClickable ? `cursor-pointer ${card.activeRing}` : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className={`w-9 h-9 rounded-xl ${card.bgLight} ${card.textColor} flex items-center justify-center shrink-0`}>
                <IconComponent className="w-4.5 h-4.5" />
              </div>
              <span className={`text-[11px] font-bold ${card.isPositive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {card.growth}
              </span>
            </div>
            <div>
              <div className="text-xl font-black text-[#0F172A] tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] font-bold text-slate-400 mt-0.5 truncate">
                {card.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
