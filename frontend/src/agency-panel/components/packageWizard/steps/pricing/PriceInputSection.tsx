import React from 'react';
import { ChevronDown, BadgePercent } from 'lucide-react';
import { calculatePricingSummary } from '../../../../utils/pricingCalculations';

interface PriceInputSectionProps {
  originalPrice: number;
  discountedPrice: number;
  onOriginalPriceChange: (val: number) => void;
  onDiscountedPriceChange: (val: number) => void;
}

export const PriceInputSection: React.FC<PriceInputSectionProps> = ({
  originalPrice,
  discountedPrice,
  onOriginalPriceChange,
  onDiscountedPriceChange,
}) => {
  const { savingsAmount, savingsPercentage } = calculatePricingSummary(
    originalPrice,
    discountedPrice
  );

  return (
    <div className="space-y-2 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Base Price</label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Original Price */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Original Price <span className="text-rose-500">*</span>
            </span>
            <span className="text-slate-400 font-bold">INR (₹)</span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
              ₹
            </span>
            <input
              type="number"
              min={0}
              value={originalPrice || ''}
              onChange={(e) => onOriginalPriceChange(parseInt(e.target.value) || 0)}
              placeholder="18,999"
              className="w-full pl-8 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200/80 text-sm font-black text-[#0F172A] focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Discounted Price */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Discounted Price (Optional)</span>
            <span className="text-slate-400 font-bold">INR (₹)</span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
              ₹
            </span>
            <input
              type="number"
              min={0}
              value={discountedPrice || ''}
              onChange={(e) => onDiscountedPriceChange(parseInt(e.target.value) || 0)}
              placeholder="16,999"
              className="w-full pl-8 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200/80 text-sm font-black text-[#0F172A] focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Savings Pill */}
      {savingsAmount > 0 && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center gap-2 text-xs font-extrabold text-emerald-700">
          <BadgePercent className="w-4 h-4 text-emerald-600" />
          <span>
            You Save ₹{savingsAmount.toLocaleString('en-IN')} ({savingsPercentage}%)
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceInputSection;
