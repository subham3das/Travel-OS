import React from 'react';
import { BookingStatus } from '../../data/bookings';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'REFUNDED':
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
      case 'COMPLETED':
        return 'bg-[#583BE8]/10 text-[#583BE8] border-[#583BE8]/20';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getLabelText = () => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'REFUNDED':
        return 'Refunded';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-2xs inline-flex items-center gap-1 ${getBadgeStyle()}`}
    >
      <span>{getLabelText()}</span>
    </span>
  );
};

export default BookingStatusBadge;
