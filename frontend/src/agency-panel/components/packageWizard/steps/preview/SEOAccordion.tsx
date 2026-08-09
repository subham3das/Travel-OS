import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Lock, Check, AlignLeft, Search, Link, Edit2 } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const SEOAccordion: React.FC = () => {
  const { draft, updateStep8 } = usePackageWizard();

  const [isExpanded, setIsExpanded] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);

  const seo = draft?.step8?.seoSettings || {
    slug: 'ladakh-adventure-expedition',
    metaTitle: 'Ladakh Adventure Expedition – 7 Days Trip',
    metaDescription: "Explore Ladakh's stunning landscapes, lakes, and mountains with MountRoam Adventures.",
    keywords: 'ladakh, adventure, leh, nubra, pangong, travel',
  };

  const handleUpdate = (field: string, value: string) => {
    updateStep8({
      seoSettings: {
        ...seo,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer"
      >
        <h3 className="text-base font-black text-[#0F172A]">SEO & Visibility</h3>
        <button type="button" className="text-slate-400 hover:text-[#583BE8]">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-[#583BE8]" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1 border-t border-slate-100">
          {/* Package URL */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-extrabold text-[#0F172A] w-28 shrink-0">Package URL</span>
              <span className="font-bold text-slate-500 truncate">/packages/{seo.slug}</span>
            </div>
            <Edit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Meta Title */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-extrabold text-[#0F172A] w-28 shrink-0">Meta Title</span>
              {editingField === 'metaTitle' ? (
                <input
                  type="text"
                  value={seo.metaTitle}
                  onChange={(e) => handleUpdate('metaTitle', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  className="flex-1 px-2 py-1 rounded bg-slate-50 border border-[#583BE8] text-xs font-bold"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-600 truncate">{seo.metaTitle}</span>
              )}
            </div>
            <button type="button" onClick={() => setEditingField('metaTitle')} className="cursor-pointer">
              <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-[#583BE8]" />
            </button>
          </div>

          {/* Meta Description */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <AlignLeft className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-extrabold text-[#0F172A] w-28 shrink-0">Meta Description</span>
              {editingField === 'metaDescription' ? (
                <input
                  type="text"
                  value={seo.metaDescription}
                  onChange={(e) => handleUpdate('metaDescription', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  className="flex-1 px-2 py-1 rounded bg-slate-50 border border-[#583BE8] text-xs font-bold"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-600 truncate">{seo.metaDescription}</span>
              )}
            </div>
            <button type="button" onClick={() => setEditingField('metaDescription')} className="cursor-pointer">
              <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-[#583BE8]" />
            </button>
          </div>

          {/* Search Keywords */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-extrabold text-[#0F172A] w-28 shrink-0">Search Keywords</span>
              {editingField === 'keywords' ? (
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => handleUpdate('keywords', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  className="flex-1 px-2 py-1 rounded bg-slate-50 border border-[#583BE8] text-xs font-bold"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-600 truncate">{seo.keywords}</span>
              )}
            </div>
            <button type="button" onClick={() => setEditingField('keywords')} className="cursor-pointer">
              <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-[#583BE8]" />
            </button>
          </div>

          {/* Slug */}
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Link className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-extrabold text-[#0F172A] w-28 shrink-0">Slug</span>
              {editingField === 'slug' ? (
                <input
                  type="text"
                  value={seo.slug}
                  onChange={(e) => handleUpdate('slug', e.target.value)}
                  onBlur={() => setEditingField(null)}
                  className="flex-1 px-2 py-1 rounded bg-slate-50 border border-[#583BE8] text-xs font-bold"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-600 truncate">{seo.slug}</span>
              )}
            </div>
            <button type="button" onClick={() => setEditingField('slug')} className="cursor-pointer">
              <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-[#583BE8]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOAccordion;
