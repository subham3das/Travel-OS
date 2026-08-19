import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { CampaignItem } from '../../../types/notificationsManagement';

interface NotificationDevicePreviewProps {
  campaign: CampaignItem;
  onTestOnDevice?: () => void;
}

export const NotificationDevicePreview: React.FC<NotificationDevicePreviewProps> = ({
  campaign,
  onTestOnDevice,
}) => {
  const [platform, setPlatform] = useState<'Android' | 'iPhone' | 'Email' | 'In-App Banner'>('Android');

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3.5">
      {/* ── 1. Header & Platform Tabs ── */}
      <div className="space-y-2 pb-2 border-b border-slate-100/80">
        <h3 className="text-xs font-black text-[#0F172A]">Preview</h3>

        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
          {(['Android', 'iPhone', 'Email', 'In-App Banner'] as const).map((p) => {
            const isSelected = platform === p;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer truncate ${
                  isSelected
                    ? 'bg-[#6356E5] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Smartphone Mockup Frame ── */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div className="w-[260px] sm:w-[280px] rounded-[36px] bg-[#1E293B] p-3.5 border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Top Notch & Status Bar */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-2 pt-1 pb-2">
            <span>10:30</span>
            <div className="w-12 h-3.5 bg-slate-900 rounded-full mx-auto" />
            <span>100%</span>
          </div>

          {/* Center Lockscreen Clock */}
          <div className="text-center py-4 text-white">
            <h2 className="text-3xl font-light tracking-tight">10:30</h2>
            <p className="text-[11px] text-slate-300 font-medium">Monday, May 20</p>
          </div>

          {/* Floating Push Notification Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-xl space-y-2 my-auto">
            {/* Header: App icon + Name + Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md bg-[#6356E5] text-white flex items-center justify-center text-[8px] font-black">
                  T
                </div>
                <span className="text-[11px] font-black text-slate-900">Travel OS</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">now</span>
            </div>

            {/* Notification Body */}
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                {campaign.title || 'Monsoon Special Packages ☔'}
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug line-clamp-3">
                {campaign.message ||
                  'Explore amazing destinations with exclusive discounts upto 30% OFF. Hurry! Offer valid till 31st May.'}
              </p>
            </div>

            {/* Attached Banner Image Preview */}
            {campaign.bannerImage && (
              <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={campaign.bannerImage}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Bottom lock screen bar */}
          <div className="w-24 h-1 bg-slate-500 rounded-full mx-auto mt-auto mb-1 opacity-70" />
        </div>
      </div>

      {/* ── 3. Footer Subtext & Test Button ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          This is how your push notification will appear on {platform} devices.
        </p>

        <button
          onClick={onTestOnDevice}
          className="w-full py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          <span>Test on Device</span>
        </button>
      </div>
    </div>
  );
};
