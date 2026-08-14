import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ShieldCheck,
  Clock,
  XCircle,
  CreditCard,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { BookingKPIStats } from '../../../types/bookingManagement';

interface BookingKPISectionProps {
  stats: BookingKPIStats;
  onFilterByStatus?: (status: string) => void;
}

export const BookingKPISection: React.FC<BookingKPISectionProps> = ({
  stats,
  onFilterByStatus,
}) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Bookings',
      value: stats.totalBookings.count.toLocaleString(),
      growth: stats.totalBookings.growth,
      isPositive: stats.totalBookings.isPositive,
      comparison: 'from last 30 days',
      icon: <Briefcase className="w-5 h-5 text-[#6356E5]" />,
      bgColor: 'bg-purple-50',
      filterVal: 'All Status',
    },
    {
      id: 'confirmed',
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings.count.toLocaleString(),
      growth: stats.confirmedBookings.growth,
      isPositive: stats.confirmedBookings.isPositive,
      comparison: 'from last 30 days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      filterVal: 'Confirmed',
    },
    {
      id: 'pending',
      title: 'Pending Bookings',
      value: stats.pendingBookings.count.toLocaleString(),
      growth: stats.pendingBookings.growth,
      isPositive: stats.pendingBookings.isPositive,
      comparison: 'from last 30 days',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      filterVal: 'Pending',
    },
    {
      id: 'cancelled',
      title: 'Cancelled Bookings',
      value: stats.cancelledBookings.count.toLocaleString(),
      growth: stats.cancelledBookings.growth,
      isPositive: stats.cancelledBookings.isPositive,
      comparison: 'from last 30 days',
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      bgColor: 'bg-rose-50',
      filterVal: 'Cancelled',
    },
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: stats.totalRevenue.value,
      growth: stats.totalRevenue.growth,
      isPositive: stats.totalRevenue.isPositive,
      comparison: 'from last 30 days',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      filterVal: 'Confirmed',
    },
    {
      id: 'refunded',
      title: 'Refunded Amount',
      value: stats.refundedAmount.value,
      growth: stats.refundedAmount.growth,
      isPositive: stats.refundedAmount.isPositive,
      comparison: 'from last 30 days',
      icon: <RotateCcw className="w-5 h-5 text-rose-500" />,
      bgColor: 'bg-rose-50',
      filterVal: 'Refunded',
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
