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
    <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-soft hover:shadow-soft-lg transition-all space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-[#0F172A] tracking-tight">
            Razorpay Secure Checkout
          </h2>
          <p className="text-[11px] font-semibold text-slate-400">
            UPI, Credit/Debit Cards, Net Banking & Wallets
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-[#0C2340]/5 border border-[#0C2340]/10 flex items-center gap-1 text-[#0C2340] text-xs font-black tracking-tight shrink-0">
          <span>Razorpay</span>
        </div>
      </div>

      {/* 3 Trust Badges */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5 text-[11px] font-extrabold">
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
          <CreditCard className="w-4 h-4 text-[#6356E5] shrink-0" />
          <span>All Payment Options</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>100% Encrypted</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Instant Booking</span>
        </div>
      </div>

      {/* Main Pay Button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={onPayClick}
        className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none ${
          isDisabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-[#6356E5] hover:bg-[#5245d6] text-white shadow-[#6356E5]/25 active:scale-[0.99]'
        }`}
      >
        <Lock className="w-4 h-4 text-white shrink-0" />
        <span>Pay ₹{totalAmount.toLocaleString('en-IN')} Securely</span>
        <ArrowRight className="w-4 h-4 text-white shrink-0" />
      </button>

      <p className="text-[11px] font-semibold text-slate-400 text-center">
        🔒 Encrypted with 256-bit SSL banking grade security
      </p>
    </div>
  );
};

export default RazorpayCard;
