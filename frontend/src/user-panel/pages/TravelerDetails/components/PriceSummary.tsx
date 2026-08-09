import React from 'react';
import { X } from 'lucide-react';

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
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-[#0F172A]">Detailed Price Breakdown</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex justify-between items-center">
            <span>Package Base Price ({travelerCount} Travelers)</span>
            <span className="font-extrabold text-[#0F172A]">₹{basePrice.toLocaleString('en-IN')}</span>
          </div>

          {insurancePrice > 0 && (
            <div className="flex justify-between items-center text-sky-700">
              <span>Travel Insurance ({travelerCount} × ₹499)</span>
              <span className="font-extrabold">+₹{insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span>GST & Service Taxes (5%)</span>
            <span className="font-extrabold text-[#0F172A]">+₹{taxesAmount.toLocaleString('en-IN')}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-extrabold">
              <span>Coupon Discount</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base font-black text-[#0F172A]">
            <span>Grand Total Payable</span>
            <span className="text-xl text-[#6356E5]">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
