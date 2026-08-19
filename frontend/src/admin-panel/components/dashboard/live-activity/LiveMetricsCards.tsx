import React from 'react';
import { Users, Building2, CalendarCheck, Compass, CreditCard, Headphones, Zap } from 'lucide-react';
import { LiveMetricsData } from '../../../types/liveActivityCenter';

interface LiveMetricsCardsProps {
  metrics: LiveMetricsData;
}

export const LiveMetricsCards: React.FC<LiveMetricsCardsProps> = ({ metrics }) => {
  const metricList = [
    {
      label: 'Online Users',
      value: metrics.onlineUsers.toLocaleString(),
      icon: <Users className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/60',
      badge: 'Live',
    },
    {
      label: 'Live Agencies',
      value: metrics.liveAgencies.toLocaleString(),
      icon: <Building2 className="w-4 h-4 text-[#6356E5]" />,
      bg: 'bg-purple-50/60',
      badge: 'Active',
    },
    {
      label: 'Bookings Today',
      value: metrics.bookingsToday.toLocaleString(),
      icon: <CalendarCheck className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-50/60',
      badge: 'Today',
    },
    {
      label: 'Trips Running',
      value: metrics.tripsRunning.toLocaleString(),
      icon: <Compass className="w-4 h-4 text-indigo-600" />,
      bg: 'bg-indigo-50/60',
      badge: 'En-route',
    },
    {
      label: 'Payments Processing',
      value: metrics.paymentsProcessing.toLocaleString(),
      icon: <CreditCard className="w-4 h-4 text-amber-600" />,
      bg: 'bg-amber-50/60',
      badge: 'Gateway',
    },
    {
      label: 'Support Queue',
      value: metrics.supportQueue.toLocaleString(),
      icon: <Headphones className="w-4 h-4 text-rose-500" />,
      bg: 'bg-rose-50/60',
      badge: 'Open',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none flex flex-col h-full">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-black text-[#0F172A]">Live Metrics</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Telemetry Stream</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 flex-1">
        {metricList.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl ${m.bg} border border-slate-100/80 flex flex-col justify-between space-y-2 hover:shadow-2xs transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-2xs">
                {m.icon}
              </div>
              <span className="px-1.5 py-0.2 rounded-md bg-white/80 text-[8px] font-black text-slate-600 border border-slate-200/60">
                {m.badge}
              </span>
            </div>

            <div>
              <span className="text-lg font-black text-[#0F172A] tracking-tight block">
                {m.value}
              </span>
              <span className="text-[10px] text-slate-500 font-bold block truncate">
                {m.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
