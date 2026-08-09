import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Users, AlertTriangle, ShieldAlert } from 'lucide-react';
import { LiveStats } from '../../data/tripTimeline';

interface LiveStatsCardProps {
  stats: LiveStats;
}

export const LiveStatsCard: React.FC<LiveStatsCardProps> = ({ stats }) => {
  const items = [
    {
      label: 'Current Day',
      value: `Day ${stats.currentDay} / ${stats.totalDays}`,
      subtext: `Day ${stats.currentDay} in action`,
      icon: <Calendar className="w-4 h-4 text-[#583BE8]" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      textColor: 'text-[#583BE8]',
    },
    {
      label: 'Completed Days',
      value: `${stats.completedDays} Days`,
      subtext: `${stats.remainingDays} days remaining`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Present Travelers',
      value: `${stats.presentTravelersCount} / ${stats.totalTravelersCount}`,
      subtext: '100% attendance',
      icon: <Users className="w-4 h-4 text-sky-600" />,
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
      textColor: 'text-sky-700',
    },
    {
      label: 'Open Incidents',
      value: stats.openIncidentsCount > 0 ? `${stats.openIncidentsCount} Open` : '0 Active',
      subtext: stats.openIncidentsCount > 0 ? 'Requires attention' : 'All clear',
      icon: <ShieldAlert className={`w-4 h-4 ${stats.openIncidentsCount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />,
      bgColor: stats.openIncidentsCount > 0 ? 'bg-rose-50' : 'bg-slate-50',
      borderColor: stats.openIncidentsCount > 0 ? 'border-rose-100' : 'border-slate-100',
      textColor: stats.openIncidentsCount > 0 ? 'text-rose-700' : 'text-slate-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 select-none"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          Live Operations Overview
        </h3>
        <span className="text-[11px] font-extrabold text-slate-400">Real-time status</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-3.5 rounded-2xl border ${item.bgColor} ${item.borderColor} space-y-1.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                {item.label}
              </span>
              {item.icon}
            </div>
            <p className={`text-base sm:text-lg font-black ${item.textColor}`}>{item.value}</p>
            <p className="text-[10px] font-semibold text-slate-400 truncate">{item.subtext}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LiveStatsCard;
