import React from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Plus,
  X,
  Users,
  Bold,
  Italic,
  Underline,
  Link,
  Smile,
  Image,
  Paperclip,
  Upload,
  ChevronDown,
  Send,
} from 'lucide-react';
import {
  CampaignItem,
  CampaignNotificationType,
} from '../../../types/notificationsManagement';

interface CampaignBuilderProps {
  campaign: CampaignItem;
  onChange: (updated: Partial<CampaignItem>) => void;
  onClearAll: () => void;
  onSaveDraft: () => void;
  onSendNow: () => void;
  onUploadImage?: () => void;
}

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
  campaign,
  onChange,
  onClearAll,
  onSaveDraft,
  onSendNow,
  onUploadImage,
}) => {
  const notificationTypes: CampaignNotificationType[] = ['Push', 'Email', 'SMS', 'In-App'];

  const getTypeIcon = (type: CampaignNotificationType) => {
    switch (type) {
      case 'Push':
        return <Bell className="w-3.5 h-3.5" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'SMS':
        return <MessageSquare className="w-3.5 h-3.5" />;
      case 'In-App':
      default:
        return <Smartphone className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-4">
      {/* ── 1. Header ── */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <h3 className="text-xs font-black text-[#0F172A]">Campaign Builder</h3>
        <button
          onClick={onClearAll}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[640px] pr-1 scrollbar-thin">
        {/* ── 2. Campaign Title & Notification Type ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">
              Campaign Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={campaign.title}
              onChange={(e) => {
                onChange({ title: e.target.value, name: e.target.value });
              }}
              placeholder="e.g. Monsoon Special Packages ☔"
              className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
            />
          </div>

          <div className="md:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Notification Type</label>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
              {notificationTypes.map((type) => {
                const isSelected = campaign.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ type })}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#6356E5] shadow-xs border border-purple-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {getTypeIcon(type)}
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 3. Audience Targeting ── */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Audience</label>
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#6356E5]/10 text-[#6356E5] text-xs font-bold border border-purple-200">
                <span>{campaign.audience}</span>
                <X className="w-3 h-3 hover:text-rose-500 cursor-pointer" />
              </span>

              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-slate-400" />
                <span>Add Segment</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold shrink-0">
              <span>Estimated:</span>
              <span className="flex items-center gap-1 text-slate-800 font-mono font-black">
                <Users className="w-3 h-3 text-slate-400" />
                <span>{campaign.audienceReach} Users</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── 4. Message Editor & Add Media ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
          {/* Message Box */}
          <div className="md:col-span-8 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Message</label>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-[#6356E5] focus-within:bg-white transition-all overflow-hidden shadow-2xs">
              {/* Rich Editor Toolbar */}
              <div className="flex items-center gap-1.5 p-2 bg-slate-100/70 border-b border-slate-200/80 text-slate-500 text-xs">
                <button type="button" className="p-1 hover:bg-slate-200 rounded-md">
                  <Bold className="w-3 h-3" />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded-md">
                  <Italic className="w-3 h-3" />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded-md">
                  <Underline className="w-3 h-3" />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded-md">
                  <Link className="w-3 h-3" />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded-md">
                  <Smile className="w-3 h-3" />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded-md">
                  <Image className="w-3 h-3" />
                </button>
                <button type="button" className="p-1 hover:bg-slate-200 rounded-md">
                  <Paperclip className="w-3 h-3" />
                </button>
              </div>

              <textarea
                value={campaign.message}
                onChange={(e) => onChange({ message: e.target.value })}
                placeholder="Write your notification copy here..."
                rows={5}
                className="w-full p-3 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex justify-end p-2 text-[10px] font-mono font-bold text-slate-400 border-t border-slate-100">
                <span>{campaign.message.length} / 350</span>
              </div>
            </div>
          </div>

          {/* Add Media */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Add Media</label>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col items-center justify-center text-center">
              {campaign.bannerImage ? (
                <div className="relative w-full h-24 rounded-xl overflow-hidden group">
                  <img
                    src={campaign.bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onChange({ bannerImage: undefined })}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-4 text-slate-400 space-y-1">
                  <Image className="w-6 h-6 mx-auto opacity-50" />
                  <p className="text-[10px] font-bold">No image attached</p>
                </div>
              )}

              <button
                type="button"
                onClick={onUploadImage}
                className="w-full py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3 h-3 text-slate-400" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 5. CTA & Deep Link ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Call To Action (Optional)</label>
            <div className="relative">
              <select
                value={campaign.ctaText}
                onChange={(e) => onChange({ ctaText: e.target.value })}
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5] appearance-none"
              >
                <option value="Visit Packages">Visit Packages</option>
                <option value="Explore Sale">Explore Sale</option>
                <option value="View Destinations">View Destinations</option>
                <option value="Check Booking">Check Booking</option>
                <option value="Open App">Open App</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Deep Link / Target Screen</label>
            <input
              type="text"
              value={campaign.deepLink}
              onChange={(e) => onChange({ deepLink: e.target.value })}
              placeholder="e.g. /packages/monsoon-special"
              className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs font-mono"
            />
          </div>
        </div>

        {/* ── 6. Schedule & Time Zone ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1 border-t border-slate-100">
          <div className="md:col-span-6 flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="schedule_mode"
                checked={campaign.status !== 'Scheduled'}
                onChange={() => onChange({ status: 'Draft' })}
                className="text-[#6356E5] focus:ring-[#6356E5]"
              />
              <span>Send Now</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="schedule_mode"
                checked={campaign.status === 'Scheduled'}
                onChange={() => onChange({ status: 'Scheduled', scheduleTime: 'Tomorrow 10:00 AM' })}
                className="text-[#6356E5] focus:ring-[#6356E5]"
              />
              <span>Schedule For Later</span>
            </label>
          </div>

          <div className="md:col-span-6 space-y-1">
            <label className="text-[10px] font-bold text-slate-400">Time Zone</label>
            <div className="relative">
              <select
                value={campaign.timeZone}
                onChange={(e) => onChange({ timeZone: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5] appearance-none"
              >
                <option value="(GMT +05:30) Asia/Kolkata">(GMT +05:30) Asia/Kolkata</option>
                <option value="(GMT +00:00) UTC">(GMT +00:00) UTC</option>
                <option value="(GMT -05:00) America/New_York">(GMT -05:00) America/New_York</option>
                <option value="(GMT +08:00) Asia/Singapore">(GMT +08:00) Asia/Singapore</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Bottom Action Toolbar ── */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onSaveDraft}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
        >
          Save Draft
        </button>

        <button
          type="button"
          onClick={onSendNow}
          className="px-6 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Now</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>
      </div>
    </div>
  );
};
