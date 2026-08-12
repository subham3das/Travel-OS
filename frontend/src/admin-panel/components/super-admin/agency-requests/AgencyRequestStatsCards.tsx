import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Hourglass,
  FileQuestion,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AgencyRequestSummaryStats } from '../../../types/agencyRequest';

interface AgencyRequestStatsCardsProps {
  stats: AgencyRequestSummaryStats;
  onFilterByStatus?: (status: string) => void;
}

export const AgencyRequestStatsCards: React.FC<AgencyRequestStatsCardsProps> = ({
  stats,
  onFilterByStatus,
}) => {
  const cardsList = [
    {
      id: 'pending',
      title: 'Pending Requests',
      value: stats.pendingRequests.count.toString(),
      growth: stats.pendingRequests.growth,
      isPositive: stats.pendingRequests.isPositive,
      icon: <Building2 className="w-5 h-5 text-[#6356E5]" />,
      bgColor: 'bg-purple-50',
      filterVal: 'Pending',
    },
    {
      id: 'approved',
      title: 'Approved Today',
      value: stats.approvedToday.count.toString(),
      growth: stats.approvedToday.growth,
      isPositive: stats.approvedToday.isPositive,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      filterVal: 'Approved',
    },
    {
      id: 'rejected',
      title: 'Rejected Today',
      value: stats.rejectedToday.count.toString(),
      growth: stats.rejectedToday.growth,
      isPositive: false,
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      bgColor: 'bg-rose-50',
      filterVal: 'Rejected',
    },
    {
      id: 'under_review',
      title: 'Under Review',
      value: stats.underReview.count.toString(),
      growth: stats.underReview.growth,
      isPositive: stats.underReview.isPositive,
      icon: <Hourglass className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      filterVal: 'Under Review',
    },
    {
      id: 'missing_docs',
      title: 'Documents Missing',
      value: stats.documentsMissing.count.toString(),
      growth: stats.documentsMissing.growth,
      isPositive: stats.documentsMissing.isPositive,
      icon: <FileQuestion className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      filterVal: 'Missing Docs',
    },
    {
      id: 'avg_time',
      title: 'Avg. Approval Time',
      value: stats.avgApprovalTime.value,
      growth: stats.avgApprovalTime.growth,
      isPositive: true,
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      filterVal: 'All Status',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full select-none">
      {cardsList.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.04 }}
          whileHover={{ y: -3 }}
          onClick={() => onFilterByStatus && onFilterByStatus(card.filterVal)}
          className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-500 truncate">{card.title}</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors">
                {card.value}
              </h3>
            </div>

            <div
              className={`w-9 h-9 rounded-2xl ${card.bgColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center gap-1 text-[10px] font-extrabold border-t border-slate-50">
            <span
              className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded-md font-black ${
                card.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}
            >
              {card.isPositive ? (
                <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[3]" />
              )}
              <span>{card.growth}</span>
            </span>
            <span className="font-medium text-slate-400 truncate">from yesterday</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
