import React, { useEffect } from 'react';
import { X, Receipt, ShieldCheck, Tag, Users, CheckCircle2 } from 'lucide-react';

interface PriceSummaryProps {
  basePrice: number;
  travelerCount: number;
  insurancePrice: number;
  discountAmount: number;
  taxesAmount: number;
  grandTotal: number;
  onClose: () => void;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  basePrice,
  travelerCount,
  insurancePrice,
  discountAmount,
  taxesAmount,
  grandTotal,
  onClose,
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 select-none animate-in fade-in-0"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-100 space-y-5 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#583BE8]/10 text-[#583BE8] flex items-center justify-center font-bold shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-snug">
                Detailed Fare Breakdown
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                Transparent itemized summary
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer focus:outline-none shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Itemized Breakdown List */}
        <div className="space-y-3.5 text-xs sm:text-sm font-semibold">
          {/* Base Package Price */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Base Fare ({travelerCount} {travelerCount === 1 ? 'Traveler' : 'Travelers'})</span>
            </div>
            <span className="font-extrabold text-[#0F172A] text-sm sm:text-base">
              ₹{basePrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Travel Insurance */}
          {insurancePrice > 0 && (
            <div className="flex justify-between items-center py-1 text-sky-700 bg-sky-50/70 border border-sky-100 px-3 py-2 rounded-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span className="font-bold">Travel Protection ({travelerCount} × ₹499)</span>
              </div>
              <span className="font-extrabold text-sky-700">+₹{insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* Taxes & Fees */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2 text-slate-600">
              <Receipt className="w-4 h-4 text-slate-400" />
              <span>GST & Convenience Taxes (5%)</span>
            </div>
            <span className="font-extrabold text-[#0F172A]">
              +₹{taxesAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Coupon Discount */}
          {discountAmount > 0 && (
            <div className="flex justify-between items-center bg-emerald-50/80 border border-emerald-200/80 px-3 py-2.5 rounded-2xl text-emerald-800">
              <div className="flex items-center gap-2 font-extrabold">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Promo Discount Applied</span>
              </div>
              <span className="font-black text-emerald-700 text-sm sm:text-base">
                -₹{discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Grand Total Box */}
        <div className="bg-gradient-to-br from-[#583BE8]/5 via-[#583BE8]/10 to-indigo-50/40 border border-[#583BE8]/20 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                Grand Total
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#583BE8]" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 pt-0.5">
              Includes all taxes & fees
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-[#583BE8] tracking-tight leading-none block">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Done / Close CTA */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold text-sm transition-all cursor-pointer focus:outline-none shadow-md active:scale-[0.99]"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
};

export default PriceSummary;
