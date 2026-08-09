import React from 'react';
import { motion } from 'framer-motion';

export interface StatItem {
  id: string;
  label: string;
  count: number | string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

interface StatCardProps {
  stat: StatItem;
  onClick?: (stat: StatItem) => void;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick && onClick(stat)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group flex-1 min-w-[130px]"
    >
      <div
        className={`w-11 h-11 rounded-2xl ${stat.bgColor} ${stat.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
      >
        {stat.icon}
      </div>

      <div>
        <h4 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight leading-none">
          {stat.count}
        </h4>
        <p className="text-xs font-semibold text-slate-400 mt-1 leading-none">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
};
