import React from 'react';
import { Calendar, Users, User, Clock, UserCheck } from 'lucide-react';
import { AgencyBooking } from '../../data/bookings';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { TripEligibilityBadge } from './TripEligibilityBadge';
import { BookingActionMenu } from './BookingActionMenu';

interface BookingCardProps {
  booking: AgencyBooking;
  onSelect: (booking: AgencyBooking) => void;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onSelect,
  onConfirm,
  onReject,
}) => {
  const ownerName = booking.owner?.name || booking.traveler.name;
  const ownerPhone = booking.owner?.phone || booking.traveler.phone;
  const partnerCount = booking.partners?.length || 0;

  return (
    <div
      onClick={() => onSelect(booking)}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-purple-200/80 transition-all cursor-pointer select-none space-y-4"
    >
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Cover Image */}
        <img
          src={booking.coverImage}
          alt={booking.packageName}
          className="w-full sm:w-28 h-28 sm:h-28 rounded-2xl object-cover shrink-0"
        />

        {/* Info Column */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          {/* Booking ID & Booking Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                BOOKING ID
              </span>
              <span className="text-xs font-black text-[#0F172A]">{booking.id}</span>
            </div>
            <BookingStatusBadge status={booking.bookingStatus} />
          </div>

          {/* Package Name */}
          <h3 className="text-sm sm:text-base font-black text-[#0F172A] truncate">
            {booking.packageName}
          </h3>

          {/* Payment & Trip Eligibility Badges */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <PaymentStatusBadge status={booking.paymentStatus} size="sm" />
            <TripEligibilityBadge
              eligibility={booking.tripEligibility}
              remainingAmount={booking.remainingAmount}
              size="sm"
            />
          </div>

          {/* Dates & Travelers Count Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500 pt-0.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {booking.departureDate} – {booking.returnDate}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#583BE8] bg-purple-50 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border border-purple-100">
              <Users className="w-3.5 h-3.5" />
              <span>
                {booking.travelerCount} Travelers{' '}
                {partnerCount > 0 ? `(1 Primary + ${partnerCount} Partner${partnerCount > 1 ? 's' : ''})` : '(Solo)'}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Financial Breakdown */}
        <div className="text-left sm:text-right shrink-0 self-stretch sm:self-auto flex sm:flex-col justify-between items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div>
            <span className="text-base sm:text-lg font-black text-[#0F172A] block">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block">Total Price</span>
          </div>

          <div className="pt-2 text-xs font-bold">
            <span className="text-emerald-600 block">
              Paid: ₹{booking.amountPaid.toLocaleString('en-IN')}
            </span>
            {booking.remainingAmount > 0 && (
              <span className="text-amber-600 block font-black">
                Due: ₹{booking.remainingAmount.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Divider & Primary Traveler / Booking Owner Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-[#0F172A] truncate">{ownerName}</p>
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-purple-100 text-[#583BE8] rounded-md shrink-0">
                Primary
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 truncate">{ownerPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {booking.remainingAmount > 0 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Due {booking.dueDate}</span>
            </span>
          )}

          <BookingActionMenu
            booking={booking}
            onView={() => onSelect(booking)}
            onConfirm={() => onConfirm(booking.id)}
            onReject={() => onReject(booking.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
