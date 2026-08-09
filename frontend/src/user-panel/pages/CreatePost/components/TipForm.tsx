import React from 'react';
import { Lightbulb } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { TagSelector } from './TagSelector';
import { VisibilitySelector } from './VisibilitySelector';
import { CommunityPost } from '../../../data/posts';

interface TipFormState {
  title: string;
  tipText: string;
  destinationName: string;
  category: string;
  images: string[];
  tags: string[];
  visibility: CommunityPost['visibility'];
}

interface TipFormProps {
  state: TipFormState;
  onChange: (newState: Partial<TipFormState>) => void;
}

export const TipForm: React.FC<TipFormProps> = ({ state, onChange }) => {
  const categories = ['Packing', 'Budgeting', 'Safety', 'Transport', 'Food & Stays', 'Local Rules'];

  return (
    <div className="space-y-4">
      {/* 1. Tip Title (Required) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Tip Headline *</span>
        </label>
        <input
          type="text"
          value={state.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Essential Packing Tip for Himalayan Treks"
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          required
        />
      </div>

      {/* 2. Category Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const active = state.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ category: cat })}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                  active ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Tip Text (Required) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Tip Details *
        </label>
        <textarea
          rows={4}
          value={state.tipText}
          onChange={(e) => onChange({ tipText: e.target.value })}
          placeholder="Share actionable advice, insider secrets, or warnings for fellow travelers..."
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          required
        />
      </div>

      {/* 4. Optional Photo */}
      <MediaUploader images={state.images} onChange={(imgs) => onChange({ images: imgs })} maxImages={3} />

      {/* 5. Destination */}
      <div className="space-y-1">
        <label className="text-[11px] font-extrabold text-slate-500">Destination</label>
        <input
          type="text"
          value={state.destinationName}
          onChange={(e) => onChange({ destinationName: e.target.value })}
          placeholder="e.g. Meghalaya, Ladakh, Goa..."
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A]"
        />
      </div>

      {/* 6. Tags & Visibility */}
      <TagSelector tags={state.tags} onChange={(ts) => onChange({ tags: ts })} />
      <VisibilitySelector visibility={state.visibility} onChange={(v) => onChange({ visibility: v })} />
    </div>
  );
};
