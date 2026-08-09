import React from 'react';
import { Users, CheckCircle2, Clock, CreditCard } from 'lucide-react';

interface QuickStatsProps {
  total: number;
  checkedIn: number;
  pendingCheckIn: number;
  paymentPending: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  total,
  checkedIn,
  pendingCheckIn,
  paymentPending,
}) => {
  const stats = [
    {
      label: 'Total Travelers',
      value: total,
      icon: <Users className="w-5 h-5 text-[#583BE8]" />,
      bg: 'bg-purple-50',
      valueColor: 'text-[#583BE8]',
    },
    {
      label: 'Checked In',
      value: checkedIn,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Pending Check-in',
      value: pendingCheckIn,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      valueColor: 'text-amber-700',
    },
    {
      label: 'Payment Pending',
      value: paymentPending,
      icon: <CreditCard className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50',
      valueColor: 'text-rose-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className={`text-lg font-black ${stat.valueColor} leading-tight`}>{stat.value}</p>
            <p className="text-[10px] font-semibold text-slate-400 leading-tight">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
