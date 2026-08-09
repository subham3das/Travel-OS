import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { HEALTH_SAFETY_CONFIG } from '../../../../data/policies';

export const HealthSafetySection: React.FC = () => {
  const { draft, toggleHealthSafety } = usePackageWizard();

  const selectedHealthSafety = draft?.step7?.healthSafety || [];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="space-y-0.5">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">Health & Safety</h3>
        <p className="text-xs font-semibold text-slate-400">Important safety information</p>
      </div>

      <div className="space-y-2 pt-1">
        {HEALTH_SAFETY_CONFIG.map((item) => {
          const isSelected = selectedHealthSafety.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleHealthSafety(item)}
              className={`w-full p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/70 border-[#583BE8]/60 text-[#583BE8]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  className={`w-4 h-4 ${isSelected ? 'text-[#583BE8]' : 'text-slate-300'}`}
                />
                <span>{item}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HealthSafetySection;
