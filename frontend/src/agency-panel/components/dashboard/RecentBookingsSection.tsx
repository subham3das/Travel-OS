import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardRecentBooking } from '../../data/dashboardInsights';

interface RecentBookingsSectionProps {
  bookings: DashboardRecentBooking[];
}

export const RecentBookingsSection: React.FC<RecentBookingsSectionProps> = ({ bookings }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none"
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Recent Bookings</h3>
        <button
          type="button"
          onClick={() => navigate('/agency/bookings')}
          className="text-xs font-black text-[#583BE8] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {bookings.length > 0 ? (
        <div className="divide-y divide-slate-100/80">
          {bookings.map((booking) => {
            const isConfirmed = booking.bookingStatus === 'Confirmed';
            const isPending = booking.bookingStatus === 'Pending';

            return (
              <div
                key={booking.id}
                onClick={() => navigate('/agency/bookings')}
                className="py-3.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 rounded-2xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={booking.travelerAvatar}
                    alt={booking.travelerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate">
                      {booking.packageName}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-400 truncate">
                      {booking.id} • {booking.travelerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      isConfirmed
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                        : isPending
                        ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>

                  <span className="text-xs font-black text-[#0F172A]">{booking.amountText}</span>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center space-y-2">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-400">No bookings yet.</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentBookingsSection;
