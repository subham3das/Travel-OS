import React from 'react';
import { Tag } from 'lucide-react';

interface CouponSummaryProps {
  couponCode?: string;
  discountAmount?: number;
}

export const CouponSummary: React.FC<CouponSummaryProps> = ({
  couponCode = 'APNATRIP2000',
  discountAmount = 2000,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Coupon Applied</h3>
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[10px]">
            {couponCode}
          </span>
        </div>
      </div>

      <span className="text-xs sm:text-sm font-black text-emerald-600">
        -₹{discountAmount.toLocaleString('en-IN')}
      </span>
    </div>
  );
};
