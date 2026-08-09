import React from 'react';
import { FileText, Shield, Navigation, UserCheck, Fuel, Check } from 'lucide-react';
import { PricingInclusion, PRICING_INCLUSIONS_CONFIG } from '../../../../data/pricing';

interface PricingIncludesSelectorProps {
  inclusions: PricingInclusion[];
  onChange: (inclusions: PricingInclusion[]) => void;
}

export const PricingIncludesSelector: React.FC<PricingIncludesSelectorProps> = ({
  inclusions,
  onChange,
}) => {
  const toggleInclusion = (inc: PricingInclusion) => {
    if (inclusions.includes(inc)) {
      onChange(inclusions.filter((i) => i !== inc));
    } else {
      onChange([...inclusions, inc]);
    }
  };

  const getInclusionIcon = (inc: PricingInclusion) => {
    switch (inc) {
      case 'GST Included':
        return <FileText className="w-4 h-4 text-[#583BE8]" />;
      case 'Permit Charges':
        return <Shield className="w-4 h-4 text-[#583BE8]" />;
      case 'Toll Included':
        return <Navigation className="w-4 h-4 text-[#583BE8]" />;
      case 'Driver Charges':
        return <UserCheck className="w-4 h-4 text-[#583BE8]" />;
      case 'Fuel Charges':
        return <Fuel className="w-4 h-4 text-[#583BE8]" />;
    }
  };

  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Pricing Includes</label>
      <p className="text-xs font-semibold text-slate-400">
        Select what is included in your package price
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        {PRICING_INCLUSIONS_CONFIG.map(({ id, label }) => {
          const isSelected = inclusions.includes(id);

          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleInclusion(id)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/60 border-[#583BE8] text-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {getInclusionIcon(id)}
                <span className="text-xs font-black truncate">{label}</span>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#583BE8] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PricingIncludesSelector;
