import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, ShoppingBag, Wallet } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: string;
  growth: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export const CustomerStatsCard: React.FC = () => {
  const stats: StatItem[] = [
    {
      id: 'total-customers',
      label: 'Total Customers',
      value: '1,248',
      growth: '↗ 12.5%',
      icon: <Users className="w-5 h-5" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'vip-customers',
      label: 'VIP Customers',
      value: '236',
      growth: '↗ 8.3%',
      icon: <Award className="w-5 h-5" />,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'total-trips',
      label: 'Total Trips',
      value: '3,562',
      growth: '↗ 15.7%',
      icon: <ShoppingBag className="w-5 h-5" />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      id: 'total-spent',
      label: 'Total Spent',
      value: '₹4.28 Cr',
      growth: '↗ 18.4%',
      icon: <Wallet className="w-5 h-5" />,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {stats.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2 min-w-0"
        >
          <div className="flex items-center justify-between">
            <div className={`w-9 h-9 rounded-2xl ${s.iconBg} ${s.iconColor} flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <span className="text-[11px] font-black text-emerald-600">
              {s.growth}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 block truncate">
              {s.label}
            </span>
            <span className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight block truncate">
              {s.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CustomerStatsCard;
