import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { AdminBookingItem } from '../../../types/bookingManagement';

interface BookingActionConfirmModalProps {
  isOpen: boolean;
  type: 'confirm' | 'cancel' | 'refund' | 'bulk_confirm' | 'bulk_cancel' | 'bulk_refund';
  booking?: AdminBookingItem | null;
  selectedCount?: number;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BookingActionConfirmModal: React.FC<BookingActionConfirmModalProps> = ({
  isOpen,
  type,
  booking,
  selectedCount = 0,
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'confirm':
        return {
          title: `Confirm Booking ${booking?.bookingId}?`,
          desc: `Confirm reservation for ${booking?.travelerName} on "${booking?.packageName}". Traveler and agency will receive immediate automated notifications.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          btnText: 'Confirm Booking',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'cancel':
        return {
          title: `Cancel Booking ${booking?.bookingId}?`,
          desc: `Are you sure you want to cancel the booking for ${booking?.travelerName}? Cancellation policies will be triggered and agency will be notified.`,
          icon: <XCircle className="w-6 h-6 text-rose-600" />,
          btnText: 'Cancel Booking',
          btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
        };
      case 'refund':
        return {
          title: `Process Refund for ${booking?.bookingId}?`,
          desc: `Authorize full refund of ${booking?.totalAmount} back to ${booking?.paymentMethod} (${booking?.transactionId}).`,
          icon: <RotateCcw className="w-6 h-6 text-amber-600" />,
          btnText: 'Process Full Refund',
          btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
        };
      case 'bulk_confirm':
        return {
          title: `Confirm ${selectedCount} Selected Bookings?`,
          desc: `This will mark all ${selectedCount} selected bookings as confirmed and trigger confirmation emails.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          btnText: 'Confirm All Selected',
          btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
        };
      case 'bulk_cancel':
        return {
          title: `Cancel ${selectedCount} Selected Bookings?`,
          desc: `This will cancel all ${selectedCount} selected bookings. Please verify traveler cancellation terms.`,
          icon: <XCircle className="w-6 h-6 text-rose-600" />,
          btnText: 'Cancel All Selected',
          btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
        };
      case 'bulk_refund':
      default:
        return {
          title: `Refund ${selectedCount} Selected Bookings?`,
          desc: `This will initiate refunds for all ${selectedCount} selected bookings back to original payment methods.`,
          icon: <RotateCcw className="w-6 h-6 text-amber-600" />,
          btnText: 'Refund All Selected',
          btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
        };
    }
  };

  const content = getContent();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto shadow-2xs">
            {content.icon}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-black text-[#0F172A] tracking-tight">
              {content.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
              {content.desc}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 ${content.btnStyle}`}
            >
              {isProcessing && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isProcessing ? 'Processing...' : content.btnText}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
