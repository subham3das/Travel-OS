import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Send, User, Clock } from 'lucide-react';
import { TripNote } from '../../data/tripTimeline';

interface TripNoteCardProps {
  notes: TripNote[];
  onAddNote: (note: Omit<TripNote, 'id'>) => void;
}

export const TripNoteCard: React.FC<TripNoteCardProps> = ({ notes, onAddNote }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Trip Host');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const now = new Date();
    const timeStr = `${now.getDate()} May, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    onAddNote({
      timestampText: timeStr,
      author,
      authorRole: 'Trip Host',
      content,
    });

    setContent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
          <MessageSquarePlus className="w-5 h-5 text-[#583BE8]" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Trip Host Operational Notes</h3>
          <p className="text-[11px] font-semibold text-slate-400">Chronological live updates & observations</p>
        </div>
      </div>

      {/* Add Note Input */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type live operational note (e.g. Reached hotel safely, Road closed...)"
          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post Note</span>
        </button>
      </form>

      {/* Notes Feed */}
      <div className="space-y-2.5 pt-1">
        {notes.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-bold text-slate-400">
            No notes logged yet.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-black text-[#0F172A]">
                  <User className="w-3.5 h-3.5 text-[#583BE8]" />
                  <span>{note.author}</span>
                  <span className="text-[10px] text-slate-400 font-bold">({note.authorRole})</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {note.timestampText}
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-700 leading-relaxed">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TripNoteCard;
