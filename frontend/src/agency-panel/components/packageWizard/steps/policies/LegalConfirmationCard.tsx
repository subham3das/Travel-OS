import React from 'react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const LegalConfirmationCard: React.FC = () => {
  const { draft, updateStep7 } = usePackageWizard();

  const isConfirmed = draft?.step7?.legalConfirmed ?? true;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Legal Agreement <span className="text-rose-500">*</span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => updateStep7({ legalConfirmed: e.target.checked })}
          className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#583BE8] focus:ring-[#583BE8] cursor-pointer"
        />
        <span className="text-xs font-semibold text-slate-600 leading-relaxed">
          I confirm that all package details, policies, inclusions, and information provided are accurate and complete.
        </span>
      </label>
    </div>
  );
};

export default LegalConfirmationCard;
