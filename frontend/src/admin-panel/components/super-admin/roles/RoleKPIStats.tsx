import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Sliders,
  Laptop,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { RoleKPIStats, RoleKPICardItem } from '../../../types/rolesManagement';

interface RoleKPIStatsProps {
  stats: RoleKPIStats;
  onCardClick?: (id: string) => void;
}

export const RoleKPIStatsCards: React.FC<RoleKPIStatsProps> = ({
  stats,
  onCardClick,
}) => {
  const getCardIcon = (type: RoleKPICardItem['iconType']) => {
    switch (type) {
      case 'roles':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-[#6356E5]" />,
          bg: 'bg-purple-50',
          strokeColor: '#6356E5',
        };
      case 'admins':
        return {
          icon: <Users className="w-4 h-4 text-blue-600" />,
          bg: 'bg-blue-50',
          strokeColor: '#3B82F6',
        };
      case 'invitations':
        return {
          icon: <UserPlus className="w-4 h-4 text-orange-600" />,
          bg: 'bg-orange-50',
          strokeColor: '#F97316',
        };
      case 'custom':
        return {
          icon: <Sliders className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-50',
          strokeColor: '#10B981',
        };
      case 'sessions':
        return {
          icon: <Laptop className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50',
          strokeColor: '#8B5CF6',
        };
      case 'critical':
      default:
        return {
          icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
          bg: 'bg-rose-50',
          strokeColor: '#EF4444',
        };
    }
  };

  const cardsList: RoleKPICardItem[] = [
    stats.totalRoles,
    stats.activeAdmins,
    stats.pendingInvitations,
    stats.customRoles,
    stats.activeSessions,
    stats.highPrivilegeAccounts,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full select-none">
      {cardsList.map((card, idx) => {
        const { icon, bg, strokeColor } = getCardIcon(card.iconType);

        return (
          <motion.div
            key={card.id || idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            whileHover={{ y: -2 }}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between group"
          >
            {/* Top row: Title + Icon */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 truncate">{card.title}</p>
                <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors truncate">
                  {card.value}
                </h3>
              </div>

              <div
                className={`w-8 h-8 rounded-2xl ${bg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                {icon}
              </div>
            </div>

            {/* Mini Sparkline Curve */}
            <div className="my-2.5 h-3.5 w-full opacity-75 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 20" className="w-full h-full" fill="none">
                <path
                  d={
                    card.isPositive
                      ? 'M0 16 Q 25 18, 50 10 T 100 4'
                      : 'M0 6 Q 25 4, 50 12 T 100 16'
                  }
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Bottom row: Growth Tag + Comparison */}
            <div className="pt-1.5 flex items-center gap-1.5 text-[10px] font-extrabold border-t border-slate-50">
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
