import React from 'react';
import { Video, Film, RefreshCw, X, Tag as TagIcon } from 'lucide-react';
import { TagSelector } from './TagSelector';
import { VisibilitySelector } from './VisibilitySelector';
import { CommunityPost } from '../../../data/posts';

interface StoryFormState {
  videoUrl: string | null;
  durationSeconds: number;
  title: string;
  description: string;
  destinationName: string;
  agencyName: string;
  tags: string[];
  visibility: CommunityPost['visibility'];
}

interface StoryFormProps {
  state: StoryFormState;
  onChange: (newState: Partial<StoryFormState>) => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({ state, onChange }) => {
  const sampleVideos = [
    {
      label: 'Meghalaya Waterfall (45s)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
      duration: 45,
    },
    {
      label: 'Himalayan Mountain Biking (60s)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-motorcycle-riding-on-a-mountain-road-41584-large.mp4',
      duration: 60,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Large Video Upload Area (Video First) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-4 h-4 text-[#6356E5]" />
            <span>Upload Travel Video * (5s – 90s)</span>
          </label>
          {state.videoUrl && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black">
              {state.durationSeconds} Seconds
            </span>
          )}
        </div>

        {!state.videoUrl ? (
          <div className="p-6 rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/40 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#6356E5]/10 text-[#6356E5] flex items-center justify-center mx-auto">
              <Video className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-sm font-black text-[#0F172A]">Choose your travel video</h3>
              <p className="text-xs font-semibold text-slate-400">Supports MP4, MOV • 5s to 90s duration</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
              {sampleVideos.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ videoUrl: s.url, durationSeconds: s.duration })}
                  className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-black text-[#6356E5] shadow-2xs cursor-pointer transition-all text-center"
                >
                  ▶ {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative aspect-video max-h-72 w-full mx-auto rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-md">
            <video src={state.videoUrl} controls autoPlay muted loop className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange({ videoUrl: sampleVideos[1].url, durationSeconds: sampleVideos[1].duration })}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                title="Replace Video"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange({ videoUrl: null, durationSeconds: 0 })}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                title="Remove Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Story Title (Required) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Story Title * (Max 80 Chars)
        </label>
        <input
          type="text"
          maxLength={80}
          value={state.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Our Magical Meghalaya Adventure 🏔️"
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          required
        />
      </div>

      {/* 3. Description (Optional) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Description (Optional)
        </label>
        <textarea
          rows={3}
          maxLength={500}
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Add trip context, tips or memories..."
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
        />
      </div>

      {/* 4. Destination & Agency */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500">Destination *</label>
          <input
            type="text"
            value={state.destinationName}
            onChange={(e) => onChange({ destinationName: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500">Agency</label>
          <input
            type="text"
            value={state.agencyName}
            onChange={(e) => onChange({ agencyName: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A]"
          />
        </div>
      </div>

      {/* 5. Tags & Visibility */}
      <TagSelector tags={state.tags} onChange={(ts) => onChange({ tags: ts })} />
      <VisibilitySelector visibility={state.visibility} onChange={(v) => onChange({ visibility: v })} />
    </div>
  );
};
