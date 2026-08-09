import React from 'react';

interface ExtraChargesState {
  singleOccupancy: boolean;
  childPrice: boolean;
  extraBed: boolean;
  peakSeasonSurcharge: boolean;
}

interface ExtraChargesSectionProps {
  extraCharges: ExtraChargesState;
  onChange: (key: keyof ExtraChargesState) => void;
}

export const ExtraChargesSection: React.FC<ExtraChargesSectionProps> = ({
  extraCharges,
  onChange,
}) => {
  const CHARGES_CONFIG = [
    { key: 'singleOccupancy' as const, label: 'Single Occupancy' },
    { key: 'childPrice' as const, label: 'Child Price' },
    { key: 'extraBed' as const, label: 'Extra Bed' },
    { key: 'peakSeasonSurcharge' as const, label: 'Peak Season Surcharge' },
  ];

  return (
    <div className="space-y-3 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Extra Charges <span className="text-xs font-semibold text-slate-400">(Optional)</span>
      </label>
      <p className="text-xs font-semibold text-slate-400">
        Add any additional charges that may apply
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CHARGES_CONFIG.map(({ key, label }) => {
          const isActive = extraCharges[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-50 border-[#583BE8] text-[#583BE8]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <span>{label}</span>
              <span
                className={`w-6 h-3.5 rounded-full flex items-center transition-all ${
                  isActive ? 'bg-[#583BE8] justify-end' : 'bg-slate-200 justify-start'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white mx-0.5 shadow-xs" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExtraChargesSection;
