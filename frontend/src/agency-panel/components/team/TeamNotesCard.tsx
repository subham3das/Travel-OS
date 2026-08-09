import React from 'react';
import { Plus, FileText, Compass, Bus } from 'lucide-react';
import { TeamInternalNote } from '../../data/staff';

interface TeamNotesCardProps {
  notes: TeamInternalNote[];
  onAddNote?: () => void;
}

export const TeamNotesCard: React.FC<TeamNotesCardProps> = ({ notes, onAddNote }) => {
  const getTheme = (theme: TeamInternalNote['theme']) => {
    switch (theme) {
      case 'purple':
        return {
          cardBg: 'bg-purple-50/70 border-purple-100/80',
          iconBg: 'bg-[#583BE8] text-white',
          icon: <FileText className="w-4 h-4" />,
        };
      case 'amber':
        return {
          cardBg: 'bg-amber-50/70 border-amber-100/80',
          iconBg: 'bg-amber-500 text-white',
          icon: <Compass className="w-4 h-4" />,
        };
      case 'blue':
      default:
        return {
          cardBg: 'bg-sky-50/70 border-sky-100/80',
          iconBg: 'bg-sky-500 text-white',
          icon: <Bus className="w-4 h-4" />,
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Team Notes</h3>
        <button
          type="button"
          onClick={onAddNote}
          className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {notes.map((note) => {
          const { cardBg, iconBg, icon } = getTheme(note.theme);

          return (
            <div
              key={note.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${cardBg}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${iconBg}`}>
                {icon}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0F172A] leading-snug">{note.noteText}</p>
                <span className="text-[10px] font-semibold text-slate-400 block">
                  {note.author} • {note.timestampText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamNotesCard;
