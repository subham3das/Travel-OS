import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  Building2,
  Users,
  CalendarCheck,
  Plane,
  Hourglass,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { StatItem } from '../../types/dashboard';

interface StatCardProps {
  stat: StatItem;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, delay = 0 }) => {
  const getIcon = () => {
    switch (stat.iconName) {
      case 'revenue':
        return <Briefcase className="w-5 h-5" />;
      case 'gmv':
        return <TrendingUp className="w-5 h-5" />;
      case 'agency':
        return <Building2 className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'bookings':
        return <CalendarCheck className="w-5 h-5" />;
      case 'trips':
        return <Plane className="w-5 h-5" />;
      case 'approvals':
        return <Hourglass className="w-5 h-5" />;
      case 'tickets':
      default:
        return <Ticket className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-bold text-slate-500 truncate">{stat.title}</p>
          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors">
            {stat.value}
          </h3>
        </div>

        <div
          className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stat.bgGradient} ${stat.iconColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
        >
          {getIcon()}
        </div>
      </div>

      <div className="mt-3 pt-2 flex items-center gap-1.5 text-xs font-extrabold border-t border-slate-50">
        <span
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-black ${
            stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {stat.isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />
          )}
          <span>{stat.growth}</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400 truncate">
          {stat.comparisonText}
        </span>
      </div>
    </motion.div>
  );
};
