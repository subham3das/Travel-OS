import React from 'react';
import { calculatePricingSummary } from '../../../../utils/pricingCalculations';

interface PriceSummaryCardProps {
  originalPrice: number;
  discountedPrice: number;
  advanceAmount: number;
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  originalPrice,
  discountedPrice,
  advanceAmount,
}) => {
  const { savingsAmount, estimatedTax, finalPrice } = calculatePricingSummary(
    originalPrice,
    discountedPrice,
    advanceAmount
  );

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 space-y-2.5 shadow-2xs select-none">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">Price Summary</h4>

      <div className="space-y-1.5 text-xs font-semibold text-slate-600">
        <div className="flex justify-between">
          <span>Base Price (Per Person)</span>
          <span className="font-bold text-[#0F172A]">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {savingsAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Discount</span>
            <span>- ₹{savingsAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Advance Required</span>
          <span className="font-bold text-[#0F172A]">
            ₹{advanceAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Estimated Taxes (5%)</span>
          <span className="font-bold text-[#0F172A]">
            ₹{estimatedTax.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-black text-[#0F172A]">
        <span>Final Price (Per Person)</span>
        <span className="text-[#583BE8] text-base">
          ₹{finalPrice.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
};

export default PriceSummaryCard;
