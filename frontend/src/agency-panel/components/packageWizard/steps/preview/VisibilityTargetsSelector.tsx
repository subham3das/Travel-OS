import React from 'react';
import { Check } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const VisibilityTargetsSelector: React.FC = () => {
  const { draft, toggleVisibilityTarget } = usePackageWizard();

  const targets = ['Website', 'Mobile App', 'Featured Packages', 'Homepage', 'Partner Agencies'];
  const selectedTargets = draft?.step8?.visibilityTargets || ['Website', 'Mobile App', 'Featured Packages', 'Homepage'];

  return (
    <div className="space-y-2 select-none">
      <div className="space-y-0.5">
        <label className="text-sm font-extrabold text-[#0F172A]">Package Visibility</label>
        <p className="text-xs font-semibold text-slate-400">Where would you like to show this package?</p>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        {targets.map((target) => {
          const isSelected = selectedTargets.includes(target);

          return (
            <button
              key={target}
              type="button"
              onClick={() => toggleVisibilityTarget(target)}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/80 border-[#583BE8] text-[#583BE8] shadow-2xs'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#583BE8] text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>{target}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VisibilityTargetsSelector;
