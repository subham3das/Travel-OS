import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AgencyVerificationStatus } from '../../../agency-panel/types/agency';

export const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'review-apps',
      title: 'Review Applications',
      subtitle: '28 pending',
      status: AgencyVerificationStatus.PENDING,
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-100',
      iconBg: 'bg-[#583BE8] text-white',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'pending-reviews',
      title: 'Pending Reviews',
      subtitle: '46 under review',
      status: AgencyVerificationStatus.UNDER_REVIEW,
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-100',
      iconBg: 'bg-amber-500 text-white',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'recently-approved',
      title: 'Recently Approved',
      subtitle: '12 this week',
      status: AgencyVerificationStatus.APPROVED,
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100',
      iconBg: 'bg-emerald-500 text-white',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      id: 'recently-rejected',
      title: 'Recently Rejected',
      subtitle: '3 this week',
      status: AgencyVerificationStatus.REJECTED,
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-100',
      iconBg: 'bg-rose-500 text-white',
      icon: <XCircle className="w-4 h-4" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5 select-none"
    >
      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">Quick Actions</h4>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => navigate(`/admin/agencies?status=${act.status}`)}
            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${act.bg}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${act.iconBg}`}>
              {act.icon}
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs font-extrabold text-[#0F172A] block truncate">{act.title}</span>
              <span className="text-[10px] font-bold text-slate-500 block truncate">{act.subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActionsCard;
