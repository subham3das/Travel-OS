import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface UserBookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData?: {
    id: string;
    packageName: string;
    coverImage: string;
    departureDate: string;
    returnDate: string;
    travelerCount: number;
    packagePrice: number;
    amountPaid: number;
    dueDate: string;
  };
}

export const UserBookingDetailsModal: React.FC<UserBookingDetailsModalProps> = ({
  isOpen,
  onClose,
  bookingData = {
    id: 'BK-2024-00568',
    packageName: 'Ladakh Adventure Expedition',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
    departureDate: '15 Jun 2024',
    returnDate: '22 Jun 2024',
    travelerCount: 2,
    packagePrice: 18999,
    amountPaid: 37998, // fully paid
    dueDate: '10 Jun 2024',
  },
}) => {
  const { showToast } = useToast();
  const [amountPaidState, setAmountPaidState] = useState(bookingData.amountPaid);
  const totalAmount = bookingData.packagePrice * bookingData.travelerCount;
  const remainingBalance = Math.max(0, totalAmount - amountPaidState);
  const isFullyPaid = remainingBalance === 0;
  const progressPct = Math.round((amountPaidState / totalAmount) * 100);

  if (!isOpen) return null;

  const handlePayNow = () => {
    setAmountPaidState(totalAmount);
    showToast('Payment successful! Your booking is now fully paid and confirmed.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-100 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400">Booking Details</span>
            <h3 className="text-base font-black text-[#0F172A]">{bookingData.id}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Package Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <img
            src={bookingData.coverImage}
            alt={bookingData.packageName}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-black text-[#0F172A] truncate">{bookingData.packageName}</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{bookingData.departureDate} – {bookingData.returnDate}</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-3 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs font-bold">
          <div className="flex justify-between">
            <span className="text-slate-500">Package Price</span>
            <span className="text-[#0F172A] font-black">₹{bookingData.packagePrice.toLocaleString('en-IN')} / person</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Total Amount ({bookingData.travelerCount} Persons)</span>
            <span className="text-[#0F172A] font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Amount Paid</span>
            <span className="text-emerald-600 font-black">₹{amountPaidState.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between pt-1 border-t border-purple-100">
            <span className="text-slate-600">Remaining Balance</span>
            <span className={`font-black ${remainingBalance > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              ₹{remainingBalance.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Payment Progress Bar */}
          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-[11px] font-extrabold">
              <span className="text-slate-600">Payment Status</span>
              <span className="text-[#583BE8]">{progressPct}% Paid</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isFullyPaid ? 'bg-emerald-500' : 'bg-[#583BE8]'}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Full Payment Completed Eligibility Badge */}
        {isFullyPaid ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-black text-emerald-700 block">Payment Complete ✓</span>
              <span className="text-[11px]">You're eligible for your trip. Your ticket is confirmed.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handlePayNow}
              className="w-full py-3.5 rounded-2xl bg-[#FF4D6D] hover:bg-[#e03d5c] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D6D]/25 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Remaining ₹{remainingBalance.toLocaleString('en-IN')} Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-black hover:bg-slate-50 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserBookingDetailsModal;
