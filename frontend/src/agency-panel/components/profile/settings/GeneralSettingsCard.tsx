import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Globe2, Clock, DollarSign, Calendar, Eye, FileText, Sun, Moon, Laptop } from 'lucide-react';
import { GeneralSettingsData } from '../../../data/profile';
import { useTheme } from '../../../../theme/ThemeContext';

interface GeneralSettingsCardProps {
  data: GeneralSettingsData;
  isEditing: boolean;
  onChange: (updated: Partial<GeneralSettingsData>) => void;
}

export const GeneralSettingsCard: React.FC<GeneralSettingsCardProps> = ({
  data,
  isEditing,
  onChange,
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-100/90 dark:border-white/10 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
        <Globe className="w-5 h-5 text-[#2563EB]" />
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white">General Settings</h3>
          <p className="text-[11px] font-semibold text-slate-400">Basic agency preferences, regional & system defaults</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Agency Name */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Agency Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={data.agencyName}
              onChange={(e) => onChange({ agencyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.agencyName}
            </div>
          )}
        </div>

        {/* Business Description */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            Business Description
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={data.businessDescription}
              onChange={(e) => onChange({ businessDescription: e.target.value })}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB] resize-none"
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-semibold text-slate-700 leading-relaxed">
              {data.businessDescription}
            </div>
          )}
        </div>

        {/* Timezone */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Timezone
          </label>
          {isEditing ? (
            <select
              value={data.timezone}
              onChange={(e) => onChange({ timezone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="(UTC+05:30) India Standard Time">(UTC+05:30) IST - Kolkata</option>
              <option value="(UTC+00:00) UTC">(UTC+00:00) UTC</option>
              <option value="(UTC-05:00) EST">(UTC-05:00) EST - New York</option>
            </select>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.timezone}
            </div>
          )}
        </div>

        {/* Language */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" /> Language
          </label>
          {isEditing ? (
            <select
              value={data.language}
              onChange={(e) => onChange({ language: e.target.value })}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="English (US)">English (US)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
            </select>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.language}
            </div>
          )}
        </div>

        {/* Currency */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Currency
          </label>
          {isEditing ? (
            <select
              value={data.currency}
              onChange={(e) => onChange({ currency: e.target.value })}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
            </select>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-extrabold text-[#0F172A]">
              {data.currency}
            </div>
          )}
        </div>

        {/* Profile Visibility */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" /> Profile Visibility
          </label>
          {isEditing ? (
            <select
              value={data.profileVisibility}
              onChange={(e) => onChange({ profileVisibility: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="Public">Public (Listed on Travel OS)</option>
              <option value="Private">Private (Invite only)</option>
              <option value="Unlisted">Unlisted (Link sharing)</option>
            </select>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 font-extrabold text-emerald-800">
              {data.profileVisibility} (Listed on Travel OS Marketplace)
            </div>
          )}
        </div>

        {/* Interface Theme (Unified Light/Dark/System) */}
        <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Interface Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Light', label: '☀️ Light', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
              { id: 'Dark', label: '🌙 Dark', icon: <Moon className="w-3.5 h-3.5 text-blue-500" /> },
              { id: 'System', label: '💻 System', icon: <Laptop className="w-3.5 h-3.5 text-cyan-500" /> },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id as any)}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === t.id
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GeneralSettingsCard;
