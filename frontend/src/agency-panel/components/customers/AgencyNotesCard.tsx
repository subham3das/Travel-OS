import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Plus, Edit2, Trash2, Save, X, MessageSquare } from 'lucide-react';
import { AgencyNoteItem } from '../../data/customers';

interface AgencyNotesCardProps {
  notes: AgencyNoteItem[];
  onAddNote: (noteText: string) => void;
  onEditNote: (id: string, newText: string) => void;
  onDeleteNote: (id: string) => void;
}

export const AgencyNotesCard: React.FC<AgencyNotesCardProps> = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText);
    setNewNoteText('');
    setIsAdding(false);
  };

  const handleEditSubmit = (id: string) => {
    if (!editText.trim()) return;
    onEditNote(id, editText);
    setEditingId(null);
    setEditText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Agency Private Notes</h3>
          <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
            Staff Only
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-extrabold transition-all cursor-pointer"
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'Cancel' : 'Add Note'}</span>
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubmit}
            className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2"
          >
            <textarea
              rows={2}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g. Vegetarian preference, Window seat requested, Senior citizen..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-4 py-2 rounded-xl bg-[#583BE8] text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:bg-slate-200"
              >
                Save Private Note
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <div className="space-y-2.5">
        {notes.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-bold text-slate-400">
            No private staff notes logged yet.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3.5 rounded-2xl bg-purple-50/30 border border-purple-100/60 space-y-1.5 text-xs">
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#583BE8] bg-white text-xs font-semibold text-[#0F172A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditSubmit(note.id)}
                      className="px-3 py-1 rounded-lg bg-[#583BE8] text-white text-[11px] font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-slate-400 font-bold text-[10px]">
                    <span>By {note.author} • {note.createdAt}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(note.id);
                          setEditText(note.noteText);
                        }}
                        className="p-1 text-slate-400 hover:text-[#583BE8] cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="font-extrabold text-[#0F172A] leading-relaxed">{note.noteText}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default AgencyNotesCard;
