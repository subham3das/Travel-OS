import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Calendar } from 'lucide-react';
import { CustomerBookingHistoryItem } from '../../data/customers';

interface BookingHistoryCardProps {
  bookingHistory: CustomerBookingHistoryItem[];
}

export const BookingHistoryCard: React.FC<BookingHistoryCardProps> = ({ bookingHistory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#583BE8]" />
          Booking History ({bookingHistory.length})
        </h3>
        <span className="text-xs font-semibold text-slate-400">All Package Bookings</span>
      </div>

      <div className="space-y-3">
        {bookingHistory.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-bold text-slate-400">
            No booking history found.
          </div>
        ) : (
          bookingHistory.map((bk) => (
            <div
              key={bk.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-[#583BE8]">{bk.bookingId}</span>
                  <span className="font-extrabold text-[#0F172A]">{bk.packageName}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-semibold flex-wrap">
                  <span>Booked: {bk.bookingDate}</span>
                  <span>•</span>
                  <span>Travel: {bk.travelDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="flex items-center gap-1 font-bold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {bk.travelersCount} Person{bk.travelersCount > 1 ? 's' : ''}
                </span>
                <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                  {bk.paymentStatus}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default BookingHistoryCard;
