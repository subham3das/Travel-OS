import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface InsuranceSummaryProps {
  insurancePrice?: number;
}

export const InsuranceSummary: React.FC<InsuranceSummaryProps> = ({ insurancePrice = 998 }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Travel Insurance</h3>
          <p className="text-[11px] font-semibold text-emerald-600">Added</p>
        </div>
      </div>

      <span className="text-xs sm:text-sm font-black text-[#0F172A]">
        ₹{insurancePrice.toLocaleString('en-IN')}
      </span>
    </div>
  );
};
