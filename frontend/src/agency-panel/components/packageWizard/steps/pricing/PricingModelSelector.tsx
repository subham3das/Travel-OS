import React from 'react';
import { User, Heart, Users, Tag } from 'lucide-react';
import { PricingModel } from '../../../../data/pricing';

interface PricingModelSelectorProps {
  value: PricingModel;
  onChange: (model: PricingModel) => void;
}

const MODELS_CONFIG: { model: PricingModel; icon: React.ReactNode }[] = [
  { model: 'Price Per Person', icon: <User className="w-5 h-5" /> },
  { model: 'Price Per Couple', icon: <Heart className="w-5 h-5" /> },
  { model: 'Group Pricing', icon: <Users className="w-5 h-5" /> },
  { model: 'Custom Pricing', icon: <Tag className="w-5 h-5" /> },
];

export const PricingModelSelector: React.FC<PricingModelSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">
        Pricing Model <span className="text-rose-500">*</span>
      </label>
      <p className="text-xs font-semibold text-slate-400">
        Choose how you want to price this package
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {MODELS_CONFIG.map(({ model, icon }) => {
          const isSelected = value === model;

          return (
            <button
              key={model}
              type="button"
              onClick={() => onChange(model)}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-purple-50/50 border-[#583BE8] text-[#583BE8] shadow-md shadow-[#583BE8]/10 scale-[1.02]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  isSelected ? 'bg-purple-100/70 text-[#583BE8]' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {icon}
              </div>
              <span className="text-xs font-black text-center">{model}</span>

              <div
                className={`absolute top-3 right-3 w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected
                    ? 'border-[#583BE8] bg-[#583BE8] text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PricingModelSelector;
