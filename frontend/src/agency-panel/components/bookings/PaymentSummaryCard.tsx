import React from 'react';
import { AgencyBooking } from '../../data/bookings';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { TripEligibilityBadge } from './TripEligibilityBadge';
import { IndianRupee, Calendar, CreditCard, CheckCircle2 } from 'lucide-react';

interface PaymentSummaryCardProps {
  booking: AgencyBooking;
}

export const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ booking }) => {
  const paidPct = Math.round((booking.amountPaid / booking.totalAmount) * 100);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Payment Summary & Eligibility
        </h4>
        <PaymentStatusBadge status={booking.paymentStatus} />
      </div>

      {/* Pricing Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 block">Package Price</span>
          <span className="text-sm font-black text-[#0F172A]">
            ₹{booking.packagePrice.toLocaleString('en-IN')}{' '}
            <span className="text-[10px] text-slate-400 font-semibold">/person</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-slate-400 block">Total Amount</span>
          <span className="text-sm font-black text-[#0F172A]">
            ₹{booking.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-slate-400 block">Amount Paid</span>
          <span className="text-sm font-black text-emerald-600">
            ₹{booking.amountPaid.toLocaleString('en-IN')}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-slate-400 block">Remaining Due</span>
          <span
            className={`text-sm font-black ${
              booking.remainingAmount > 0 ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            ₹{booking.remainingAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Progress Fill Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-slate-600">Payment Progress</span>
          <span className="text-[#583BE8] font-black">{paidPct}% Completed</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              paidPct === 100 ? 'bg-emerald-500' : 'bg-[#583BE8]'
            }`}
            style={{ width: `${paidPct}%` }}
          />
        </div>
      </div>

      {/* Eligibility Pill & Due Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Trip Status:</span>
          <TripEligibilityBadge
            eligibility={booking.tripEligibility}
            remainingAmount={booking.remainingAmount}
          />
        </div>

        {booking.remainingAmount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60">
            <Calendar className="w-3.5 h-3.5" />
            <span>Full Payment Due: {booking.dueDate}</span>
          </div>
        )}
      </div>

      {/* Payment History List */}
      {booking.paymentHistory && booking.paymentHistory.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Payment History
          </span>
          <div className="space-y-2">
            {booking.paymentHistory.map((pmt) => (
              <div
                key={pmt.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#0F172A] block font-black">{pmt.method}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Ref: {pmt.reference} • {pmt.date}
                    </span>
                  </div>
                </div>

                <span className="text-sm font-black text-emerald-600">
                  +₹{pmt.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSummaryCard;
