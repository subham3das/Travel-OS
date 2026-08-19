import React, { useState } from 'react';
import {
  Edit2,
  Upload,
  ChevronDown,
  Users,
  Wallet,
  BookMarked,
  Gift,
  Sparkles,
  Users2,
  Film,
  Calendar,
  Shield,
  CreditCard,
  Code,
  Bell,
  Wrench,
  Database,
  Cloud,
  Check,
  CheckCircle2,
} from 'lucide-react';
import {
  GeneralSettingsData,
  FeatureFlagItem,
  SettingsCategoryType,
} from '../../../types/settingsManagement';

interface DynamicSettingsWorkspaceProps {
  category: SettingsCategoryType;
  generalSettings: GeneralSettingsData;
  featureFlags: FeatureFlagItem[];
  onUpdateGeneral: (data: Partial<GeneralSettingsData>) => void;
  onToggleFeature: (id: string, enabled: boolean) => void;
  onLogoUpload: () => void;
}

export const DynamicSettingsWorkspace: React.FC<DynamicSettingsWorkspaceProps> = ({
  category,
  generalSettings,
  featureFlags,
  onUpdateGeneral,
  onToggleFeature,
  onLogoUpload,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('General Settings');
  const subTabs = ['General Settings', 'Company Info', 'Contact Details', 'System Preferences'];

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'Wallet':
        return <Wallet className="w-3.5 h-3.5 text-emerald-600" />;
      case 'BookMarked':
        return <BookMarked className="w-3.5 h-3.5 text-blue-600" />;
      case 'Gift':
        return <Gift className="w-3.5 h-3.5 text-pink-600" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'Users2':
        return <Users2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Film':
        return <Film className="w-3.5 h-3.5 text-amber-600" />;
      case 'Calendar':
      default:
        return <Calendar className="w-3.5 h-3.5 text-cyan-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. Sub-Tabs Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100/80 pb-2 overflow-x-auto scrollbar-none">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer truncate ${
                isActive
                  ? 'bg-purple-50 text-[#6356E5] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {category === 'general' && (
        <div className="space-y-4">
          {/* ── 2. Top Row: Platform Details + Logo Card ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Platform Details (lg:col-span-8) */}
            <div className="lg:col-span-8 p-4 rounded-3xl bg-slate-50/40 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-purple-50 text-[#6356E5] flex items-center justify-center">
                    <Edit2 className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs font-black text-[#0F172A]">Platform Details</h4>
                </div>

                <button className="flex items-center gap-1 text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer">
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Platform Name</label>
                  <input
                    type="text"
                    value={generalSettings.platformName}
                    onChange={(e) => onUpdateGeneral({ platformName: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Company Email</label>
                  <input
                    type="email"
                    value={generalSettings.companyEmail}
                    onChange={(e) => onUpdateGeneral({ companyEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Website URL</label>
                  <input
                    type="text"
                    value={generalSettings.websiteUrl}
                    onChange={(e) => onUpdateGeneral({ websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => onUpdateGeneral({ timezone: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Asia/Dubai">Asia/Dubai</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Currency</label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) => onUpdateGeneral({ currency: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="AED (د.إ)">AED (د.إ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Language</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => onUpdateGeneral({ language: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6356E5]"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Platform Logo (lg:col-span-4) */}
            <div className="lg:col-span-4 p-4 rounded-3xl bg-slate-50/40 border border-slate-100 flex flex-col items-center justify-between text-center space-y-2">
              <h4 className="text-xs font-black text-[#0F172A] self-start">Platform Logo</h4>

              {/* Logo Emblem */}
              <div className="flex flex-col items-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-[#6356E5] text-white flex items-center justify-center shadow-md shadow-[#6356E5]/25 mb-1.5">
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 22h20L12 2zm0 6l5 10H7l5-10z" />
                  </svg>
                </div>
                <h5 className="font-black text-slate-900 text-sm tracking-tight">Travel OS</h5>
              </div>

              {/* Upload CTA */}
              <div className="w-full space-y-1.5">
                <button
                  onClick={onLogoUpload}
                  className="text-[11px] font-black text-[#6356E5] hover:underline block mx-auto cursor-pointer"
                >
                  Upload new logo
                </button>

                <div className="border border-dashed border-slate-200 rounded-2xl p-2 bg-white text-[9px] text-slate-400 font-medium">
                  <p>Drag & drop or click to upload</p>
                  <p className="font-mono">Recommended: 512x512</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Middle Row: Preferences + System Information ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Preferences */}
            <div className="p-4 rounded-3xl bg-slate-50/40 border border-slate-100 space-y-2.5">
              <h4 className="text-xs font-black text-[#0F172A] pb-1 border-b border-slate-200/60">
                Preferences
              </h4>

              <div className="space-y-2 text-xs">
                {/* Maintenance Mode */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="font-black text-slate-800 text-[11px] block truncate">
                      Enable Maintenance Mode
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Temporarily disable platform for maintenance
                    </span>
                  </div>
                  <button
                    onClick={() => onUpdateGeneral({ maintenanceMode: !generalSettings.maintenanceMode })}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 ${
                      generalSettings.maintenanceMode ? 'bg-[#6356E5]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        generalSettings.maintenanceMode ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* User Registration */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="font-black text-slate-800 text-[11px] block truncate">
                      Enable User Registration
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Allow new users to sign up
                    </span>
                  </div>
                  <button
                    onClick={() => onUpdateGeneral({ userRegistration: !generalSettings.userRegistration })}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 ${
                      generalSettings.userRegistration ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        generalSettings.userRegistration ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="font-black text-slate-800 text-[11px] block truncate">
                      Email Notifications
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Send system notifications
                    </span>
                  </div>
                  <button
                    onClick={() => onUpdateGeneral({ emailNotifications: !generalSettings.emailNotifications })}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 ${
                      generalSettings.emailNotifications ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        generalSettings.emailNotifications ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="font-black text-slate-800 text-[11px] block truncate">
                      Push Notifications
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Enable push notifications
                    </span>
                  </div>
                  <button
                    onClick={() => onUpdateGeneral({ pushNotifications: !generalSettings.pushNotifications })}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors shrink-0 ${
                      generalSettings.pushNotifications ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        generalSettings.pushNotifications ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: System Information */}
            <div className="p-4 rounded-3xl bg-slate-50/40 border border-slate-100 space-y-2.5">
              <h4 className="text-xs font-black text-[#0F172A] pb-1 border-b border-slate-200/60">
                System Information
              </h4>

              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Platform Version</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                    <span>{generalSettings.platformVersion}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black border border-emerald-200">
                      Up to date
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Build Number</span>
                  <span className="font-mono font-bold text-slate-700">{generalSettings.buildNumber}</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Environment</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{generalSettings.environment}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Server Location</span>
                  <span className="font-bold text-slate-700">{generalSettings.serverLocation}</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Uptime</span>
                  <span className="font-mono font-bold text-slate-700">{generalSettings.uptime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. Bottom Row: Feature Flags Grid ── */}
          <div className="p-4 rounded-3xl bg-slate-50/40 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-[#0F172A]">Feature Flags</h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Enable or disable platform features
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {featureFlags.map((feat) => (
                <div
                  key={feat.id}
                  className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getFeatureIcon(feat.iconType)}
                    </div>

                    <button
                      onClick={() => onToggleFeature(feat.id, !feat.enabled)}
                      className={`w-6 h-3.5 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                        feat.enabled ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                          feat.enabled ? 'translate-x-2.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-black text-slate-800 truncate">
                        {feat.name}
                      </span>
                      {feat.isBeta && (
                        <span className="px-1 py-0.2 rounded-md bg-blue-50 text-blue-600 text-[8px] font-black">
                          Beta
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium truncate">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {category !== 'general' && (
        <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 capitalize">
              {category} Configuration Active
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Configure parameters, keys, and operational controls for {category}. Changes are synced across nodes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
