import React from 'react';
import { DetailedPackage } from '../../../data/packageDetails';
import { IndianRupee } from 'lucide-react';

interface PricingOverviewProps {
  pkg: DetailedPackage;
}

export const PricingOverview: React.FC<PricingOverviewProps> = ({ pkg }) => {
  const taxAmount = Math.round((pkg.price * pkg.taxesPercent) / 100);
  const finalPriceWithTax = pkg.price + taxAmount;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <h3 className="text-sm sm:text-lg font-black text-[#0F172A] flex items-center gap-2 truncate">
        <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#583BE8] shrink-0" />
        <span className="truncate">Pricing & Commercial Breakdown</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Base Pricing Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-1 min-w-0">
          <span className="text-[10px] font-bold text-purple-800 uppercase block truncate">Base Price / Person</span>
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="text-lg sm:text-2xl font-black text-[#583BE8] truncate">
              ₹{pkg.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-slate-400 line-through truncate">
              ₹{pkg.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-purple-900 truncate">{pkg.pricingModel}</p>
        </div>

        {/* Taxes & Fees */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 min-w-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">GST & Taxes ({pkg.taxesPercent}%)</span>
          <span className="text-lg sm:text-xl font-black text-slate-800 truncate block">₹{taxAmount.toLocaleString('en-IN')}</span>
          <p className="text-[11px] font-bold text-slate-500 truncate">Standard statutory tax rate</p>
        </div>

        {/* Total Final Payable */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-1 min-w-0">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block truncate">Net Price Incl. GST</span>
          <span className="text-lg sm:text-2xl font-black text-emerald-700 truncate block">
            ₹{finalPriceWithTax.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] font-extrabold text-emerald-900 truncate">Per Traveler Total</p>
        </div>
      </div>
    </div>
  );
};

export default PricingOverview;
