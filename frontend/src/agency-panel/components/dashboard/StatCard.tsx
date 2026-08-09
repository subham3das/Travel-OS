import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, Package, IndianRupee, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AgencyKPIStat } from '../../data/dashboard';

interface StatCardProps {
  stat: AgencyKPIStat;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, delay = 0 }) => {
  const navigate = useNavigate();

  const getTheme = (type: AgencyKPIStat['type']) => {
    switch (type) {
      case 'bookings':
        return {
          bgIcon: 'bg-purple-100/80 text-[#583BE8]',
          icon: <Calendar className="w-5 h-5 stroke-[2.2]" />,
        };
      case 'trips':
        return {
          bgIcon: 'bg-sky-100/80 text-sky-600',
          icon: <Briefcase className="w-5 h-5 stroke-[2.2]" />,
        };
      case 'packages':
        return {
          bgIcon: 'bg-emerald-100/80 text-emerald-600',
          icon: <Package className="w-5 h-5 stroke-[2.2]" />,
        };
      case 'revenue':
        return {
          bgIcon: 'bg-[#583BE8]/10 text-[#583BE8]',
          icon: <IndianRupee className="w-5 h-5 stroke-[2.2]" />,
        };
      case 'awaiting_payment':
        return {
          bgIcon: 'bg-amber-100/80 text-amber-600',
          icon: <Clock className="w-5 h-5 stroke-[2.2]" />,
        };
      default:
        return {
          bgIcon: 'bg-slate-100 text-slate-600',
          icon: <Calendar className="w-5 h-5" />,
        };
    }
  };

  const { bgIcon, icon } = getTheme(stat.type);

  const handleClick = () => {
    if (stat.type === 'awaiting_payment' || stat.type === 'bookings') {
      navigate('/agency/bookings');
    } else if (stat.type === 'trips') {
      navigate('/agency/trips');
    } else if (stat.type === 'packages') {
      navigate('/agency/packages');
    } else if (stat.type === 'revenue') {
      navigate('/agency/analytics');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={handleClick}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all select-none flex flex-col justify-between min-w-[140px] sm:min-w-0 shrink-0 cursor-pointer"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${bgIcon}`}>
        {icon}
      </div>

      {/* Count & Details */}
      <div className="space-y-0.5">
        <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight block">
          {stat.count}
        </span>
        <span className="text-xs font-bold text-slate-400 block">{stat.label}</span>
      </div>

      {/* Growth / Action Pill */}
      <div className="pt-2">
        <span
          className={`text-[11px] font-extrabold flex items-center gap-1 ${
            stat.type === 'awaiting_payment' ? 'text-amber-600 font-black' : 'text-emerald-600'
          }`}
        >
          {stat.growth}
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;
