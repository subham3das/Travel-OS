import React from 'react';
import { Calendar, CheckCircle2, XCircle, Image as ImageIcon, ShoppingBag, HelpCircle } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const PackageStatisticsGrid: React.FC = () => {
  const { draft } = usePackageWizard();

  const daysCount = draft?.step2?.days || 7;
  const inclusionsCount =
    (draft?.step6?.includedItems?.length || 0) + (draft?.step6?.customIncludedItems?.length || 0);
  const exclusionsCount =
    (draft?.step6?.excludedItems?.length || 0) + (draft?.step6?.customExcludedItems?.length || 0);
  const galleryCount = draft?.step5?.galleryImages?.length || 0;
  const addOnsCount = (draft?.step6?.optionalAddOns || []).filter((a) => a.enabled).length;
  const faqsCount = draft?.step7?.faqs?.length || 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex-1">
      <h3 className="text-base font-black text-[#0F172A]">Package Statistics</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Duration */}
        <div className="p-3.5 rounded-2xl bg-purple-50/40 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0F172A]">{daysCount} Days</p>
            <p className="text-[10px] font-semibold text-slate-400">Duration</p>
          </div>
        </div>

        {/* Inclusions */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0F172A]">{inclusionsCount}</p>
            <p className="text-[10px] font-semibold text-slate-400">Inclusions</p>
          </div>
        </div>

        {/* Exclusions */}
        <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0F172A]">{exclusionsCount}</p>
            <p className="text-[10px] font-semibold text-slate-400">Exclusions</p>
          </div>
        </div>

        {/* Gallery Photos */}
        <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0F172A]">{galleryCount}</p>
            <p className="text-[10px] font-semibold text-slate-400">Gallery Photos</p>
          </div>
        </div>

        {/* Add-ons */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0F172A]">{addOnsCount}</p>
            <p className="text-[10px] font-semibold text-slate-400">Add-ons</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="p-3.5 rounded-2xl bg-purple-50/40 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0F172A]">{faqsCount}</p>
            <p className="text-[10px] font-semibold text-slate-400">FAQs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageStatisticsGrid;
