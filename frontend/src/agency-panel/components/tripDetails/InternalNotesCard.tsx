import React from 'react';
import { FileText } from 'lucide-react';
import { InternalNote } from '../../data/tripDetails';

interface InternalNotesCardProps {
  notes: InternalNote[];
  onViewAll?: () => void;
}

export const InternalNotesCard: React.FC<InternalNotesCardProps> = ({ notes, onViewAll }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Internal Notes</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <FileText className="w-4 h-4" />
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="text-xs font-extrabold text-[#0F172A] leading-snug">{note.noteText}</p>
              <span className="text-[10px] font-semibold text-slate-400 block">
                Added by {note.author} • {note.timestampText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternalNotesCard;
