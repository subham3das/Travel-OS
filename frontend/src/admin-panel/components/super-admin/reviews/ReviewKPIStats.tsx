import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  ThumbsDown,
  Trash2,
  Star,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ReviewKPIStats, ReviewKPICardItem } from '../../../types/reviewManagement';

interface ReviewKPIStatsProps {
  stats: ReviewKPIStats;
  selectedStatus?: string;
  onCardClick?: (id: string) => void;
}

export const ReviewKPIStatsCards: React.FC<ReviewKPIStatsProps> = ({
  stats,
  selectedStatus,
  onCardClick,
}) => {
  const getCardIcon = (type: ReviewKPICardItem['iconType']) => {
    switch (type) {
      case 'total':
        return {
          icon: <MessageSquare className="w-4 h-4 text-[#6356E5]" />,
          bg: 'bg-purple-50',
          strokeColor: '#6356E5',
        };
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4 text-amber-600" />,
          bg: 'bg-amber-50',
          strokeColor: '#F59E0B',
        };
      case 'reported':
        return {
          icon: <ThumbsDown className="w-4 h-4 text-rose-600" />,
          bg: 'bg-rose-50',
          strokeColor: '#EF4444',
        };
      case 'removed':
        return {
          icon: <Trash2 className="w-4 h-4 text-rose-600" />,
          bg: 'bg-rose-50',
          strokeColor: '#EF4444',
        };
      case 'rating':
        return {
          icon: <Star className="w-4 h-4 text-blue-600 fill-blue-600" />,
          bg: 'bg-blue-50',
          strokeColor: '#3B82F6',
        };
      case 'today':
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-50',
          strokeColor: '#10B981',
        };
    }
  };

  const cardsList: ReviewKPICardItem[] = [
    stats.totalReviews,
    stats.pendingModeration,
    stats.reportedReviews,
    stats.removedReviews,
    stats.avgRating,
    stats.reviewsToday,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full select-none">
      {cardsList.map((card, idx) => {
        const { icon, bg, strokeColor } = getCardIcon(card.iconType);
        const isSelected = selectedStatus?.toLowerCase() === card.id.toLowerCase();

        return (
          <motion.div
            key={card.id || idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            whileHover={{ y: -2 }}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between group ${
              isSelected
                ? 'border-[#6356E5] ring-2 ring-[#6356E5]/20 shadow-md'
                : 'border-slate-100/90 shadow-2xs hover:shadow-md hover:border-slate-200'
            }`}
          >
            {/* Top row: Icon + Title */}
            <div className="flex items-start justify-between gap-1.5">
              <div
                className={`w-7 h-7 rounded-xl ${bg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                {icon}
              </div>

              <div className="space-y-0.5 min-w-0 text-right">
                <p className="text-[10px] font-bold text-slate-400 truncate">{card.title}</p>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors">
                  {card.value}
                </h3>
              </div>
            </div>

            {/* Mini Sparkline Curve */}
            <div className="my-2.5 h-3.5 w-full opacity-75 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 20" className="w-full h-full" fill="none">
                <path
                  d={
                    card.isPositive
                      ? 'M0 16 Q 25 18, 50 10 T 100 4'
                      : 'M0 6 Q 25 4, 50 12 T 100 16'
                  }
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Bottom row: Growth Tag + Comparison */}
            <div className="pt-1.5 flex items-center gap-1 text-[9px] font-extrabold border-t border-slate-50">
              <span
                className={`inline-flex items-center gap-0.5 px-1 py-0.2 rounded-md font-black ${
                  card.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                }`}
              >
                {card.isPositive ? (
                  <ArrowUpRight className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <ArrowDownRight className="w-2.5 h-2.5 stroke-[3]" />
                )}
                <span>{card.growth}</span>
              </span>
              <span className="font-medium text-slate-400 truncate">{card.comparison}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
