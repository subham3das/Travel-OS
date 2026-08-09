import React from 'react';
import { HelpCircle } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { TagSelector } from './TagSelector';
import { VisibilitySelector } from './VisibilitySelector';
import { CommunityPost } from '../../../data/posts';

interface QuestionFormState {
  questionTitle: string;
  description: string;
  destinationName: string;
  category: string;
  images: string[];
  tags: string[];
  visibility: CommunityPost['visibility'];
}

interface QuestionFormProps {
  state: QuestionFormState;
  onChange: (newState: Partial<QuestionFormState>) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ state, onChange }) => {
  const categories = ['Itinerary Review', 'Best Time to Visit', 'Permits & Visas', 'Hotel Recommendations', 'Taxi & Transport'];

  return (
    <div className="space-y-4">
      {/* 1. Question Title (Required) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>Your Question *</span>
        </label>
        <input
          type="text"
          value={state.questionTitle}
          onChange={(e) => onChange({ questionTitle: e.target.value })}
          placeholder="What is your question for the travel community?"
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          required
        />
      </div>

      {/* 2. Category Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Topic / Category
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
                  active ? 'bg-[#6356E5] text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Question Description (Required) */}
      <div className="space-y-1">
        <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Additional Details *
        </label>
        <textarea
          rows={4}
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Add dates, group size, preferences or specific concerns..."
          className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
          required
        />
      </div>

      {/* 4. Optional Image */}
      <MediaUploader images={state.images} onChange={(imgs) => onChange({ images: imgs })} maxImages={3} />

      {/* 5. Destination */}
      <div className="space-y-1">
        <label className="text-[11px] font-extrabold text-slate-500">Destination</label>
        <input
          type="text"
          value={state.destinationName}
          onChange={(e) => onChange({ destinationName: e.target.value })}
          placeholder="e.g. Sikkim, Spiti, Kerala..."
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A]"
        />
      </div>

      {/* 6. Tags & Visibility */}
      <TagSelector tags={state.tags} onChange={(ts) => onChange({ tags: ts })} />
      <VisibilitySelector visibility={state.visibility} onChange={(v) => onChange({ visibility: v })} />
    </div>
  );
};
