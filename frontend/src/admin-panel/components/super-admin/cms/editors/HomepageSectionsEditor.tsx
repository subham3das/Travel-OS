import React from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  GripVertical,
  CheckCircle2,
} from 'lucide-react';
import { HomepageSectionItem } from '../../../../types/cmsManagement';

interface HomepageSectionsEditorProps {
  sections: HomepageSectionItem[];
  onToggleSection: (id: string, isEnabled: boolean) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
}

export const HomepageSectionsEditor: React.FC<HomepageSectionsEditorProps> = ({
  sections,
  onToggleSection,
  onMoveSection,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Homepage Layout & Section Ordering</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Reorder and turn on/off major content modules rendered across the landing page
          </p>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-2.5">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              sec.isEnabled
                ? 'bg-slate-50/80 border-slate-200 hover:border-purple-200'
                : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1">
                <span className="w-5 text-center text-xs font-black text-slate-400">
                  {sec.order}
                </span>
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-[#0F172A]">{sec.name}</h3>
                  <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                    {sec.key}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {sec.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Move Buttons */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => onMoveSection(idx, 'up')}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#6356E5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === sections.length - 1}
                  onClick={() => onMoveSection(idx, 'down')}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#6356E5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => onToggleSection(sec.id, !sec.isEnabled)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-colors cursor-pointer ${
                  sec.isEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {sec.isEnabled ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
