import React, { useState } from 'react';
import { Calendar, ShieldCheck, Lock, Edit3, Check, Plus, Trash2, Info } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { CancellationPolicyType } from '../../../../data/policies';

export const CancellationPolicySelector: React.FC = () => {
  const {
    draft,
    updateStep7,
    addCustomCancellationRule,
    removeCustomCancellationRule,
  } = usePackageWizard();

  const [newDays, setNewDays] = useState('');
  const [newRefund, setNewRefund] = useState('');

  const currentPolicy = draft?.step7?.cancellationPolicy || 'Moderate';
  const customRules = draft?.step7?.customCancellationRules || [];

  const policies: { type: CancellationPolicyType; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      type: 'Flexible',
      title: 'Flexible',
      subtitle: 'High refund, flexible for travelers',
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
    },
    {
      type: 'Moderate',
      title: 'Moderate',
      subtitle: 'Balanced policy, most common',
      icon: <ShieldCheck className="w-5 h-5 text-[#583BE8]" />,
    },
    {
      type: 'Strict',
      title: 'Strict',
      subtitle: 'Low refund, strict policy',
      icon: <Lock className="w-5 h-5 text-rose-600" />,
    },
    {
      type: 'Custom',
      title: 'Custom',
      subtitle: 'Create your own policy',
      icon: <Edit3 className="w-5 h-5 text-amber-600" />,
    },
  ];

  const handleAddRule = () => {
    if (newDays.trim() && newRefund !== '') {
      addCustomCancellationRule({
        daysBeforeDeparture: newDays.trim(),
        refundPercentage: Math.min(100, Math.max(0, parseInt(newRefund) || 0)),
      });
      setNewDays('');
      setNewRefund('');
    }
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-extrabold text-[#0F172A]">
            Cancellation Policy <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs font-semibold text-slate-400">Choose a cancellation policy for this package</p>
        </div>
        <button
          type="button"
          onClick={() => alert('Flexible: 100% refund until 7 days. Moderate: 100% until 15 days, 50% until 7 days. Strict: Non-refundable within 30 days.')}
          className="text-xs font-bold text-[#583BE8] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Learn more</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {policies.map((p) => {
          const isSelected = currentPolicy === p.type;

          return (
            <button
              key={p.type}
              type="button"
              onClick={() => updateStep7({ cancellationPolicy: p.type })}
              className={`p-4 rounded-3xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-purple-50/70 border-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-xs">
                  {p.icon}
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#583BE8] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-black text-[#0F172A]">{p.title}</p>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">{p.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Rules Editor when 'Custom' is selected */}
      {currentPolicy === 'Custom' && (
        <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-3">
          <p className="text-xs font-extrabold text-[#583BE8]">Custom Cancellation Refund Rules</p>

          <div className="space-y-2">
            {customRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-[#0F172A]"
              >
                <span>{rule.daysBeforeDeparture}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#583BE8] font-black">{rule.refundPercentage}% Refund</span>
                  <button
                    type="button"
                    onClick={() => removeCustomCancellationRule(rule.id)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Rule Form */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="e.g. 20-30 Days"
              value={newDays}
              onChange={(e) => setNewDays(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#583BE8]"
            />
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Refund % (e.g. 75)"
              value={newRefund}
              onChange={(e) => setNewRefund(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#583BE8]"
            />
            <button
              type="button"
              onClick={handleAddRule}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#583BE8] text-white text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rule</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancellationPolicySelector;
