import React from 'react';
import { Camera, Compass, Lightbulb, HelpCircle } from 'lucide-react';

export type PostType = 'story' | 'experience' | 'tip' | 'question';

interface ContentTypeSelectorProps {
  selectedType: PostType;
  onSelect: (type: PostType) => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ selectedType, onSelect }) => {
  const options: { id: PostType; label: string; icon: React.ReactNode }[] = [
    { id: 'story', label: 'Travel Story 🎬', icon: <Camera className="w-4 h-4" /> },
    { id: 'experience', label: 'Travel Experience', icon: <Compass className="w-4 h-4" /> },
    { id: 'tip', label: 'Travel Tip', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'question', label: 'Ask Question', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
      {options.map((opt) => {
        const active = selectedType === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 select-none ${
              active
                ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20 border border-[#6356E5]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
