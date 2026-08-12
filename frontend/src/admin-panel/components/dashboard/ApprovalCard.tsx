import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Package, ShieldCheck } from 'lucide-react';
import { ApprovalRequest } from '../../types/dashboard';

interface ApprovalCardProps {
  approvals: ApprovalRequest[];
  onViewAll?: () => void;
  onReview?: (id: string) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  approvals,
  onViewAll,
  onReview,
}) => {
  const getIcon = (iconType: ApprovalRequest['iconType']) => {
    switch (iconType) {
      case 'building':
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case 'package':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'verification':
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">Pending Approvals</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Approvals List */}
      <div className="space-y-3.5">
        {approvals.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100/60 shadow-2xs group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-slate-100/80 flex items-center justify-center shrink-0 border border-slate-200/50 group-hover:bg-purple-50 transition-colors">
                {getIcon(item.iconType)}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0F172A] truncate leading-tight group-hover:text-[#6356E5] transition-colors">
                  {item.name}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 leading-tight mt-0.5">
                  {item.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap hidden sm:inline">
                {item.timeAgo}
              </span>

              <button
                onClick={() => onReview && onReview(item.id)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#6356E5] text-[#6356E5] hover:bg-[#EEF2FF] text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
