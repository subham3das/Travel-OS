import React from 'react';
import { Sliders, Sun, Moon, Laptop, Globe, Bell, MessageSquare, Monitor } from 'lucide-react';
import { AdminPreferences } from '../../../types/profileManagement';

interface PreferencesCardProps {
  preferences: AdminPreferences;
  onUpdate: (updated: Partial<AdminPreferences>) => void;
}

export const PreferencesCard: React.FC<PreferencesCardProps> = ({
  preferences,
  onUpdate,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#0F172A]">Account Preferences</h3>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {/* Theme & Language Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Theme */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400">Interface Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Light', 'Dark', 'System'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdate({ theme: t })}
                  className={`py-2 px-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    preferences.theme === t
                      ? 'bg-[#6356E5] text-white border-[#6356E5] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t === 'Light' ? (
                    <Sun className="w-3.5 h-3.5" />
                  ) : t === 'Dark' ? (
                    <Moon className="w-3.5 h-3.5" />
                  ) : (
                    <Laptop className="w-3.5 h-3.5" />
                  )}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400">Platform Language</label>
            <div className="grid grid-cols-2 gap-2">
              {(['English', 'Hindi'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onUpdate({ language: l })}
                  className={`py-2 px-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    preferences.language === l
                      ? 'bg-[#6356E5] text-white border-[#6356E5] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Switches */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 block">Notification Channels</span>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-purple-600" />
              <div>
                <span className="font-bold text-slate-800 text-xs block">Email Notifications</span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Critical security alerts & system summaries
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdate({ emailNotifications: !preferences.emailNotifications })}
              className={`w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                preferences.emailNotifications ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  preferences.emailNotifications ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-slate-800 text-xs block">SMS Notifications</span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Instant OTP codes & emergency platform alerts
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdate({ smsNotifications: !preferences.smsNotifications })}
              className={`w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                preferences.smsNotifications ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  preferences.smsNotifications ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Desktop Push Notifications */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-bold text-slate-800 text-xs block">Desktop Notifications</span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Real-time agency requests & booking alerts
                </span>
              </div>
            </div>
            <button
              onClick={() => onUpdate({ desktopNotifications: !preferences.desktopNotifications })}
              className={`w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                preferences.desktopNotifications ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  preferences.desktopNotifications ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
