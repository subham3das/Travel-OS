import React from 'react';
import { Edit3, Calendar, CheckCircle2 } from 'lucide-react';
import { PackageVisibility } from '../../../types/packageWizard';

interface VisibilitySelectorProps {
  value: PackageVisibility;
  onChange: (vis: PackageVisibility) => void;
}

export const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Trip Visibility</label>
      <p className="text-xs font-semibold text-slate-400">Choose the visibility of this package</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Draft Option */}
        <button
          type="button"
          onClick={() => onChange('Draft')}
          className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
            value === 'Draft'
              ? 'bg-purple-50/50 border-[#583BE8] shadow-md shadow-[#583BE8]/10'
              : 'bg-white border-slate-200/80 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                value === 'Draft' ? 'bg-purple-100 text-[#583BE8]' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">Draft</p>
              <p className="text-[11px] font-semibold text-slate-400">Save as draft and publish later</p>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
              value === 'Draft'
                ? 'border-[#583BE8] bg-[#583BE8] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {value === 'Draft' && <CheckCircle2 className="w-3.5 h-3.5 fill-white stroke-[#583BE8]" />}
          </div>
        </button>

        {/* Publish Later Option */}
        <button
          type="button"
          onClick={() => onChange('Publish Later')}
          className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
            value === 'Publish Later'
              ? 'bg-purple-50/50 border-[#583BE8] shadow-md shadow-[#583BE8]/10'
              : 'bg-white border-slate-200/80 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                value === 'Publish Later' ? 'bg-purple-100 text-[#583BE8]' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">Publish Later</p>
              <p className="text-[11px] font-semibold text-slate-400">Complete all steps and publish later</p>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
              value === 'Publish Later'
                ? 'border-[#583BE8] bg-[#583BE8] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {value === 'Publish Later' && <CheckCircle2 className="w-3.5 h-3.5 fill-white stroke-[#583BE8]" />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default VisibilitySelector;
