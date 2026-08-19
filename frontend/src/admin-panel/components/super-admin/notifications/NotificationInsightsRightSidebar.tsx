import React, { useState } from 'react';
import {
  Pin,
  Building2,
  Package,
  CreditCard,
  Sparkles,
  Bell,
  AlertTriangle,
  Shield,
  FileCheck,
  Wallet,
  ChevronDown,
  Monitor,
  Mail,
  Volume2,
  MessageCircle,
  Moon,
  ChevronRight,
} from 'lucide-react';
import {
  PinnedNotificationItem,
  AISummaryData,
  NotificationPreferencesData,
} from '../../../types/advancedNotificationCenter';

interface NotificationInsightsRightSidebarProps {
  pinned: PinnedNotificationItem[];
  aiSummary: AISummaryData;
  preferences: NotificationPreferencesData;
  onUpdatePreferences: (partial: Partial<NotificationPreferencesData>) => void;
  onOpenAISummaryModal: () => void;
  onSelectPinned: (item: PinnedNotificationItem) => void;
}

export const NotificationInsightsRightSidebar: React.FC<
  NotificationInsightsRightSidebarProps
> = ({
  pinned,
  aiSummary,
  preferences,
  onUpdatePreferences,
  onOpenAISummaryModal,
  onSelectPinned,
}) => {
  const [summaryPeriod, setSummaryPeriod] = useState<'Today' | 'This Week'>('Today');

  const getPinnedIcon = (type: PinnedNotificationItem['iconType']) => {
    switch (type) {
      case 'agency':
        return <Building2 className="w-4 h-4 text-[#6356E5]" />;
      case 'package':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'refund':
      default:
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* ── 1. Pinned Notifications Card ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <div className="flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-[#6356E5]" />
            <h3 className="text-xs font-black text-[#0F172A]">Pinned Notifications</h3>
          </div>
          <button
            type="button"
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>

        <div className="space-y-2">
          {pinned.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPinned(item)}
              className="p-2.5 rounded-2xl bg-slate-50/70 hover:bg-purple-50/70 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                  {getPinnedIcon(item.iconType)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {item.subtitle}
                  </p>
                  <span className="text-[9px] text-slate-400 font-semibold block">
                    {item.timeAgo}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <Pin className="w-3 h-3 text-[#6356E5] fill-[#6356E5]/20" />
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[8px] font-black ${
                    item.priority === 'High'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. AI Summary Card ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#6356E5]" />
            <h3 className="text-xs font-black text-[#0F172A]">AI Summary</h3>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#6356E5] cursor-pointer"
          >
            <span>{summaryPeriod}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        <div className="space-y-2 text-xs font-bold text-slate-700">
          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-[#6356E5]" />
              <span className="text-[11px]">New notifications</span>
            </div>
            <span className="text-xs font-black text-[#0F172A]">{aiSummary.newCount}</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px]">Need immediate action</span>
            </div>
            <span className="text-xs font-black text-amber-600">
              {aiSummary.immediateActionCount}
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[11px]">Critical alerts</span>
            </div>
            <span className="text-xs font-black text-rose-600">
              {aiSummary.criticalAlertsCount}
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px]">Approvals pending</span>
            </div>
            <span className="text-xs font-black text-blue-600">
              {aiSummary.approvalsPendingCount}
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50">
            <div className="flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px]">Payment failures</span>
            </div>
            <span className="text-xs font-black text-emerald-600">
              {aiSummary.paymentFailuresCount}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAISummaryModal}
          className="w-full py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 transition-all cursor-pointer"
        >
          View Full Summary
        </button>
      </div>

      {/* ── 3. Notification Preferences Card ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Notification Preferences</h3>
          <button
            type="button"
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Desktop Push */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700">Desktop Push</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ desktopPush: !preferences.desktopPush })}
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                preferences.desktopPush ? 'bg-[#6356E5]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  preferences.desktopPush ? 'left-4' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700">Email Notifications</span>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdatePreferences({ emailNotifications: !preferences.emailNotifications })
              }
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                preferences.emailNotifications ? 'bg-[#6356E5]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  preferences.emailNotifications ? 'left-4' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700">Sound Alerts</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ soundAlerts: !preferences.soundAlerts })}
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                preferences.soundAlerts ? 'bg-[#6356E5]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  preferences.soundAlerts ? 'left-4' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* WhatsApp Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700">WhatsApp Alerts</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ whatsappAlerts: !preferences.whatsappAlerts })}
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                preferences.whatsappAlerts ? 'bg-[#6356E5]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  preferences.whatsappAlerts ? 'left-4' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Snooze */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700">Snooze Notifications</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
              <span>{preferences.snooze}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
