import React, { useState } from 'react';
import {
  Search,
  Save,
  Globe,
  Share2,
  Image as ImageIcon,
} from 'lucide-react';
import { HomepageSEOData } from '../../../../types/cmsManagement';

interface SEOEditorProps {
  seo: HomepageSEOData;
  onSaveSEO: (seo: HomepageSEOData) => void;
}

export const SEOEditor: React.FC<SEOEditorProps> = ({ seo, onSaveSEO }) => {
  const [formData, setFormData] = useState<HomepageSEOData>({ ...seo });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSEO(formData);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">SEO & Social Meta Tags</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Configure OpenGraph social preview cards, title tags, and search indexing keywords
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Google Search Snippet Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-600" /> Google Search Preview
          </span>
          <p className="text-xs font-bold text-blue-600 truncate hover:underline cursor-pointer">
            {formData.title || 'Travel OS — Enterprise Travel Booking'}
          </p>
          <p className="text-[10px] font-mono text-emerald-700">https://travelos.com</p>
          <p className="text-[11px] text-slate-600 line-clamp-2">
            {formData.description || 'Book verified tours, holiday packages, flights, and hotels...'}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
              Homepage Title Tag
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
              OpenGraph Social Share Image URL (1200x630)
            </label>
            <input
              type="url"
              required
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
              Keywords (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 cursor-pointer transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
