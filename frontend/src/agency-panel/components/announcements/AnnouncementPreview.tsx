import React from 'react';
import { AnnouncementDraft } from './AnnouncementComposer';
import { getAnnouncementEmoji } from '../../data/announcements';

interface AnnouncementPreviewProps {
  draft: AnnouncementDraft;
}

export const AnnouncementPreview: React.FC<AnnouncementPreviewProps> = ({ draft }) => {
  const hasContent = draft.title.trim() || draft.message.trim();

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
        Preview — How travelers will receive it
      </p>

      <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 min-h-[80px]">
        {hasContent ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getAnnouncementEmoji(draft.type)}</span>
              <span className="text-xs font-black text-[#583BE8] uppercase tracking-wide">
                {draft.type}
              </span>
            </div>
            <p className="text-sm font-extrabold text-[#0F172A]">
              {draft.title || <span className="text-slate-300">Title will appear here</span>}
            </p>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">
              {draft.message || <span className="text-slate-300">Message will appear here</span>}
            </p>
          </div>
        ) : (
          <p className="text-xs font-semibold text-slate-300 italic">
            Start typing above to see the preview…
          </p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementPreview;
