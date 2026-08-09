import React from 'react';
import { Star } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { TagSelector } from './TagSelector';
import { VisibilitySelector } from './VisibilitySelector';
import { CommunityPost } from '../../../data/posts';

interface ExperienceFormState {
  title: string;
  description: string;
  rating: number;
  destinationName: string;
  agencyName: string;
  images: string[];
  tags: string[];
  visibility: CommunityPost['visibility'];
}

interface ExperienceFormProps {
  state: ExperienceFormState;
  onChange: (newState: Partial<ExperienceFormState>) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ state, onChange }) => {
  return (
    <div className="space-y-4">
      {/* 1. Title (Required) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Experience Title *
        </label>
        <input
          type="text"
          value={state.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Give your travel experience a title..."
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          required
        />
      </div>

      {/* 2. Rating Selector (Optional) */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Overall Trip Rating
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange({ rating: star })}
              className="p-1 cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= state.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Description (Required) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Detailed Experience *
        </label>
        <textarea
          rows={4}
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe your itinerary highlights, key takeaways, and experience..."
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          required
        />
      </div>

      {/* 4. Photos */}
      <MediaUploader images={state.images} onChange={(imgs) => onChange({ images: imgs })} />

      {/* 5. Destination & Agency */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500">Destination</label>
          <input
            type="text"
            value={state.destinationName}
            onChange={(e) => onChange({ destinationName: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A]"
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

      {/* 6. Tags & Visibility */}
      <TagSelector tags={state.tags} onChange={(ts) => onChange({ tags: ts })} />
      <VisibilitySelector visibility={state.visibility} onChange={(v) => onChange({ visibility: v })} />
    </div>
  );
};
