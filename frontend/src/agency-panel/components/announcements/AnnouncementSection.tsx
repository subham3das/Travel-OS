import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { AnnouncementComposer, AnnouncementDraft } from './AnnouncementComposer';
import { AnnouncementPreview } from './AnnouncementPreview';
import { AnnouncementHistory } from './AnnouncementHistory';
import { TripAnnouncement } from '../../data/announcements';

interface AnnouncementSectionProps {
  tripId: string;
  initialAnnouncements: TripAnnouncement[];
}

export const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({
  tripId,
  initialAnnouncements,
}) => {
  const [announcements, setAnnouncements] = useState<TripAnnouncement[]>(initialAnnouncements);
  const [composerOpen, setComposerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [draftPreview, setDraftPreview] = useState<AnnouncementDraft>({
    title: '',
    message: '',
    type: 'General',
    notifyAll: true,
    pushNotification: true,
    saveToTimeline: true,
  });

  const handlePublish = (draft: AnnouncementDraft) => {
    setIsLoading(true);

    // Simulate async — no backend yet
    setTimeout(() => {
      const newAnnouncement: TripAnnouncement = {
        id: `anc-${Date.now()}`,
        tripId,
        title: draft.title,
        message: draft.message,
        type: draft.type,
        status: 'Sent',
        author: 'You',
        createdAt: new Date().toISOString(),
        deliveryOptions: {
          notifyAllTravelers: draft.notifyAll,
          pushNotification: draft.pushNotification,
          saveToTimeline: draft.saveToTimeline,
        },
      };

      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setIsLoading(false);
      setComposerOpen(false);
      setDraftPreview({
        title: '',
        message: '',
        type: 'General',
        notifyAll: true,
        pushNotification: true,
        saveToTimeline: true,
      });

      // Show toast
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden select-none">
      {/* ── Section Header ── */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setComposerOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4 text-[#583BE8]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A]">📢 Trip Announcement</h3>
            <p className="text-[11px] font-semibold text-slate-400">
              Send updates to every traveler on this trip
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black border border-purple-100">
            {announcements.length} sent
          </span>
          {composerOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* ── Expandable Composer + History ── */}
      <AnimatePresence initial={false}>
        {composerOpen && (
          <motion.div
            key="composer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
              {/* Live Preview */}
              <div className="pt-4">
                <AnnouncementPreview draft={draftPreview} />
              </div>

              {/* Composer with draft tracking */}
              <div>
                <AnnouncementComposerWithPreview
                  onPublish={handlePublish}
                  isLoading={isLoading}
                  onDraftChange={setDraftPreview}
                  draft={draftPreview}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Recent Announcements (always visible) ── */}
      <div className="px-5 pb-5 border-t border-slate-100">
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-[#0F172A]">Recent Announcements</h4>
          </div>
          <AnnouncementHistory
            announcements={announcements}
            maxVisible={5}
            onViewAll={() => alert('Full announcement log — coming soon')}
          />
        </div>
      </div>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Announcement Sent Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Internal sub-component to track draft externally for preview ──────────────
import { AnnouncementType, ANNOUNCEMENT_TYPES, getAnnouncementEmoji } from '../../data/announcements';
import { Send, ChevronRight } from 'lucide-react';

interface InternalComposerProps {
  draft: AnnouncementDraft;
  onDraftChange: (d: AnnouncementDraft) => void;
  onPublish: (draft: AnnouncementDraft) => void;
  isLoading: boolean;
}

const AnnouncementComposerWithPreview: React.FC<InternalComposerProps> = ({
  draft,
  onDraftChange,
  onPublish,
  isLoading,
}) => {
  const update = <K extends keyof AnnouncementDraft>(key: K, value: AnnouncementDraft[K]) =>
    onDraftChange({ ...draft, [key]: value });

  const handlePublish = () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      alert('Please fill in both Title and Message before publishing.');
      return;
    }
    onPublish(draft);
  };

  const toggleSwitch = (key: 'notifyAll' | 'pushNotification' | 'saveToTimeline') =>
    update(key, !draft[key]);

  return (
    <div className="space-y-3">
      {/* Title + Type */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Announcement Title"
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 text-sm font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] transition-colors"
        />

        <div className="relative">
          <select
            value={draft.type}
            onChange={(e) => update('type', e.target.value as AnnouncementType)}
            className="appearance-none w-full sm:w-52 pl-3 pr-8 py-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8] cursor-pointer"
          >
            {ANNOUNCEMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {getAnnouncementEmoji(t)} {t}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
        </div>
      </div>

      {/* Message */}
      <textarea
        value={draft.message}
        onChange={(e) => update('message', e.target.value)}
        placeholder="Write your message here…"
        rows={4}
        className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 text-sm font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] transition-colors resize-none"
      />

      {/* Delivery Toggles */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        {(
          [
            { key: 'notifyAll', label: 'Notify All Travelers' },
            { key: 'pushNotification', label: 'Push Notification' },
            { key: 'saveToTimeline', label: 'Save to Timeline' },
          ] as { key: 'notifyAll' | 'pushNotification' | 'saveToTimeline'; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleSwitch(key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
              draft[key]
                ? 'bg-purple-50 border-[#583BE8] text-[#583BE8]'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <span
              className={`w-7 h-4 rounded-full flex items-center transition-all ${
                draft[key] ? 'bg-[#583BE8] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-white mx-0.5 shadow-xs" />
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Publish Button */}
      <button
        type="button"
        onClick={handlePublish}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] disabled:opacity-60 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>{isLoading ? 'Publishing…' : 'Publish Announcement'}</span>
      </button>
    </div>
  );
};

export default AnnouncementSection;
