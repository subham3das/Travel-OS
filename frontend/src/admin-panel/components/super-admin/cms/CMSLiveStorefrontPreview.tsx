import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ExternalLink,
  Flame,
  Search,
  Star,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';
import {
  HeroBannerItem,
  PlatformAnnouncementItem,
  TrendingDestinationItem,
  FeaturedAgencyItem,
  PromotionalCampaignItem,
} from '../../../types/cmsManagement';

interface CMSLiveStorefrontPreviewProps {
  banners: HeroBannerItem[];
  announcements: PlatformAnnouncementItem[];
  destinations: TrendingDestinationItem[];
  agencies: FeaturedAgencyItem[];
  campaigns: PromotionalCampaignItem[];
}

export const CMSLiveStorefrontPreview: React.FC<CMSLiveStorefrontPreviewProps> = ({
  banners,
  announcements,
  destinations,
  agencies,
  campaigns,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const activeBanner = banners.find((b) => b.isEnabled) || banners[0];
  const activeAnn = announcements.find(
    (a) => a.status === 'published' && (a.location === 'homepage' || a.location === 'both')
  );
  const activeDests = destinations.filter((d) => d.isEnabled).slice(0, 4);
  const activeAgencies = agencies.filter((a) => a.isEnabled).slice(0, 3);
  const activeCamp = campaigns.find((c) => c.status === 'active') || campaigns[0];

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3.5 select-none">
      {/* Device Switcher Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-[#0F172A]">Live Storefront Preview</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              device === 'desktop' ? 'bg-white text-[#6356E5] shadow-xs' : 'text-slate-500'
            }`}
            title="Desktop 1920px"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              device === 'tablet' ? 'bg-white text-[#6356E5] shadow-xs' : 'text-slate-500'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              device === 'mobile' ? 'bg-white text-[#6356E5] shadow-xs' : 'text-slate-500'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Browser Frame */}
      <div
        className={`mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-50 transition-all ${
          device === 'mobile'
            ? 'max-w-[280px]'
            : device === 'tablet'
            ? 'max-w-[380px]'
            : 'w-full'
        }`}
      >
        {/* Frame Bar */}
        <div className="bg-slate-800 text-white px-3 py-1.5 flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="truncate max-w-[160px] text-slate-300">travelos.com</span>
          <span className="text-[8px] text-slate-400">SSL Encrypted</span>
        </div>

        {/* Dynamic Storefront Content */}
        <div className="max-h-[520px] overflow-y-auto space-y-3 p-2.5 text-slate-800 bg-white">
          {/* Announcement Bar */}
          {activeAnn && (
            <div
              className={`p-2 rounded-xl text-[10px] font-bold flex items-center gap-2 ${
                activeAnn.type === 'critical'
                  ? 'bg-rose-500 text-white'
                  : activeAnn.type === 'warning'
                  ? 'bg-amber-500 text-slate-900'
                  : activeAnn.type === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#6356E5] text-white'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{activeAnn.title}</span>
            </div>
          )}

          {/* Hero Banner Preview */}
          {activeBanner && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white min-h-[140px] flex flex-col justify-end p-3 shadow-xs">
              <img
                src={
                  device === 'mobile'
                    ? activeBanner.mobileImage || activeBanner.desktopImage
                    : activeBanner.desktopImage
                }
                alt={activeBanner.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="relative z-10 space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[8px] font-black uppercase">
                  Featured
                </span>
                <h4 className="text-xs font-black line-clamp-1">{activeBanner.title}</h4>
                <p className="text-[9px] text-white/80 line-clamp-1">{activeBanner.subtitle}</p>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#6356E5] text-white text-[9px] font-black shadow-xs">
                    {activeBanner.ctaText}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Ribbon */}
          {activeCamp && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-black text-emerald-900 truncate">{activeCamp.title}</span>
              </div>
              <span className="text-[9px] font-black text-emerald-700 underline shrink-0">
                {activeCamp.ctaText}
              </span>
            </div>
          )}

          {/* Trending Destinations Preview Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-800 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> Trending Destinations
              </span>
              <span className="text-[9px] font-bold text-[#6356E5]">See All</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {activeDests.map((d) => (
                <div
                  key={d.id}
                  className="relative rounded-xl overflow-hidden h-16 bg-slate-200 border border-slate-200 group"
                >
                  <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-1.5 text-white">
                    <span className="text-[9px] font-black leading-tight">{d.name}</span>
                    <span className="text-[7px] text-white/80">{d.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Agencies Preview */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-800">Verified Agencies</span>
              <span className="text-[9px] font-bold text-[#6356E5]">Top Rated</span>
            </div>

            <div className="space-y-1">
              {activeAgencies.map((a) => (
                <div
                  key={a.id}
                  className="p-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[9px]"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={a.agencyLogo}
                      alt={a.agencyName}
                      className="w-5 h-5 rounded-lg object-cover"
                    />
                    <span className="font-black text-slate-800 truncate">{a.agencyName}</span>
                  </div>
                  <span className="flex items-center gap-0.5 text-amber-600 font-black shrink-0">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {a.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
