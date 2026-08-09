import React from 'react';
import { Info } from 'lucide-react';

export const PricingInfoCard: React.FC = () => {
  return (
    <div className="bg-purple-50/50 rounded-3xl p-5 border border-purple-100 flex items-start gap-3 select-none">
      <div className="w-8 h-8 rounded-full bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0 mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-extrabold text-[#583BE8]">Estimated Summary Notice</p>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          This is an estimated summary. Final amount may vary based on taxes and other charges.
        </p>
      </div>
    </div>
  );
};

export default PricingInfoCard;
