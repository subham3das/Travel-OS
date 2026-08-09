import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Receipt } from 'lucide-react';

interface PriceBreakdownProps {
  packagePrice?: number;
  taxes?: number;
  insurancePrice?: number;
  discountAmount?: number;
  totalAmount?: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  packagePrice = 24998,
  taxes = 1499,
  insurancePrice = 998,
  discountAmount = 2000,
  totalAmount = 25495,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-[#6356E5]" />
          </div>
          <h2 className="text-base font-black text-[#0F172A] tracking-tight">
            Price Breakdown
          </h2>
        </div>

        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-medium text-slate-600 border-t border-slate-100">
          <div className="flex justify-between items-center pt-2">
            <span>Package Price</span>
            <span className="font-extrabold text-[#0F172A]">₹{packagePrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Taxes & Fees</span>
            <span className="font-extrabold text-[#0F172A]">₹{taxes.toLocaleString('en-IN')}</span>
          </div>

          {insurancePrice > 0 && (
            <div className="flex justify-between items-center">
              <span>Travel Insurance (2 Travelers)</span>
              <span className="font-extrabold text-[#0F172A]">₹{insurancePrice.toLocaleString('en-IN')}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-extrabold">
              <span>Coupon Discount</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-extrabold text-[#0F172A]">Total Amount</span>
            <span className="text-xl sm:text-2xl font-black text-[#0F172A]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
