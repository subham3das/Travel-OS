import React from 'react';
import { Globe2, Users, Lock } from 'lucide-react';
import { CommunityPost } from '../../../data/posts';

interface VisibilitySelectorProps {
  visibility: CommunityPost['visibility'];
  onChange: (v: CommunityPost['visibility']) => void;
}

export const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({ visibility, onChange }) => {
  const options: { id: CommunityPost['visibility']; label: string; icon: React.ReactNode }[] = [
    { id: 'public', label: 'Public (Everyone)', icon: <Globe2 className="w-3.5 h-3.5" /> },
    { id: 'followers', label: 'Followers Only', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'draft', label: 'Private Draft', icon: <Lock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Post Visibility
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = visibility === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer select-none ${
                active
                  ? 'bg-[#6356E5] text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
