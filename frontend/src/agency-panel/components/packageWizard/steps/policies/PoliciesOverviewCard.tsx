import React from 'react';
import { ShieldCheck, HelpCircle, FileCheck, FolderCheck, PhoneCall } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const PoliciesOverviewCard: React.FC = () => {
  const { draft } = usePackageWizard();

  const step7 = draft?.step7;

  const cancellationPolicy = step7?.cancellationPolicy || 'Moderate';
  const faqCount = step7?.faqs?.length || 0;
  const bookingRulesCount = step7?.bookingTerms?.length || 0;
  const docsCount = (step7?.requiredDocuments?.length || 0) + (step7?.customDocuments?.length || 0);
  const emergencyAdded = Boolean(step7?.emergencyContact?.phone);

  return (
    <div className="bg-[#F8F9FE] rounded-3xl p-5 border border-purple-100 space-y-3 select-none">
      <h4 className="text-xs font-black text-[#0F172A] tracking-tight">Quick Overview</h4>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {/* Cancellation Policy */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[#0F172A] truncate">{cancellationPolicy}</p>
            <p className="text-[9px] font-bold text-slate-400 truncate">Cancellation Policy</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[#0F172A]">{faqCount}</p>
            <p className="text-[9px] font-bold text-slate-400 truncate">FAQs</p>
          </div>
        </div>

        {/* Booking Rules */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[#0F172A]">{bookingRulesCount}</p>
            <p className="text-[9px] font-bold text-slate-400 truncate">Booking Rules</p>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FolderCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[#0F172A]">{docsCount}</p>
            <p className="text-[9px] font-bold text-slate-400 truncate">Documents</p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-[#0F172A] truncate">
              {emergencyAdded ? 'Added' : 'Missing'}
            </p>
            <p className="text-[9px] font-bold text-slate-400 truncate">Emergency Contact</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesOverviewCard;
