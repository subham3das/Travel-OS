import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShoppingBag, Send, Users, Star, ArrowUpRight } from 'lucide-react';
import { KPIStatItem } from '../../data/analytics';

interface PerformanceOverviewProps {
  kpis: KPIStatItem[];
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ kpis }) => {
  return (
    <div className="space-y-3 select-none">
      <h3 className="text-sm font-black text-[#0F172A] px-1">Performance Overview</h3>

      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        {kpis.map((kpi, idx) => {
          let icon = <IndianRupee className="w-5 h-5" />;
          let iconBg = 'bg-purple-100 text-[#583BE8]';

          if (kpi.type === 'bookings') {
            icon = <ShoppingBag className="w-5 h-5" />;
            iconBg = 'bg-sky-100 text-sky-600';
          } else if (kpi.type === 'trips') {
            icon = <Send className="w-5 h-5" />;
            iconBg = 'bg-emerald-100 text-emerald-600';
          } else if (kpi.type === 'travelers') {
            icon = <Users className="w-5 h-5" />;
            iconBg = 'bg-amber-100 text-amber-600';
          } else if (kpi.type === 'rating') {
            icon = <Star className="w-5 h-5 fill-[#583BE8]" />;
            iconBg = 'bg-purple-100 text-[#583BE8]';
          }

          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-w-[160px] flex-1 space-y-2 flex flex-col justify-between"
            >
              <div className={`w-9 h-9 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
                {icon}
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-500 block truncate">
                  {kpi.label}
                </span>
                <h4 className="text-xl font-black text-[#0F172A] tracking-tight">
                  {kpi.value}
                </h4>
              </div>

              <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span>{kpi.growth}</span>
                <span className="text-slate-400 font-medium ml-0.5">{kpi.growthPeriod}</span>
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceOverview;
