import React from 'react';
import { Zap, RefreshCw, Clock, FileText } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { RefundProcessingType } from '../../../../data/policies';

export const RefundProcessingSelector: React.FC = () => {
  const { draft, updateStep7 } = usePackageWizard();

  const currentRefund = draft?.step7?.refundProcessing || 'Instant Refund';

  const options: { type: RefundProcessingType; title: string; subtitle?: string; icon: React.ReactNode }[] = [
    {
      type: 'Instant Refund',
      title: 'Instant Refund',
      subtitle: 'Within 24 hours',
      icon: <Zap className="w-4 h-4 text-[#583BE8]" />,
    },
    {
      type: '3-5 Business Days',
      title: '3–5 Business Days',
      icon: <RefreshCw className="w-4 h-4 text-emerald-600" />,
    },
    {
      type: '7-10 Business Days',
      title: '7–10 Business Days',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
    },
    {
      type: 'Manual Processing',
      title: 'Manual Processing',
      icon: <FileText className="w-4 h-4 text-rose-600" />,
    },
  ];

  return (
    <div className="space-y-2 select-none">
      <div className="space-y-0.5">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Refund Policy <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs font-semibold text-slate-400">When should the refund be processed?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = currentRefund === opt.type;

          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => updateStep7({ refundProcessing: opt.type })}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/70 border-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 hover:border-purple-200'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                {opt.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#0F172A] truncate">{opt.title}</p>
                {opt.subtitle && (
                  <p className="text-[10px] font-semibold text-slate-400 truncate">{opt.subtitle}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RefundProcessingSelector;
