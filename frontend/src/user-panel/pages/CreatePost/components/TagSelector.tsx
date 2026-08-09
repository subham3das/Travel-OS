import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagSelectorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ tags, onChange }) => {
  const [inputVal, setInputVal] = useState('');

  const suggestions = ['Meghalaya', 'SoloTravel', 'Backpacking', 'Adventure', 'Waterfalls', 'Ladakh', 'Kerala', 'Luxury'];

  const handleAddTag = (tagStr: string) => {
    const clean = tagStr.replace(/[^a-zA-Z0-9]/g, '');
    if (!clean || tags.includes(clean)) return;
    onChange([...tags, clean]);
    setInputVal('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-[#6356E5]" />
        <span>Tags & Hashtags</span>
      </label>

      {/* Selected Tag Chips */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-[#6356E5] text-xs font-black border border-purple-100"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-rose-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Suggestion Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-400 self-center">Suggestions:</span>
        {suggestions.map((sug) => {
          if (tags.includes(sug)) return null;
          return (
            <button
              key={sug}
              type="button"
              onClick={() => handleAddTag(sug)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer transition-colors"
            >
              +#{sug}
            </button>
          );
        })}
      </div>
    </div>
  );
};
