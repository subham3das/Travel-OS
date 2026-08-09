import React from 'react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { CATEGORY_TAGS_CONFIG, CategoryTag } from '../../../../types/gallery';

export const ImageCategorySelector: React.FC = () => {
  const { draft, toggleCategoryTag } = usePackageWizard();

  const selectedCategories = draft?.step5?.imageCategories || [];

  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Image Categories</label>
      <p className="text-xs font-semibold text-slate-400">
        Select categories that best describe your media
      </p>

      <div className="flex flex-wrap gap-2.5 pt-1">
        {CATEGORY_TAGS_CONFIG.map(({ tag, icon }) => {
          const isSelected = selectedCategories.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleCategoryTag(tag)}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 border-[#583BE8] text-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <span>{icon}</span>
              <span>{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageCategorySelector;
