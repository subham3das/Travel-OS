import React from 'react';

interface NotesSectionProps {
  value?: string;
  onChange: (value: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ value = '', onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 select-none flex-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-[#0F172A]">Notes (Optional)</label>
        <span className="text-[10px] font-bold text-slate-400">
          {value.length}/300
        </span>
      </div>

      <textarea
        rows={2}
        maxLength={300}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Special instructions for travelers..."
        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
      />
    </div>
  );
};

export default NotesSection;
