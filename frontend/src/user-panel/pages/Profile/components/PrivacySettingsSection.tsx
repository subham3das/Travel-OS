import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Save, Loader2, Lock } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const PrivacySettingsSection: React.FC = () => {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    publicProfile: true,
    showTravelStats: true,
    showHomeCity: true,
    appearInSearch: true,
    shareDocsWithAgencyOnly: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Privacy preferences saved!', 'success');
    }, 400);
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-black text-[#0F172A]">Privacy & Security Controls</h3>
          <p className="text-xs text-slate-400">
            Control your profile visibility and who can view your travel credentials.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {[
          {
            key: 'publicProfile',
            title: 'Public Traveler Profile',
            desc: 'Allow other verified explorers to view your public traveler card',
          },
          {
            key: 'showTravelStats',
            title: 'Show Travel Statistics',
            desc: 'Display trips completed, states visited, and verified badges',
          },
          {
            key: 'showHomeCity',
            title: 'Show Home City',
            desc: 'Display your home state and city on your public profile',
          },
          {
            key: 'appearInSearch',
            title: 'Discoverable in Search',
            desc: 'Allow fellow trip members to find and connect with you',
          },
          {
            key: 'shareDocsWithAgencyOnly',
            title: 'Strict Document Security',
            desc: 'Only authorized verified tour operators of confirmed bookings can view identity documents',
          },
        ].map((item) => {
          const isEnabled = settings[item.key as keyof typeof settings];
          return (
            <div key={item.key} className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => toggle(item.key as any)}
                className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                  isEnabled ? 'bg-[#6356E5]' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform ${
                    isEnabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">Security tokens are encrypted end-to-end.</p>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Preferences</span>
        </button>
      </div>
    </form>
  );
};
