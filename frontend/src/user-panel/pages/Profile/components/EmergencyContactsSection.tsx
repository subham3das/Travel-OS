import React, { useState, useEffect } from 'react';
import { ShieldAlert, Phone, User, Save, Loader2, HeartPulse } from 'lucide-react';
import { travelProfileService, TravelProfileData } from '../../../services/travelProfile.service';
import { useToast } from '../../../context/ToastContext';

export const EmergencyContactsSection: React.FC = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<TravelProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    travelProfileService
      .getProfile()
      .then((res) => {
        setProfile(res.profile);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to load emergency contacts', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      await travelProfileService.updateProfile({
        emergencyContact: profile.emergencyContact,
        bloodGroup: profile.bloodGroup,
        medicalConditions: profile.medicalConditions,
        allergies: profile.allergies,
      });
      showToast('Emergency contacts updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-3">
        <Loader2 className="w-8 h-8 text-[#6356E5] animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Loading emergency contacts...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-black text-[#0F172A]">Emergency Contacts</h3>
          <p className="text-xs text-slate-400">
            Designated emergency contact reached immediately during emergencies while traveling.
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF4D6D] flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Contact Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={profile?.emergencyContact?.name || ''}
              onChange={(e) =>
                setProfile({
                  ...profile!,
                  emergencyContact: {
                    ...profile?.emergencyContact,
                    name: e.target.value,
                  },
                })
              }
              placeholder="e.g. Priya Sharma"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              value={profile?.emergencyContact?.phone || ''}
              onChange={(e) =>
                setProfile({
                  ...profile!,
                  emergencyContact: {
                    ...profile?.emergencyContact,
                    phone: e.target.value,
                  },
                })
              }
              placeholder="+91 98765 00000"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Relationship *
          </label>
          <input
            type="text"
            value={profile?.emergencyContact?.relationship || ''}
            onChange={(e) =>
              setProfile({
                ...profile!,
                emergencyContact: {
                  ...profile?.emergencyContact,
                  relationship: e.target.value,
                },
              })
            }
            placeholder="e.g. Spouse / Brother / Father"
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          This contact will be printed on manifests and emergency booking itineraries.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Contact</span>
        </button>
      </div>
    </form>
  );
};
