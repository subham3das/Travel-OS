import React from 'react';
import { ChevronDown, Shield } from 'lucide-react';
import { CancellationPolicy, CANCELLATION_POLICIES } from '../../../../data/pricing';

interface CancellationPolicySelectorProps {
  cancellationPolicy: CancellationPolicy;
  onChange: (policy: CancellationPolicy) => void;
}

export const CancellationPolicySelector: React.FC<CancellationPolicySelectorProps> = ({
  cancellationPolicy,
  onChange,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 select-none">
      <label className="text-xs font-extrabold text-[#0F172A]">
        Cancellation Policy <span className="text-rose-500">*</span>
      </label>

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#583BE8] pointer-events-none">
          <Shield className="w-4 h-4" />
        </div>
        <select
          value={cancellationPolicy}
          onChange={(e) => onChange(e.target.value as CancellationPolicy)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F172A] appearance-none focus:outline-none focus:border-[#583BE8] cursor-pointer"
        >
          {CANCELLATION_POLICIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default CancellationPolicySelector;
