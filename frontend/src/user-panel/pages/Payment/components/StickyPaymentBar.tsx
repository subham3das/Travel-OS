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
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100/90 shadow-2xl py-3 px-4 sm:px-6 flex items-center justify-center select-none">
      <div className="w-full max-w-3xl flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Section: Total Amount */}
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            TOTAL PAYABLE
          </span>
          <span className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight block">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
          <button
            type="button"
            onClick={onOpenPriceBreakdown}
            className="text-[11px] font-extrabold text-[#583BE8] hover:underline flex items-center gap-0.5 cursor-pointer focus:outline-none"
          >
            <span>Breakdown</span>
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
          className={`h-12 sm:h-14 px-4 sm:px-6 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all focus:outline-none flex items-center justify-center gap-2 shrink-0 ${
            isDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#583BE8] hover:bg-[#472bd1] text-white shadow-[#583BE8]/25 cursor-pointer active:scale-[0.98]'
          }`}
        >
          <Lock className="w-4 h-4 text-white shrink-0" />
          <span className="whitespace-nowrap font-black tracking-tight">
            Pay ₹{totalAmount.toLocaleString('en-IN')} Securely
          </span>
          <ArrowRight className="w-4 h-4 text-white shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default StickyPaymentBar;
