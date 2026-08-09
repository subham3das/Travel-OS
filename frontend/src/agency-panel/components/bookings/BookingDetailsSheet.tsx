import React from 'react';
import { X, Calendar, Users, Phone, Mail, FileText, CheckCircle, XCircle } from 'lucide-react';
import { AgencyBooking } from '../../data/bookings';
import { BookingStatusBadge } from './BookingStatusBadge';
import { PaymentSummaryCard } from './PaymentSummaryCard';
import { TravelGroupCard } from './TravelGroupCard';
import { BookingTimeline } from './BookingTimeline';

interface BookingDetailsSheetProps {
  booking: AgencyBooking | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}

export const BookingDetailsSheet: React.FC<BookingDetailsSheetProps> = ({
  booking,
  onClose,
  onConfirm,
  onReject,
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 select-none">
      <div className="bg-white w-full sm:max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#0F172A]">{booking.id}</span>
              <BookingStatusBadge status={booking.bookingStatus} />
            </div>
            <p className="text-[11px] font-bold text-slate-400">Booked on {booking.bookingDate}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Package Info */}
          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <img
              src={booking.coverImage}
              alt={booking.packageName}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-black text-[#0F172A] truncate">
                {booking.packageName}
              </h3>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {booking.departureDate} – {booking.returnDate}
                </span>
                <span className="flex items-center gap-1 text-[#583BE8]">
                  <Users className="w-3.5 h-3.5" />
                  {booking.travelerCount} Travelers
                </span>
              </div>
            </div>
          </div>

          {/* Travel Group (Primary Traveler + Travel Partners) */}
          <TravelGroupCard booking={booking} />

          {/* Payment Summary & Eligibility Component */}
          <PaymentSummaryCard booking={booking} />

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                Special Requests
              </h4>
              <p className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-xs font-semibold text-amber-900 leading-relaxed">
                "{booking.specialRequests}"
              </p>
            </div>
          )}

          {/* Booking Timeline */}
          <BookingTimeline timeline={booking.timeline} />
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 sticky bottom-0">
          {booking.bookingStatus !== 'CONFIRMED' && booking.bookingStatus !== 'CANCELLED' && (
            <button
              type="button"
              onClick={() => onConfirm(booking.id)}
              className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm Booking</span>
            </button>
          )}

          {booking.bookingStatus !== 'CANCELLED' && (
            <button
              type="button"
              onClick={() => onReject(booking.id)}
              className="py-3 px-4 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel / Reject</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSheet;
