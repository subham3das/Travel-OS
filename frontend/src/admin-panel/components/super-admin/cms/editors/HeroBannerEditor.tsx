import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { HeroBannerItem } from '../../../../types/cmsManagement';

interface HeroBannerEditorProps {
  banners: HeroBannerItem[];
  onSaveBanner: (banner: Partial<HeroBannerItem>) => void;
  onDeleteBanner: (id: string) => void;
  onOpenNewModal: () => void;
}

export const HeroBannerEditor: React.FC<HeroBannerEditorProps> = ({
  banners,
  onSaveBanner,
  onDeleteBanner,
  onOpenNewModal,
}) => {
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Hero Banners Carousel</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Manage top homepage carousel slides with desktop/mobile images and CTAs
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Banner Cards List */}
      <div className="space-y-3.5">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`p-4 rounded-2xl border transition-all ${
              banner.isEnabled
                ? 'bg-slate-50/60 border-slate-200/80 hover:border-purple-200'
                : 'bg-slate-100/50 border-slate-200/50 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Thumbnail */}
              <div className="relative w-full sm:w-44 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 shadow-2xs">
                <img
                  src={banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[9px] font-black backdrop-blur-xs">
                  Slide #{index + 1}
                </span>
                <span
                  className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black capitalize ${
                    banner.isEnabled
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-500 text-white'
                  }`}
                >
                  {banner.isEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-black text-[#0F172A] line-clamp-1">{banner.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onSaveBanner({ id: banner.id, isEnabled: !banner.isEnabled })
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                        banner.isEnabled
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {banner.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBanner(banner)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-[#6356E5] transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBanner(banner.id)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                  {banner.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1 text-[#6356E5] font-black">
                    <ArrowUpRight className="w-3 h-3" /> CTA: {banner.ctaText} → {banner.ctaLink}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {banner.startDate} to {banner.endDate}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-50 text-[#6356E5] font-bold">
                    Priority: {banner.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Banner Inline Modal */}
      {editingBanner && (
        <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-purple-100">
            <span className="font-black text-[#0F172A]">Edit Banner: {editingBanner.title}</span>
            <button
              type="button"
              onClick={() => setEditingBanner(null)}
              className="text-slate-400 hover:text-slate-700 font-bold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={editingBanner.title}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, title: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={editingBanner.subtitle}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={editingBanner.ctaText}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, ctaText: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={editingBanner.ctaLink}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, ctaLink: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingBanner(null)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveBanner(editingBanner);
                setEditingBanner(null);
              }}
              className="px-4 py-1.5 rounded-xl bg-[#6356E5] text-white font-black shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
