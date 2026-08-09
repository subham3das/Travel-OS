import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const CompletionChecklist: React.FC = () => {
  const {
    goToStep,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    isStep5Valid,
    isStep6Valid,
    isStep7Valid,
    isAllStepsValid,
  } = usePackageWizard();

  const steps = [
    { num: 1, label: 'Basic Information', isValid: isStep1Valid },
    { num: 2, label: 'Destination', isValid: isStep2Valid },
    { num: 3, label: 'Pricing', isValid: isStep3Valid },
    { num: 4, label: 'Itinerary', isValid: isStep4Valid },
    { num: 5, label: 'Gallery & Media', isValid: isStep5Valid },
    { num: 6, label: 'Inclusions & Exclusions', isValid: isStep6Valid },
    { num: 7, label: 'Policies, FAQs & Rules', isValid: isStep7Valid },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex-1">
      <h3 className="text-base font-black text-[#0F172A]">Completion Status</h3>

      <div className="space-y-2">
        {steps.map(({ num, label, isValid }) => (
          <button
            key={num}
            type="button"
            onClick={() => goToStep(num)}
            className="w-full flex items-center justify-between p-2.5 px-3 rounded-2xl hover:bg-purple-50/50 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2.5">
              {isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#583BE8] transition-colors">
                {label}
              </span>
            </div>
            {!isValid && (
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Needs Attention
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {isAllStepsValid ? (
          <div className="w-full py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-black text-center border border-emerald-200">
            100% Complete 🎉
          </div>
        ) : (
          <div className="w-full py-2.5 rounded-2xl bg-amber-50 text-amber-700 text-xs font-black text-center border border-amber-200">
            ⚠ Please review incomplete sections above
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletionChecklist;
