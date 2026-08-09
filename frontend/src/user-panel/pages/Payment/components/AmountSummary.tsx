import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

interface AmountSummaryProps {
  packagePrice?: number;
  taxes?: number;
  insurancePrice?: number;
  discountAmount?: number;
  couponCode?: string;
  totalAmount?: number;
}

export const AmountSummary: React.FC<AmountSummaryProps> = ({
  packagePrice = 24998,
  taxes = 1499,
  insurancePrice = 998,
  discountAmount = 2000,
  couponCode = 'APNATRIP2000',
  totalAmount = 25495,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-[#0F172A] tracking-tight">
          Amount Summary
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>View Details</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3 pt-1 text-xs sm:text-sm font-semibold text-slate-600 border-t border-slate-100">
          <div className="flex justify-between items-center pt-2">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Package Price
            </span>
            <span className="font-extrabold text-[#0F172A]">₹{packagePrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              Taxes & Fees
            </span>
            <span className="font-extrabold text-[#0F172A]">₹{taxes.toLocaleString('en-IN')}</span>
          </div>

          {insurancePrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Travel Insurance (2 Travelers)
              </span>
              <span className="font-extrabold text-[#0F172A]">₹{insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-extrabold">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-500" />
                Coupon Discount ({couponCode})
              </span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm sm:text-base font-black text-[#0F172A]">Total Payable</span>
            <span className="text-xl sm:text-2xl font-black text-[#0F172A]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="mt-2 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-700 font-extrabold text-xs text-center flex items-center justify-center gap-2">
              <Tag className="w-4 h-4 fill-emerald-500 text-white" />
              <span>You are saving ₹{discountAmount.toLocaleString('en-IN')} on this booking</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
