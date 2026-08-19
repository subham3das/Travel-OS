import React, { useState } from 'react';
import {
  Undo,
  Redo,
  ChevronDown,
  GripVertical,
  Eye,
  Palette,
  Copy,
  Trash2,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Search,
  MapPin,
  Package,
  ShieldCheck,
  Grid,
  Tag,
  MessageSquare,
  FileText,
  Mail,
} from 'lucide-react';
import {
  CMSSectionItem,
  CMSHeroBannerData,
} from '../../../types/cmsManagement';

interface VisualContentBuilderProps {
  heroBanner: CMSHeroBannerData;
  sections: CMSSectionItem[];
  onHeroBannerChange: (updated: Partial<CMSHeroBannerData>) => void;
  onToggleSection: (id: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onChangeImage: () => void;
  onAddNewSection: () => void;
}

export const VisualContentBuilder: React.FC<VisualContentBuilderProps> = ({
  heroBanner,
  sections,
  onHeroBannerChange,
  onToggleSection,
  onSaveDraft,
  onPublish,
  onChangeImage,
  onAddNewSection,
}) => {
  const [activeTab, setActiveTab] = useState<'Page Builder' | 'Content' | 'SEO' | 'Settings'>('Page Builder');
  const [selectedSectionId, setSelectedSectionId] = useState('hero');

  const getSectionIcon = (name: string) => {
    switch (name) {
      case 'Hero Banner':
        return <Sparkles className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'Search Section':
        return <Search className="w-3.5 h-3.5 text-blue-500" />;
      case 'Featured Destinations':
        return <MapPin className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Popular Packages':
        return <Package className="w-3.5 h-3.5 text-orange-500" />;
      case 'Why Travel OS':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Top Categories':
        return <Grid className="w-3.5 h-3.5 text-purple-500" />;
      case 'Offers & Deals':
        return <Tag className="w-3.5 h-3.5 text-amber-500" />;
      case 'Testimonials':
        return <MessageSquare className="w-3.5 h-3.5 text-rose-500" />;
      case 'Blog Section':
        return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Newsletter':
      default:
        return <Mail className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. Header with Status & Action Buttons ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-[#0F172A]">Editing: Homepage</h2>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100">
            Published
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">Last saved: 2 mins ago</span>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer">
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer">
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onSaveDraft}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs"
          >
            Save Draft
          </button>

          <button
            onClick={onPublish}
            className="px-3.5 py-1.5 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-[#6356E5]/20 flex items-center gap-1"
          >
            <span>Publish Changes</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>
        </div>
      </div>

      {/* ── 2. Top Builder Navigation Tabs ── */}
      <div className="flex items-center gap-4 border-b border-slate-100 text-xs font-black pb-2">
        {(['Page Builder', 'Content', 'SEO', 'Settings'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 transition-all cursor-pointer relative ${
                isActive ? 'text-[#6356E5]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#6356E5] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── 3. Main Builder Grid (Sections List on Left + Active Section Editor on Right) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Left Drag List: Page Sections */}
        <div className="md:col-span-4 space-y-1.5">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-900">Page Sections</h4>
            <p className="text-[10px] text-slate-400 font-semibold">
              Drag and drop sections to reorder
            </p>
          </div>

          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
            {sections.map((sec) => {
              const isSelected = selectedSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`flex items-center justify-between p-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50/50 border-[#6356E5] text-[#6356E5] shadow-xs'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="shrink-0">{getSectionIcon(sec.name)}</div>
                    <span className="text-xs font-black truncate">{sec.name}</span>
                  </div>

                  <GripVertical className="w-3.5 h-3.5 text-slate-300 hover:text-slate-600 cursor-grab shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Editor: Active Section Config */}
        <div className="md:col-span-8 space-y-3.5">
          {/* Hero Banner Editor Box */}
          <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-2xs space-y-3">
            {/* Box Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900">Hero Banner</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center"><Eye className="w-3 h-3" /></button>
                <button className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center"><Palette className="w-3 h-3" /></button>
                <button className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center"><Copy className="w-3 h-3" /></button>
                <button className="w-6 h-6 rounded-lg hover:bg-rose-50 text-rose-500 flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>

            {/* Banner Content: Image Thumbnail + Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
              {/* Left Image Box */}
              <div className="sm:col-span-5 space-y-2">
                <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                  <img
                    src={heroBanner.imageUrl}
                    alt="Hero Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={onChangeImage}
                      className="px-2.5 py-1 rounded-xl bg-white text-slate-900 text-[10px] font-black shadow-md cursor-pointer"
                    >
                      Change Image
                    </button>
                  </div>
                </div>

                <button
                  onClick={onChangeImage}
                  className="w-full py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ImageIcon className="w-3 h-3 text-slate-400" />
                  <span>Change Image</span>
                </button>
              </div>

              {/* Right Form Fields */}
              <div className="sm:col-span-7 space-y-2">
                {/* Title */}
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-500">Title</label>
                  <input
                    type="text"
                    value={heroBanner.title}
                    onChange={(e) => onHeroBannerChange({ title: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-500">Subtitle</label>
                  <input
                    type="text"
                    value={heroBanner.subtitle}
                    onChange={(e) => onHeroBannerChange({ subtitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white"
                  />
                </div>

                {/* CTA Button & CTA Link */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-slate-500">CTA Button</label>
                    <input
                      type="text"
                      value={heroBanner.ctaText}
                      onChange={(e) => onHeroBannerChange({ ctaText: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-slate-500">CTA Link</label>
                    <input
                      type="text"
                      value={heroBanner.ctaLink}
                      onChange={(e) => onHeroBannerChange({ ctaLink: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                    />
                  </div>
                </div>

                {/* Button Style & Swatch */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-slate-500">Button Style</span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      <span>Primary</span>
                      <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                    </button>
                    <div className="w-4 h-4 rounded-md bg-[#6356E5] border border-purple-300 shadow-2xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Section Cards Below */}
          <div className="space-y-2">
            {/* Featured Destinations Section */}
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-800">Featured Destinations</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-5 rounded-md overflow-hidden bg-slate-200"><img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=80" className="w-full h-full object-cover" /></div>
                  <div className="w-8 h-5 rounded-md overflow-hidden bg-slate-200"><img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=80" className="w-full h-full object-cover" /></div>
                  <div className="w-8 h-5 rounded-md overflow-hidden bg-slate-200"><img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=80" className="w-full h-full object-cover" /></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => onToggleSection('destinations')}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
                <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab" />
              </div>
            </div>

            {/* Popular Packages Section */}
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-black text-slate-800">Popular Packages</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-5 rounded-md overflow-hidden bg-slate-200"><img src="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=80" className="w-full h-full object-cover" /></div>
                  <div className="w-8 h-5 rounded-md overflow-hidden bg-slate-200"><img src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=80" className="w-full h-full object-cover" /></div>
                  <div className="w-8 h-5 rounded-md overflow-hidden bg-slate-200"><img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=80" className="w-full h-full object-cover" /></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => onToggleSection('packages')}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
                <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab" />
              </div>
            </div>

            {/* Why Travel OS Section */}
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-black text-slate-800">Why Travel OS</span>
                <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">200K+ Travelers</span>
                <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">20K+ Destinations</span>
                <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">Best Price</span>
                <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">24/7 Support</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => onToggleSection('why-us')}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
                <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab" />
              </div>
            </div>
          </div>

          {/* Add New Section Button */}
          <button
            onClick={onAddNewSection}
            className="w-full py-2.5 rounded-2xl border-2 border-dashed border-purple-200 hover:border-[#6356E5] hover:bg-purple-50/40 text-[#6356E5] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Section</span>
          </button>
        </div>
      </div>
    </div>
  );
};
