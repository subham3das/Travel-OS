import React, { useState } from 'react';
import { Tag, CheckCircle2 } from 'lucide-react';

interface CouponCardProps {
  appliedCoupon: string | null;
  discountAmount: number;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  appliedCoupon,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const success = onApplyCoupon(code);
    if (!success) {
      setErrorMsg('Invalid coupon code. Try APNATRIP10 or WELCOME20');
    } else {
      setErrorMsg('');
      setCode('');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Have a Coupon Code?</h3>
            {appliedCoupon ? (
              <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                Code "{appliedCoupon}" applied! Saved ₹{discountAmount}
              </p>
            ) : (
              <p className="text-[11px] font-semibold text-slate-400">Use code APNATRIP10 for 10% off</p>
            )}
          </div>
        </div>

        {appliedCoupon && (
          <button
            onClick={onRemoveCoupon}
            className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>

      {!appliedCoupon && (
        <form onSubmit={handleApply} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setErrorMsg('');
            }}
            placeholder="Enter code"
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-extrabold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer focus:outline-none shrink-0"
          >
            Apply
          </button>
        </form>
      )}

      {errorMsg && <p className="text-[10px] font-bold text-rose-500">{errorMsg}</p>}
    </div>
  );
};
