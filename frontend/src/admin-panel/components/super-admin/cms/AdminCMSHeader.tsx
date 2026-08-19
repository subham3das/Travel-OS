import React from 'react';
import {
  LayoutTemplate,
  Plus,
  Megaphone,
  Sparkles,
  ExternalLink,
  Layers,
  MessageSquarePlus,
} from 'lucide-react';

interface AdminCMSHeaderProps {
  onNewBanner: () => void;
  onNewCampaign: () => void;
  onNewAnnouncement: () => void;
  onNewPopup: () => void;
  onOpenStorefront: () => void;
}

export const AdminCMSHeader: React.FC<AdminCMSHeaderProps> = ({
  onNewBanner,
  onNewCampaign,
  onNewAnnouncement,
  onNewPopup,
  onOpenStorefront,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs select-none">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Content & Campaign Management
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Control dynamic homepage banners, announcements, trending destinations, agencies, and promotions in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenStorefront}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span>Live Storefront</span>
        </button>

        <button
          type="button"
          onClick={onNewAnnouncement}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-600" />
          <span>+ Announcement</span>
        </button>

        <button
          type="button"
          onClick={onNewPopup}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] border border-purple-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>+ Popup</span>
        </button>

        <button
          type="button"
          onClick={onNewCampaign}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ Campaign</span>
        </button>

        <button
          type="button"
          onClick={onNewBanner}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ New Banner</span>
        </button>
      </div>
    </div>
  );
};
