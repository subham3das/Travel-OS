import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, XCircle, User, ArrowRight } from 'lucide-react';
import { AgencyVerificationStatus } from '../../../agency-panel/types/agency';
import { MOCK_RECENT_ACTIVITIES, ActivityTimelineItem } from '../../data/dashboard';

export const ActivityTimeline: React.FC = () => {
  const getIcon = (type: AgencyVerificationStatus | 'USER') => {
    switch (type) {
      case AgencyVerificationStatus.PENDING:
        return (
          <div className="w-8 h-8 rounded-2xl bg-purple-100/80 text-[#583BE8] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case AgencyVerificationStatus.UNDER_REVIEW:
        return (
          <div className="w-8 h-8 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      case AgencyVerificationStatus.APPROVED:
        return (
          <div className="w-8 h-8 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case AgencyVerificationStatus.REJECTED:
        return (
          <div className="w-8 h-8 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'USER':
      default:
        return (
          <div className="w-8 h-8 rounded-2xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Recent Activity</h3>
        <button
          type="button"
          onClick={() => alert('Activity logs feature — coming soon')}
          className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4 pt-1">
        {MOCK_RECENT_ACTIVITIES.map((act: ActivityTimelineItem) => (
          <div key={act.id} className="flex items-start gap-3 text-xs">
            {getIcon(act.type)}
            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="font-extrabold text-[#0F172A] leading-snug truncate">{act.title}</p>
              <p className="font-semibold text-slate-400 truncate">{act.target}</p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 shrink-0">{act.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => alert('Full activity log filter — coming soon')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>View all activity logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;
