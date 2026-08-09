import React from 'react';

interface DescriptionFieldProps {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({
  value,
  onChange,
  maxLength = 150,
}) => {
  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Short Description</label>
      <p className="text-xs font-semibold text-slate-400">Briefly describe what makes this package special</p>

      <div className="relative pt-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder="Briefly describe your travel package."
          maxLength={maxLength}
          rows={3}
          className="w-full px-4 py-3.5 pb-8 rounded-2xl bg-white border border-slate-200/80 text-sm font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors resize-none"
        />
        <span className="absolute right-4 bottom-3 text-xs font-bold text-slate-400 pointer-events-none">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
};

export default DescriptionField;
