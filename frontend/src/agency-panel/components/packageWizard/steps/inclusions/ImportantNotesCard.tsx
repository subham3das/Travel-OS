import React from 'react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const ImportantNotesCard: React.FC = () => {
  const { draft, updateStep6 } = usePackageWizard();

  const importantNotes = draft?.step6?.importantNotes || '';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-2 select-none">
      <div className="flex items-center justify-between">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Important Notes <span className="text-xs font-semibold text-slate-400">(Optional)</span>
        </label>
        <span className="text-xs font-bold text-slate-400">{importantNotes.length} / 300</span>
      </div>

      <textarea
        rows={3}
        maxLength={300}
        value={importantNotes}
        onChange={(e) => updateStep6({ importantNotes: e.target.value })}
        placeholder="Any special information travelers should know before booking..."
        className="w-full p-3 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#583BE8] resize-none"
      />
    </div>
  );
};

export default ImportantNotesCard;
