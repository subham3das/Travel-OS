import React from 'react';
import { motion } from 'framer-motion';
import { Building2, UserCheck, PackageCheck, Star, CreditCard } from 'lucide-react';
import { Activity } from '../../types/dashboard';

interface RecentActivityCardProps {
  activities: Activity[];
  onViewAll?: () => void;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  onViewAll,
}) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'agency':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'booking':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'confirmation':
        return <PackageCheck className="w-4 h-4 text-purple-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />;
      case 'payment':
      default:
        return <CreditCard className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">Recent Activities</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Timeline Items */}
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 group cursor-pointer">
            <div
              className={`w-9 h-9 rounded-2xl ${item.bgColor} flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform`}
            >
              {getIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-[#0F172A] truncate leading-tight group-hover:text-[#6356E5] transition-colors">
                {item.title}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 leading-tight mt-0.5">
                {item.subtitle}
              </p>
            </div>

            <span className="text-[10px] font-bold text-slate-400 shrink-0 whitespace-nowrap pt-0.5">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
