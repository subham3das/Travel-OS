import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ShieldCheck,
  Clock,
  FileText,
  ShoppingBag,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PackageKPIStats } from '../../../types/packageManagement';

interface PackageKPISectionProps {
  stats: PackageKPIStats;
  onFilterByStatus?: (status: string) => void;
}

export const PackageKPISection: React.FC<PackageKPISectionProps> = ({
  stats,
  onFilterByStatus,
}) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Packages',
      value: stats.totalPackages.count.toLocaleString(),
      growth: stats.totalPackages.growth,
      isPositive: stats.totalPackages.isPositive,
      comparison: 'from last 30 days',
      icon: <Briefcase className="w-5 h-5 text-[#6356E5]" />,
      bgColor: 'bg-purple-50',
      filterVal: 'All Status',
    },
    {
      id: 'active',
      title: 'Active Packages',
      value: stats.activePackages.count.toLocaleString(),
      growth: stats.activePackages.growth,
      isPositive: stats.activePackages.isPositive,
      comparison: 'from last 30 days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      filterVal: 'Active',
    },
    {
      id: 'pending',
      title: 'Pending Review',
      value: stats.pendingReview.count.toLocaleString(),
      growth: stats.pendingReview.growth,
      isPositive: stats.pendingReview.isPositive,
      comparison: 'from last 30 days',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      filterVal: 'Pending',
    },
    {
      id: 'draft',
      title: 'Draft Packages',
      value: stats.draftPackages.count.toLocaleString(),
      growth: stats.draftPackages.growth,
      isPositive: stats.draftPackages.isPositive,
      comparison: 'from last 30 days',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      filterVal: 'Draft',
    },
    {
      id: 'sold_out',
      title: 'Sold Out',
      value: stats.soldOut.count.toLocaleString(),
      growth: stats.soldOut.growth,
      isPositive: false,
      comparison: 'from last 30 days',
      icon: <ShoppingBag className="w-5 h-5 text-rose-500" />,
      bgColor: 'bg-rose-50',
      filterVal: 'Sold Out',
    },
    {
      id: 'featured',
      title: 'Featured Packages',
      value: stats.featuredPackages.count.toLocaleString(),
      growth: stats.featuredPackages.growth,
      isPositive: stats.featuredPackages.isPositive,
      comparison: 'from last 30 days',
      icon: <Star className="w-5 h-5 text-[#6356E5] fill-purple-100" />,
      bgColor: 'bg-purple-50',
      filterVal: 'Featured',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full select-none">
      {cards.map((card, idx) => (
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
            <span className="font-medium text-slate-400 truncate">{card.comparison}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
