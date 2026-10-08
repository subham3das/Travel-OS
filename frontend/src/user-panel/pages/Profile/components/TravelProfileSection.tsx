import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Save,
  CheckCircle2,
  FileText,
  User,
  MapPin,
  HeartPulse,
  Compass,
  Loader2,
  Phone,
} from 'lucide-react';
import {
  travelProfileService,
  TravelProfileData,
  TravelProfileStats,
} from '../../../services/travelProfile.service';
import { UniversalImageUploader } from '../../../../components/common/UniversalImageUploader';
import { useToast } from '../../../context/ToastContext';

export const TravelProfileSection: React.FC = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<TravelProfileData | null>(null);
  const [stats, setStats] = useState<TravelProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'address' | 'medical' | 'documents' | 'preferences'>('info');

  const fetchProfile = async () => {
    try {
      const res = await travelProfileService.getProfile();
      setProfile(res.profile);
      setStats(res.stats);
    } catch (err: any) {
      showToast(err.message || 'Failed to load travel profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFieldChange = (field: keyof TravelProfileData, val: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: val });
  };

  const handleNestedChange = (parent: 'emergencyContact' | 'travelPreferences', field: string, val: any) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [parent]: {
        ...(profile[parent] as any),
        [field]: val,
      },
    });
  };

  const handleDocChange = (
    docType: 'aadhaar' | 'voterId' | 'drivingLicence' | 'passport',
    field: string,
    val: any
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [docType]: {
        ...((profile[docType] as any) || {}),
        [field]: val,
      },
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const updated = await travelProfileService.updateProfile(profile);
      setProfile(updated.profile);
      setStats(updated.stats);
      showToast('Travel Profile saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save travel profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-3">
        <Loader2 className="w-8 h-8 text-[#6356E5] animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Loading your Travel Profile...</p>
      </div>
    );
  }

  const completion = stats?.completionPercentage ?? profile?.completionPercentage ?? 40;
  const missing = stats?.missingFields ?? profile?.missingFields ?? [];

  return (
    <div className="space-y-6">
      {/* 1. Completion & Overview Hero Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#0F172A]">{completion}% Complete</span>
              {profile?.verificationStatus === 'VERIFIED' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Unverified
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium max-w-xl">
              Complete your travel profile to unlock 1-click bookings across all packages and services. You can fill details at your own pace or skip anytime.
            </p>

            {missing.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Missing:</span>
                {missing.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-rose-50 text-[#FF4D6D] text-[10px] font-bold border border-rose-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="sm:text-right shrink-0">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-sm shadow-[#6356E5]/25 hover:shadow-md hover:shadow-[#6356E5]/35 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <Save className="w-4 h-4 shrink-0" />}
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-4 border border-slate-200/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(5, completion)}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${
              completion >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : completion >= 50
                ? 'bg-gradient-to-r from-[#6356E5] to-indigo-400'
                : 'bg-gradient-to-r from-amber-500 to-[#FF4D6D]'
            }`}
          />
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'info', label: 'Personal Information', icon: User },
          { id: 'address', label: 'Address & Location', icon: MapPin },
          { id: 'medical', label: 'Medical & Emergency', icon: HeartPulse },
          { id: 'documents', label: 'Identity Documents', icon: FileText },
          { id: 'preferences', label: 'Travel Preferences', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-tab Content Panels */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-2xs space-y-6">
        {/* SUBTAB: Personal Information */}
        {activeSubTab === 'info' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#0F172A] border-b border-slate-100 pb-2">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile?.fullName || ''}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={profile?.dob ? profile.dob.split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Gender *
                </label>
                <select
                  value={profile?.gender || 'male'}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={profile?.nationality || 'Indian'}
                  onChange={(e) => handleFieldChange('nationality', e.target.value)}
                  placeholder="Indian"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile?.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: Address & Location */}
        {activeSubTab === 'address' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#0F172A] border-b border-slate-100 pb-2">
              Residential Address
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={profile?.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Flat / House No, Street name"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile?.city || ''}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={profile?.state || ''}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={profile?.country || 'India'}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    placeholder="India"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={profile?.pin || ''}
                    onChange={(e) => handleFieldChange('pin', e.target.value)}
                    placeholder="400001"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: Medical & Emergency */}
        {activeSubTab === 'medical' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-black text-[#0F172A] border-b border-slate-100 pb-2">
                Emergency Contact
              </h4>
              <p className="text-xs text-slate-400 mt-1 mb-3">
                Used in emergency situations during journeys and shared automatically with package operators.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={profile?.emergencyContact?.name || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                    placeholder="Primary contact name"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile?.emergencyContact?.phone || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={profile?.emergencyContact?.relationship || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                    placeholder="Spouse / Parent / Friend"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-[#0F172A] border-b border-slate-100 pb-2">
                Medical & Health Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={profile?.bloodGroup || ''}
                    onChange={(e) => handleFieldChange('bloodGroup', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Known Medical Conditions
                  </label>
                  <input
                    type="text"
                    value={profile?.medicalConditions || ''}
                    onChange={(e) => handleFieldChange('medicalConditions', e.target.value)}
                    placeholder="e.g. Asthma, Diabetes (or None)"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Allergies
                  </label>
                  <input
                    type="text"
                    value={profile?.allergies || ''}
                    onChange={(e) => handleFieldChange('allergies', e.target.value)}
                    placeholder="e.g. Peanuts, Penicillin (or None)"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: Identity Documents */}
        {activeSubTab === 'documents' && (
          <div className="space-y-6">
            {/* Government ID Rule Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6356E5] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                    Government ID Verification (Mandatory for Bookings)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 max-w-xl">
                    Every traveler must have <span className="font-bold text-[#6356E5]">at least one primary Government ID</span> before completing a booking. Choose either <span className="font-bold">Aadhaar Card</span> (Front & Back) or <span className="font-bold">Voter ID Card</span> (Front).
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="shrink-0 sm:text-right">
                {profile?.aadhaar?.frontUrl && profile?.aadhaar?.backUrl ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Aadhaar Verified</span>
                  </span>
                ) : profile?.voterId?.frontUrl ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Voter ID Verified</span>
                  </span>
                ) : profile?.aadhaar?.frontUrl ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Aadhaar Back Side Needed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Primary ID Required</span>
                  </span>
                )}
              </div>
            </div>

            {/* SECTION 1: PRIMARY GOVERNMENT ID (CHOOSE ONE) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Primary Government ID (Required — Choose One)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Upload either Aadhaar Card (both sides mandatory) or Voter ID Card (front side).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Aadhaar Card */}
                <div className="min-w-0 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-black text-[#0F172A] truncate">Aadhaar Card</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#6356E5] border border-indigo-100">
                        Front + Back Mandatory
                      </span>
                    </div>
                    {profile?.aadhaar?.frontUrl && profile?.aadhaar?.backUrl && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={profile?.aadhaar?.number || ''}
                    onChange={(e) => handleDocChange('aadhaar', 'number', e.target.value)}
                    placeholder="12-digit Aadhaar Number (e.g. 5432 1098 7654)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <UniversalImageUploader
                      label="Front Side *"
                      helpText="Photo & UIDAI details"
                      folder="travelos/documents/aadhaar"
                      allowPdf={true}
                      compact={true}
                      value={profile?.aadhaar?.frontUrl || ''}
                      onChange={(url) => handleDocChange('aadhaar', 'frontUrl', url)}
                    />
                    <UniversalImageUploader
                      label="Back Side *"
                      helpText="Address & barcode"
                      folder="travelos/documents/aadhaar"
                      allowPdf={true}
                      compact={true}
                      value={profile?.aadhaar?.backUrl || ''}
                      onChange={(url) => handleDocChange('aadhaar', 'backUrl', url)}
                    />
                  </div>
                </div>

                {/* 2. Voter ID Card */}
                <div className="min-w-0 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-black text-[#0F172A] truncate">Voter ID Card (EPIC)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Front Side Only
                      </span>
                    </div>
                    {profile?.voterId?.frontUrl && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={profile?.voterId?.number || ''}
                    onChange={(e) => handleDocChange('voterId', 'number', e.target.value)}
                    placeholder="Voter ID / EPIC Number (e.g. ABC1234567)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />

                  <div className="pt-1">
                    <UniversalImageUploader
                      label="Front Side Scan / Photo *"
                      helpText="Photo, Name & EPIC No. (PDF / Image)"
                      folder="travelos/documents/voter_id"
                      allowPdf={true}
                      compact={true}
                      value={profile?.voterId?.frontUrl || ''}
                      onChange={(url) => handleDocChange('voterId', 'frontUrl', url)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: OPTIONAL DOCUMENTS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Optional Documents
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Driving Licence and Passport are optional. You can add them anytime.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 3. Driving Licence */}
                <div className="min-w-0 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-[#0F172A] truncate">Driving Licence (Optional)</span>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">Front & Back if added</span>
                  </div>

                  <input
                    type="text"
                    value={profile?.drivingLicence?.number || ''}
                    onChange={(e) => handleDocChange('drivingLicence', 'number', e.target.value)}
                    placeholder="Driving Licence Number (e.g. DL-1420110012345)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <UniversalImageUploader
                      label="Front Side"
                      helpText="Photo & Licence No."
                      folder="travelos/documents/dl"
                      allowPdf={true}
                      compact={true}
                      value={profile?.drivingLicence?.frontUrl || ''}
                      onChange={(url) => handleDocChange('drivingLicence', 'frontUrl', url)}
                    />
                    <UniversalImageUploader
                      label="Back Side"
                      helpText="Authorised vehicles & address"
                      folder="travelos/documents/dl"
                      allowPdf={true}
                      compact={true}
                      value={profile?.drivingLicence?.backUrl || ''}
                      onChange={(url) => handleDocChange('drivingLicence', 'backUrl', url)}
                    />
                  </div>
                </div>

                {/* 4. Passport */}
                <div className="min-w-0 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-[#0F172A] truncate">Passport (Optional)</span>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">Photo / Info Page Only</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={profile?.passport?.number || ''}
                      onChange={(e) => handleDocChange('passport', 'number', e.target.value)}
                      placeholder="Passport Number"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                    />
                    <input
                      type="date"
                      value={profile?.passport?.expiryDate ? profile.passport.expiryDate.split('T')[0] : ''}
                      onChange={(e) => handleDocChange('passport', 'expiryDate', e.target.value)}
                      placeholder="Expiry Date"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                    />
                  </div>

                  <div className="pt-1">
                    <UniversalImageUploader
                      label="Passport Photo / Information Page"
                      helpText="Only one image scan (PDF / Image)"
                      folder="travelos/documents/passports"
                      allowPdf={true}
                      compact={true}
                      value={profile?.passport?.documentUrl || ''}
                      onChange={(url) => handleDocChange('passport', 'documentUrl', url)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: Travel Preferences */}
        {activeSubTab === 'preferences' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#0F172A] border-b border-slate-100 pb-2">
              Journey & Seat Preferences
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Seat Preference
                </label>
                <select
                  value={profile?.travelPreferences?.seatPreference || 'Any'}
                  onChange={(e) => handleNestedChange('travelPreferences', 'seatPreference', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                >
                  <option value="Any">Any</option>
                  <option value="Window">Window</option>
                  <option value="Aisle">Aisle</option>
                  <option value="Front Row">Front Row</option>
                  <option value="Lower Berth">Lower Berth</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Meal Preference
                </label>
                <select
                  value={profile?.travelPreferences?.mealPreference || 'Standard'}
                  onChange={(e) => handleNestedChange('travelPreferences', 'mealPreference', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                >
                  <option value="Standard">Standard</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Jain Meal">Jain Meal</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten Free">Gluten Free</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Special Assistance
                </label>
                <input
                  type="text"
                  value={profile?.travelPreferences?.specialAssistance || ''}
                  onChange={(e) => handleNestedChange('travelPreferences', 'specialAssistance', e.target.value)}
                  placeholder="Wheelchair assistance, etc."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Changes are saved to your account and sync seamlessly to all future bookings.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-sm shadow-[#6356E5]/25 hover:shadow-md hover:shadow-[#6356E5]/35 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <Save className="w-4 h-4 shrink-0" />}
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
