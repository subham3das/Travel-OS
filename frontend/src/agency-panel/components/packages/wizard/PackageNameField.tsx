import React from 'react';

interface PackageNameFieldProps {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}

export const PackageNameField: React.FC<PackageNameFieldProps> = ({
  value,
  onChange,
  maxLength = 100,
}) => {
  return (
    <div className="space-y-1.5 select-none">
      <div className="flex items-center justify-between">
        <label className="text-sm font-extrabold text-[#0F172A]">Package Name</label>
      </div>
      <p className="text-xs font-semibold text-slate-400">Enter a catchy and clear name for your package</p>

      <div className="relative pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder="Enter package name"
          maxLength={maxLength}
          className="w-full px-4 py-3.5 pr-20 rounded-2xl bg-white border border-slate-200/80 text-sm font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
};

export default PackageNameField;
