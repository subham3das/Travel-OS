import React from 'react';
import { CheckCircle2, XCircle, ShoppingBag, Star } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const QuickPreviewCard: React.FC = () => {
  const { draft } = usePackageWizard();

  const step6 = draft?.step6;

  const totalInclusions =
    (step6?.includedItems?.length || 0) + (step6?.customIncludedItems?.length || 0);

  const totalExclusions =
    (step6?.excludedItems?.length || 0) + (step6?.customExcludedItems?.length || 0);

  const totalPacking =
    (step6?.packingItems?.length || 0) + (step6?.customPackingItems?.length || 0);

  const totalAddOns = (step6?.optionalAddOns || []).filter((a) => a.enabled).length;

  return (
    <div className="bg-[#F8F9FE] rounded-3xl p-5 border border-purple-100 space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-[#0F172A] tracking-tight">Quick Preview</h4>
        <span className="text-[11px] font-bold text-[#583BE8]">Review your selections</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Inclusions */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-[#0F172A]">{totalInclusions}</p>
            <p className="text-[10px] font-bold text-slate-400">Inclusions</p>
          </div>
        </div>

        {/* Exclusions */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-[#0F172A]">{totalExclusions}</p>
            <p className="text-[10px] font-bold text-slate-400">Exclusions</p>
          </div>
        </div>

        {/* Packing Items */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-[#0F172A]">{totalPacking}</p>
            <p className="text-[10px] font-bold text-slate-400">Packing Items</p>
          </div>
        </div>

        {/* Add-ons */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <div>
            <p className="text-sm font-black text-[#0F172A]">{totalAddOns}</p>
            <p className="text-[10px] font-bold text-slate-400">Add-ons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPreviewCard;
