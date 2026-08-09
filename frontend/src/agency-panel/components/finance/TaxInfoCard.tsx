import React from 'react';
import { Percent, FileText } from 'lucide-react';
import { TaxInfo } from '../../data/finance';

interface TaxInfoCardProps {
  taxInfo: TaxInfo;
}

export const TaxInfoCard: React.FC<TaxInfoCardProps> = ({ taxInfo }) => {
  const handleDownloadGST = () => {
    alert('GST Compliance Statement & Report downloaded successfully!');
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
        <Percent className="w-4 h-4 text-purple-600" />
        <span>Tax Information</span>
      </h3>

      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase block truncate">GST Collected</span>
          <span className="text-xs sm:text-sm font-black text-[#0F172A] block truncate">{taxInfo.formattedGstCollected}</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase block truncate">Platform Fees</span>
          <span className="text-xs sm:text-sm font-black text-[#0F172A] block truncate">{taxInfo.formattedPlatformFees}</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase block truncate">Net Taxable</span>
          <span className="text-xs sm:text-sm font-black text-[#0F172A] block truncate">{taxInfo.formattedNetTaxableRevenue}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownloadGST}
        className="w-full py-3 rounded-2xl bg-purple-50/60 hover:bg-purple-100/60 border border-purple-200 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
      >
        <FileText className="w-4 h-4" />
        <span>Download GST Report</span>
      </button>
    </div>
  );
};

export default TaxInfoCard;
