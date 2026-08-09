import React from 'react';
import { BookingGroup } from '../../data/bookings';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PreDepartureChecklistProps {
  group: BookingGroup;
}

export const PreDepartureChecklist: React.FC<PreDepartureChecklistProps> = ({ group }) => {
  const isMinReached = group.confirmedTravelerCount >= group.minTravelers;
  const isDeadlineClosed = group.isDeadlineExpired || group.confirmedTravelerCount >= group.maxCapacity;
  const isAllPaid = group.pendingPaymentTravelerCount === 0;
  const isReady = isMinReached && isDeadlineClosed && isAllPaid;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Pre-Departure Checklist
        </h4>
        <span
          className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
            isReady
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {isReady ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ready To Create Trip</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Action Required</span>
            </>
          )}
        </span>
      </div>

      {/* Checklist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold pt-1">
        {/* Item 1: Min Travelers */}
        <div
          className={`p-2.5 rounded-2xl border flex items-center gap-2.5 ${
            isMinReached
              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
              : 'bg-rose-50/50 border-rose-100 text-rose-800'
          }`}
        >
          {isMinReached ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>
            Minimum Travelers Reached ({group.confirmedTravelerCount}/{group.minTravelers})
          </span>
        </div>

        {/* Item 2: Booking Deadline */}
        <div
          className={`p-2.5 rounded-2xl border flex items-center gap-2.5 ${
            isDeadlineClosed
              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
              : 'bg-amber-50/50 border-amber-100 text-amber-800'
          }`}
        >
          {isDeadlineClosed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>
            Booking Deadline Closed ({group.isDeadlineExpired ? 'Expired' : 'Active'})
          </span>
        </div>

        {/* Item 3: Every Traveler Fully Paid */}
        <div
          className={`p-2.5 rounded-2xl border flex items-center gap-2.5 ${
            isAllPaid
              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
              : 'bg-rose-50/70 border-rose-200 text-rose-900 font-extrabold'
          }`}
        >
          {isAllPaid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
          )}
          <span>
            Every Traveler Fully Paid{' '}
            {!isAllPaid ? `(${group.pendingPaymentTravelerCount} Pending)` : ''}
          </span>
        </div>

        {/* Item 4: Documents Verified */}
        <div className="p-2.5 rounded-2xl border bg-emerald-50/50 border-emerald-100 text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Identity Documents Verified</span>
        </div>
      </div>
    </div>
  );
};

export default PreDepartureChecklist;
