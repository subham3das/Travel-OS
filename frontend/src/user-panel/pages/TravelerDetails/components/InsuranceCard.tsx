import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface InsuranceCardProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  pricePerTraveler?: number;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  isEnabled,
  onToggle,
  pricePerTraveler = 499,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Travel Insurance</h3>
          <p className="text-[11px] font-semibold text-slate-400">
            ₹{pricePerTraveler} per traveler
          </p>
        </div>
      </div>

      {/* Toggle Switch */}
      <button
        type="button"
        onClick={() => onToggle(!isEnabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isEnabled ? 'bg-[#6356E5]' : 'bg-slate-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            isEnabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
