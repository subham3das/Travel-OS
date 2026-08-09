import React from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface StickyPaymentBarProps {
  totalAmount: number;
  isDisabled: boolean;
  onOpenPriceBreakdown: () => void;
  isBreakdownOpen?: boolean;
  onPayClick: () => void;
  buttonText?: string;
}

export const StickyPaymentBar: React.FC<StickyPaymentBarProps> = ({
  totalAmount,
  isDisabled,
  onOpenPriceBreakdown,
  isBreakdownOpen = false,
  onPayClick,
  buttonText = 'Proceed to Payment',
}) => {
  return (
    <div className="sticky bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-100 shadow-2xl py-3.5 px-4 sm:px-6 flex items-center justify-between select-none">
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-4">
        {/* Left Section: Total Amount & Breakdown */}
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none pb-1">
            TOTAL PAYABLE
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight block leading-none pb-1">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
          <button
            type="button"
            onClick={onOpenPriceBreakdown}
            className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer focus:outline-none leading-none"
          >
            <span>View Price Breakdown</span>
            {isBreakdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#6356E5]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#6356E5]" />
            )}
          </button>
        </div>

        {/* Right Section: Primary CTA Button */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={onPayClick}
          className={`h-12 sm:h-13 px-6 rounded-2xl font-extrabold text-sm sm:text-base shadow-md transition-all focus:outline-none flex items-center justify-center gap-2 shrink-0 ${
            isDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#6356E5] hover:bg-[#5245d6] text-white shadow-[#6356E5]/25 cursor-pointer active:scale-[0.98]'
          }`}
        >
          <span className="whitespace-nowrap font-black tracking-tight">{buttonText}</span>
          <ArrowRight className="w-4 h-4 text-white shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default StickyPaymentBar;
