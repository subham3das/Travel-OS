import React from 'react';
import { AgencyRecentBooking } from '../../data/dashboard';

interface BookingCardProps {
  booking: AgencyRecentBooking;
  onClick?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick }) => {
  const getStatusStyle = (status: AgencyRecentBooking['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100/70 text-emerald-800';
      case 'Pending':
        return 'bg-sky-100/70 text-sky-800';
      case 'Cancelled':
        return 'bg-rose-100/70 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-3 sm:p-3.5 rounded-2xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
    >
      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <img
          src={booking.travelerAvatar}
          alt={booking.travelerName}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
        />

        <div className="space-y-0.5 min-w-0">
          <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
            {booking.travelerName}
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 truncate">
            {booking.packageName}
          </p>
        </div>
      </div>

      {/* Right: Amount & Status Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs sm:text-sm font-black text-[#0F172A]">{booking.amount}</span>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${getStatusStyle(booking.status)}`}>
          {booking.status}
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
