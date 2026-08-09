import React from 'react';
import { Lock, Globe, FileEdit } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { PublishMode } from '../../../../types/packageWizard';

export const PublishSettingsCard: React.FC = () => {
  const { draft, updateStep8 } = usePackageWizard();

  const currentMode = draft?.step8?.publishMode || 'Draft';

  const modes: { type: PublishMode; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      type: 'Draft',
      title: 'Draft',
      subtitle: 'Save as draft and continue later',
      icon: <FileEdit className="w-4 h-4 text-[#583BE8]" />,
    },
    {
      type: 'Private',
      title: 'Private',
      subtitle: 'Only visible to you and your team',
      icon: <Lock className="w-4 h-4 text-slate-600" />,
    },
    {
      type: 'Public',
      title: 'Public',
      subtitle: 'Visible to all travelers',
      icon: <Globe className="w-4 h-4 text-emerald-600" />,
    },
  ];

  return (
    <div className="space-y-3 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Publish Settings</label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => {
          const isSelected = currentMode === m.type;

          return (
            <button
              key={m.type}
              type="button"
              onClick={() => updateStep8({ publishMode: m.type })}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/70 border-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 hover:border-purple-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'border-4 border-[#583BE8] bg-white' : 'border border-slate-300 bg-white'
                }`}
              />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-[#0F172A]">{m.title}</p>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">{m.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PublishSettingsCard;
