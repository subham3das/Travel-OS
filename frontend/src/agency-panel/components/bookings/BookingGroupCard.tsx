import React, { useState } from 'react';
import {
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookingGroup, AgencyBooking } from '../../data/bookings';
import { BookingCard } from './BookingCard';
import { MinimumNotReachedPanel } from './MinimumNotReachedPanel';
import { PreDepartureChecklist } from './PreDepartureChecklist';
import { PendingPaymentCard } from './PendingPaymentCard';
import { PendingPaymentsModal } from './PendingPaymentsModal';

interface BookingGroupCardProps {
  group: BookingGroup;
  onSelectBooking: (booking: AgencyBooking) => void;
  onConfirmBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onCreateTrip: (group: BookingGroup) => void;
  onExtendDeadline: (group: BookingGroup, newDate: string) => void;
  onCancelDeparture: (group: BookingGroup) => void;
  onForceCreateTrip: (group: BookingGroup) => void;
  onSendReminder?: (group: BookingGroup) => void;
}

export const BookingGroupCard: React.FC<BookingGroupCardProps> = ({
  group,
  onSelectBooking,
  onConfirmBooking,
  onRejectBooking,
  onCreateTrip,
  onExtendDeadline,
  onCancelDeparture,
  onForceCreateTrip,
  onSendReminder,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  const capacityPct = Math.min(100, Math.round((group.confirmedTravelerCount / group.maxCapacity) * 100));
  const isTripCreationDisabled = group.pendingPaymentTravelerCount > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all select-none space-y-0">
      {/* Group Card Header */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          {/* Package Cover & Info */}
          <div className="flex items-start gap-3.5 min-w-0">
            <img
              src={group.coverImage}
              alt={group.packageName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-[#0F172A] truncate">
                  {group.packageName}
                </h3>

                {/* Status Badges strictly matching specifications */}
                {group.groupStatus === 'OPEN' && (
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-[#583BE8] border border-purple-200/80 text-[11px] font-extrabold inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Booking Open</span>
                  </span>
                )}

                {group.groupStatus === 'READY_FOR_TRIP' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-black inline-flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Ready for Trip Creation</span>
                  </span>
                )}

                {group.groupStatus === 'MINIMUM_NOT_REACHED' && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-black inline-flex items-center gap-1 shadow-2xs">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>Minimum Not Reached</span>
                  </span>
                )}

                {group.groupStatus === 'MOVED_TO_TRIP' && (
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-extrabold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Trip Created</span>
                  </span>
                )}

                {group.groupStatus === 'CANCELLED' && (
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-[11px] font-extrabold inline-flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    <span>Departure Cancelled</span>
                  </span>
                )}
              </div>

              {/* Dates, Deadline & Minimum Info */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {group.departureDate} – {group.returnDate}
                </span>

                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {group.deadlineText}
                </span>

                <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md text-[10px] font-extrabold">
                  <Users className="w-3 h-3" />
                  Min: {group.minTravelers} | Max: {group.maxCapacity}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA: Create Trip Button */}
          {group.groupStatus === 'READY_FOR_TRIP' && (
            <button
              type="button"
              disabled={isTripCreationDisabled}
              onClick={() => onCreateTrip(group)}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shrink-0 ${
                isTripCreationDisabled
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 cursor-pointer animate-pulse hover:animate-none'
              }`}
              title={
                isTripCreationDisabled
                  ? 'Cannot create trip: some travelers have pending payments.'
                  : 'Create operational trip'
              }
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Create Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {group.groupStatus === 'MOVED_TO_TRIP' && group.assignedTripId && (
            <button
              type="button"
              onClick={() => navigate(`/agency/trips`)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>View Trip ({group.assignedTripId})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Detailed Traveler & Payment Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Confirmed</span>
            <span className="text-[#0F172A] font-black">{group.confirmedTravelerCount} Travelers</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Fully Paid</span>
            <span className="text-emerald-600 font-black">{group.fullyPaidTravelerCount} Travelers</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Pending Payment</span>
            <span
              className={`font-black ${
                group.pendingPaymentTravelerCount > 0 ? 'text-rose-600' : 'text-slate-500'
              }`}
            >
              {group.pendingPaymentTravelerCount} Travelers
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Capacity</span>
            <span className="text-purple-700 font-black">
              {group.confirmedTravelerCount}/{group.maxCapacity} Seats
            </span>
          </div>
        </div>

        {/* Pre-Departure Checklist Component */}
        <PreDepartureChecklist group={group} />

        {/* Warning Card if Trip Creation is blocked by Pending Payments */}
        {group.pendingPaymentTravelerCount > 0 && (
          <PendingPaymentCard
            pendingTravelersCount={group.pendingPaymentTravelerCount}
            onViewPending={() => {
              setIsExpanded(true);
              setIsPendingModalOpen(true);
            }}
            onSendReminder={() => {
              if (onSendReminder) onSendReminder(group);
              else alert(`Payment reminders sent to ${group.pendingPaymentTravelerCount} travelers!`);
            }}
          />
        )}

        {/* Pending Payments Details Modal */}
        <PendingPaymentsModal
          group={group}
          isOpen={isPendingModalOpen}
          onClose={() => setIsPendingModalOpen(false)}
        />

        {/* Render Operations Panel when Minimum Not Reached */}
        {group.groupStatus === 'MINIMUM_NOT_REACHED' && (
          <MinimumNotReachedPanel
            group={group}
            onExtendDeadline={onExtendDeadline}
            onCancelDeparture={onCancelDeparture}
            onForceCreateTrip={onForceCreateTrip}
          />
        )}
      </div>

      {/* Expandable Individual Bookings Sub-list */}
      <div className="border-t border-slate-100 bg-slate-50/40">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-2.5 flex items-center justify-between text-xs font-extrabold text-slate-500 hover:text-[#583BE8] transition-colors cursor-pointer"
        >
          <span>
            {group.bookings.length} {group.bookings.length === 1 ? 'Reservation' : 'Reservations'} in this Departure
          </span>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{isExpanded ? 'Hide' : 'Show'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="p-4 space-y-3 pt-1 border-t border-slate-100">
            {group.bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onSelect={onSelectBooking}
                onConfirm={onConfirmBooking}
                onReject={onRejectBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingGroupCard;
