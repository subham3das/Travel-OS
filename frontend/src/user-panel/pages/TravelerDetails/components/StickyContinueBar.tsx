import React from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface StickyContinueBarProps {
  grandTotal: number;
  isDisabled: boolean;
  onOpenPriceBreakdown: () => void;
  isBreakdownOpen?: boolean;
  onContinue: () => void;
}

export const StickyContinueBar: React.FC<StickyContinueBarProps> = ({
  grandTotal,
  isDisabled,
  onOpenPriceBreakdown,
  isBreakdownOpen = false,
  onContinue,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100/90 shadow-2xl h-[88px] px-5 py-4 flex items-center justify-center">
      <div className="w-full max-w-[768px] flex items-center justify-between gap-[24px]">
        {/* Left Section */}
        <div className="flex flex-col justify-center gap-[4px] shrink-0">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none">
            TOTAL PAYABLE
          </p>
          <p className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-none">
            ₹{grandTotal.toLocaleString('en-IN')}
          </p>
          <button
            type="button"
            onClick={onOpenPriceBreakdown}
            className="text-xs font-extrabold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer focus:outline-none leading-none pt-[2px]"
          >
            <span>View Price Breakdown</span>
            {isBreakdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#6356E5]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#6356E5]" />
            )}
          </button>
        </div>

        {/* Right Section: Continue Button */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={onContinue}
          className={`h-[56px] w-[62%] max-w-[320px] rounded-[16px] font-black text-xs sm:text-sm shadow-lg transition-all focus:outline-none flex items-center justify-center gap-[12px] shrink-0 ${
            isDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#6356E5] hover:bg-[#5245d6] text-white shadow-[#6356E5]/25 cursor-pointer'
          }`}
        >
          <span className="whitespace-nowrap font-black tracking-tight">Continue to Review</span>
          <ArrowRight className="w-4 h-4 text-white shrink-0" />
        </button>
      </div>
    </div>
  );
};
