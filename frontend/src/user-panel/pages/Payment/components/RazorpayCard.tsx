import React from 'react';
import { Lock, ShieldCheck, Zap, CreditCard, ArrowRight } from 'lucide-react';

interface RazorpayCardProps {
  totalAmount: number;
  isDisabled: boolean;
  onPayClick: () => void;
}

export const RazorpayCard: React.FC<RazorpayCardProps> = ({
  totalAmount,
  isDisabled,
  onPayClick,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-[#0F172A] tracking-tight">
          Pay Securely with Razorpay
        </h2>
        <div className="flex items-center gap-1 text-slate-800 text-sm font-black tracking-tight italic">
          <span className="text-[#0C2340] font-black tracking-tighter text-base">Razorpay</span>
        </div>
      </div>

      {/* 3 Badges */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2 text-[11px] font-extrabold text-slate-600">
        <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-50 border border-slate-100">
          <CreditCard className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Multiple Payment Options</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-50 border border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>100% Secure Payments</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-50 border border-slate-100">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Instant Confirmation</span>
        </div>
      </div>

      {/* Main Pay Button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={onPayClick}
        className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none ${
          isDisabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-[#6356E5] hover:bg-[#5245d6] text-white shadow-[#6356E5]/25'
        }`}
      >
        <Lock className="w-4 h-4" />
        <span>Pay ₹{totalAmount.toLocaleString('en-IN')} Securely</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-[11px] font-semibold text-slate-400 text-center">
        You will be redirected to Razorpay Secure Checkout
      </p>
    </div>
  );
};
