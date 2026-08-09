import React from 'react';
import { Lock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface StickyPaymentBarProps {
  totalAmount: number;
  isDisabled: boolean;
  onOpenPriceBreakdown: () => void;
  isBreakdownOpen?: boolean;
  onPayClick: () => void;
}

export const StickyPaymentBar: React.FC<StickyPaymentBarProps> = ({
  totalAmount,
  isDisabled,
  onOpenPriceBreakdown,
  isBreakdownOpen = false,
  onPayClick,
}) => {
  return (
    <div className="sticky bottom-3 z-40 bg-white rounded-3xl p-4 sm:p-5 border border-purple-100 shadow-xl shadow-purple-500/10 my-4 select-none">
      <div className="w-full flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Section: Total Amount */}
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block leading-tight">
            TOTAL PAYABLE
          </span>
          <span className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight block leading-tight">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
          <button
            type="button"
            onClick={onOpenPriceBreakdown}
            className="text-[11px] font-extrabold text-[#583BE8] hover:underline flex items-center gap-0.5 cursor-pointer focus:outline-none pt-0.5"
          >
            <span>View Breakdown</span>
            {isBreakdownOpen ? (
              <ChevronUp className="w-3 h-3 text-[#583BE8]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#583BE8]" />
            )}
          </button>
        </div>

        {/* Right Section: Primary CTA Button */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={onPayClick}
          className={`h-12 sm:h-13 px-4 sm:px-6 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all focus:outline-none flex items-center justify-center gap-2 shrink-0 ${
            isDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#583BE8] hover:bg-[#472bd1] text-white shadow-[#583BE8]/25 cursor-pointer active:scale-[0.98]'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-white shrink-0" />
          <span className="whitespace-nowrap font-black tracking-tight">
            Pay ₹{totalAmount.toLocaleString('en-IN')}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default StickyPaymentBar;
