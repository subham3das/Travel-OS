import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { AgencyVerificationStatus } from '../../../agency-panel/types/agency';
import { KPIStatItem } from '../../data/dashboard';
import { useNavigate } from 'react-router-dom';

interface DashboardStatCardProps {
  stat: KPIStatItem;
  delay?: number;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ stat, delay = 0 }) => {
  const navigate = useNavigate();

  const getThemeConfig = (type: AgencyVerificationStatus) => {
    switch (type) {
      case AgencyVerificationStatus.PENDING:
        return {
          bgIcon: 'bg-purple-100/80 text-[#583BE8]',
          icon: <FileText className="w-6 h-6 stroke-[2.2]" />,
        };
      case AgencyVerificationStatus.UNDER_REVIEW:
        return {
          bgIcon: 'bg-amber-100/80 text-amber-600',
          icon: <Clock className="w-6 h-6 stroke-[2.2]" />,
        };
      case AgencyVerificationStatus.APPROVED:
        return {
          bgIcon: 'bg-emerald-100/80 text-emerald-600',
          icon: <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />,
        };
      case AgencyVerificationStatus.REJECTED:
        return {
          bgIcon: 'bg-rose-100/80 text-rose-600',
          icon: <XCircle className="w-6 h-6 stroke-[2.2]" />,
        };
      default:
        return {
          bgIcon: 'bg-slate-100 text-slate-600',
          icon: <FileText className="w-6 h-6" />,
        };
    }
  };

  const { bgIcon, icon } = getThemeConfig(stat.type);

  const handleClick = () => {
    navigate(`/admin/agencies?status=${stat.type}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      onClick={handleClick}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-purple-200/60 transition-all cursor-pointer select-none flex items-center justify-between group"
    >
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-500 block">{stat.title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#0F172A] tracking-tight">{stat.count}</span>
        </div>
        <p
          className={`text-[11px] font-extrabold flex items-center gap-1 ${
            stat.isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          <span>{stat.trend}</span>
        </p>
      </div>

      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs ${bgIcon}`}
      >
        {icon}
      </div>
    </motion.div>
  );
};

export default DashboardStatCard;
