import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertOctagon,
  X,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  DollarSign,
  Calendar,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookingGroup, AgencyBooking } from '../../data/bookings';
import { useToast } from '../../providers/ToastProvider';

interface PendingPaymentsModalProps {
  group: BookingGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsPaid?: (bookingId: string) => void;
}

export const PendingPaymentsModal: React.FC<PendingPaymentsModalProps> = ({
  group,
  isOpen,
  onClose,
  onMarkAsPaid,
}) => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();
  const [paidBookingIds, setPaidBookingIds] = useState<string[]>([]);
  const [remindedIds, setRemindedIds] = useState<string[]>([]);

  if (!isOpen || !group) return null;

  // Filter bookings in this group that have pending or partial payments
  const pendingBookings = group.bookings.filter(
    (b) =>
      (b.paymentStatus === 'UNPAID' || b.paymentStatus === 'PARTIALLY_PAID') &&
      !paidBookingIds.includes(b.id)
  );

  const totalPendingBalance = pendingBookings.reduce(
    (acc, b) => acc + (b.remainingAmount || b.totalAmount - b.amountPaid),
    0
  );

  const handleSendSingleReminder = (booking: AgencyBooking) => {
    setRemindedIds((prev) => [...prev, booking.id]);
    showSuccess(
      'Payment Reminder Sent',
      `Payment link sent via WhatsApp & SMS to ${booking.owner?.name || booking.traveler.name}`
    );
  };

  const handleSendBulkReminders = () => {
    const allIds = pendingBookings.map((b) => b.id);
    setRemindedIds(allIds);
    showSuccess(
      'Bulk Reminders Sent',
      `Payment reminders dispatched to all ${pendingBookings.length} pending travelers.`
    );
  };

  const handleMarkPaid = (bookingId: string) => {
    setPaidBookingIds((prev) => [...prev, bookingId]);
    if (onMarkAsPaid) {
      onMarkAsPaid(bookingId);
    }
    showSuccess('Payment Recorded', `Booking ${bookingId} has been marked as Fully Paid!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="bg-rose-50 border-b border-rose-100 p-4 sm:p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-rose-950">
                  Pending Traveler Payments
                </h3>
                <p className="text-xs font-semibold text-rose-800">
                  {group.packageName} • Departure {group.departureDate}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors cursor-pointer border border-rose-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pending Summary Banner */}
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px]">
                {pendingBookings.length} Traveler{pendingBookings.length === 1 ? '' : 's'} Unpaid
              </span>
              <span className="font-extrabold text-slate-700">
                Total Due: ₹{totalPendingBalance.toLocaleString()}
              </span>
            </div>

            {pendingBookings.length > 0 && (
              <button
                type="button"
                onClick={handleSendBulkReminders}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reminders to All</span>
              </button>
            )}
          </div>

          {/* Pending Traveler List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {pendingBookings.length > 0 ? (
              pendingBookings.map((booking) => {
                const ownerName = booking.owner?.name || booking.traveler.name;
                const ownerPhone = booking.owner?.phone || booking.traveler.phone;
                const ownerEmail = booking.owner?.email || booking.traveler.email;
                const remaining = booking.remainingAmount || booking.totalAmount - booking.amountPaid;
                const isReminded = remindedIds.includes(booking.id);

                return (
                  <div
                    key={booking.id}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 transition-all hover:bg-white hover:border-purple-200 hover:shadow-xs"
                  >
                    {/* Top Row: Name & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-[#0F172A]">{ownerName}</h4>
                          <span className="text-[10px] font-extrabold text-slate-400">
                            ({booking.id})
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-3 mt-0.5">
                          {ownerPhone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" /> {ownerPhone}
                            </span>
                          )}
                          {ownerEmail && (
                            <span className="inline-flex items-center gap-1 hidden sm:inline-flex">
                              <Mail className="w-3 h-3 text-slate-400" /> {ownerEmail}
                            </span>
                          )}
                        </p>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider shrink-0 border border-rose-200">
                        {booking.paymentStatus === 'UNPAID' ? 'Unpaid' : 'Partially Paid'}
                      </span>
                    </div>

                    {/* Financial Breakdown Card */}
                    <div className="p-3 rounded-xl bg-white border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Total Price</span>
                        <span className="font-extrabold text-[#0F172A]">₹{booking.totalAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 block">Paid</span>
                        <span className="font-extrabold text-emerald-700">₹{booking.amountPaid.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 block">Remaining</span>
                        <span className="font-black text-rose-600">₹{remaining.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action Bar for Traveler */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isReminded}
                          onClick={() => handleSendSingleReminder(booking)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                            isReminded
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{isReminded ? 'Reminder Sent' : 'Send Reminder'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate('/agency/messages');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] border border-purple-200 text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMarkPaid(booking.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Full Paid</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-[#0F172A]">All Payments Settled!</h4>
                <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
                  Every traveler in this departure has completed full payment. This departure is now ready to be converted into an active Trip!
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-semibold text-slate-400">
              Trip creation requires 100% paid traveler roster.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-extrabold transition-all cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PendingPaymentsModal;
