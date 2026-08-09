import React, { useState } from 'react';
import { Lock, Plus, X } from 'lucide-react';

interface AgencyNotesCardProps {
  notes: string[];
  onAddNote: (note: string) => void;
}

export const AgencyNotesCard: React.FC<AgencyNotesCardProps> = ({ notes, onAddNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddNote(text.trim());
    setText('');
    setIsAdding(false);
  };

  return (
    <div className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-2.5 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-purple-600" />
          Agency Notes (Staff Only)
        </h4>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="text-[10px] font-extrabold text-[#583BE8] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          {isAdding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          <span>{isAdding ? 'Cancel' : 'Add Note'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="space-y-1.5">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type private staff note..."
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-[#583BE8]"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-1.5 rounded-xl bg-[#583BE8] text-white text-xs font-bold disabled:bg-slate-200 cursor-pointer"
          >
            Save Note
          </button>
        </form>
      )}

      <div className="space-y-1.5">
        {notes.length === 0 ? (
          <p className="text-[11px] font-bold text-slate-400">No staff notes logged.</p>
        ) : (
          notes.map((note, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-white border border-purple-100 text-[11px] font-semibold text-slate-700">
              • {note}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgencyNotesCard;
