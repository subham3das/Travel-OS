import React, { useState } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import {
  AnnouncementType,
  ANNOUNCEMENT_TYPES,
  getAnnouncementEmoji,
} from '../../data/announcements';

export interface AnnouncementDraft {
  title: string;
  message: string;
  type: AnnouncementType;
  notifyAll: boolean;
  pushNotification: boolean;
  saveToTimeline: boolean;
}

interface AnnouncementComposerProps {
  onPublish: (draft: AnnouncementDraft) => void;
  isLoading?: boolean;
}

const DEFAULT_DRAFT: AnnouncementDraft = {
  title: '',
  message: '',
  type: 'General',
  notifyAll: true,
  pushNotification: true,
  saveToTimeline: true,
};

export const AnnouncementComposer: React.FC<AnnouncementComposerProps> = ({
  onPublish,
  isLoading = false,
}) => {
  const [draft, setDraft] = useState<AnnouncementDraft>(DEFAULT_DRAFT);

  const update = <K extends keyof AnnouncementDraft>(key: K, value: AnnouncementDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handlePublish = () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      alert('Please fill in both Title and Message before publishing.');
      return;
    }
    onPublish(draft);
    setDraft(DEFAULT_DRAFT);
  };

  const toggleSwitch = (key: 'notifyAll' | 'pushNotification' | 'saveToTimeline') =>
    update(key, !draft[key]);

  return (
    <div className="space-y-4">
      {/* Title + Type Row */}
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
            className="appearance-none w-full sm:w-52 pl-3 pr-8 py-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8] transition-colors cursor-pointer"
          >
            {ANNOUNCEMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {getAnnouncementEmoji(t)} {t}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Message textarea */}
      <textarea
        value={draft.message}
        onChange={(e) => update('message', e.target.value)}
        placeholder="Write your message here... (e.g. Tomorrow's departure has been moved to 6:30 AM.)"
        rows={4}
        className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 text-sm font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] transition-colors resize-none"
      />

      {/* Delivery Toggles */}
      <div className="flex flex-wrap gap-3 pt-1">
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

export default AnnouncementComposer;
