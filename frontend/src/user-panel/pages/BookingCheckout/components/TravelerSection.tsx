import React, { useState } from 'react';
import { UserCheck, Users, Plus, Trash2, AlertCircle, HeartPulse, ChevronRight, CheckCircle2 } from 'lucide-react';
import { TravelerSectionData, AdditionalTraveler } from '../types/checkout';

interface TravelerSectionProps {
  packageData: {
    id: string;
    title: string;
    agencyName: string;
    agencyVerified: boolean;
    price: string;
    duration: string;
    coverImage: string;
    departureDate: string;
  };
  initialData: TravelerSectionData;
  isCollapsed: boolean;
  onSave: (data: TravelerSectionData) => void;
  onEdit: () => void;
}

export const TravelerSection: React.FC<TravelerSectionProps> = ({
  packageData,
  initialData,
  isCollapsed,
  onSave,
  onEdit,
}) => {
  const [data, setData] = useState<TravelerSectionData>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const totalTravelerCount = 1 + data.additionalTravelers.length;

  const handleLeadChange = (field: keyof typeof data.leadTraveler, val: string) => {
    setData((prev) => ({
      ...prev,
      leadTraveler: { ...prev.leadTraveler, [field]: val },
    }));
  };

  const handleAddCompanion = () => {
    const newComp: AdditionalTraveler = {
      id: `comp-${Date.now()}`,
      fullName: '',
      gender: 'Male',
      dob: '',
      idProofType: 'Aadhaar Card',
      idProofNumber: '',
      emergencyContact: data.leadTraveler.phone,
    };
    setData((prev) => ({
      ...prev,
      additionalTravelers: [...prev.additionalTravelers, newComp],
    }));
  };

  const handleRemoveCompanion = (idToRemove: string) => {
    setData((prev) => ({
      ...prev,
      additionalTravelers: prev.additionalTravelers.filter((c) => c.id !== idToRemove),
    }));
  };

  const handleCompanionChange = (id: string, field: keyof AdditionalTraveler, val: string) => {
    setData((prev) => ({
      ...prev,
      additionalTravelers: prev.additionalTravelers.map((c) =>
        c.id === id ? { ...c, [field]: val } : c
      ),
    }));
  };

  const handleEmergencyChange = (field: keyof typeof data.emergencyContact, val: string) => {
    setData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: val },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!data.leadTraveler.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.leadTraveler.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!data.leadTraveler.email.trim()) newErrors.email = 'Email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Please fill out all required fields for the primary traveler.');
      return;
    }

    setErrors({});
    onSave(data);
  };

  if (isCollapsed) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-purple-100/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0F172A]">Traveler Details Saved</h3>
              <p className="text-[11px] font-semibold text-slate-400">
                {data.leadTraveler.fullName} + {data.additionalTravelers.length} Companions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-black transition-all cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="section-traveler" className="space-y-6 scroll-mt-24">
      {/* Package Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img
          src={packageData.coverImage}
          alt={packageData.title}
          className="w-full sm:w-24 h-24 rounded-2xl object-cover shrink-0 shadow-xs"
        />
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black uppercase tracking-wider">
              {packageData.duration}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
              ID: {packageData.id}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-[#0F172A] leading-tight">
            {packageData.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 pt-0.5">
            <span>by <strong className="text-slate-800">{packageData.agencyName}</strong></span>
            <span>•</span>
            <span>Date: <strong className="text-slate-800">{packageData.departureDate}</strong></span>
            <span>•</span>
            <span>Travelers: <strong className="text-[#583BE8]">{totalTravelerCount} Person(s)</strong></span>
          </div>
        </div>
      </div>

      {/* Main Traveler Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#583BE8]/10 text-[#583BE8] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-[#0F172A]">Primary Traveler (Lead Contact)</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black">
              Lead Contact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={data.leadTraveler.fullName}
                onChange={(e) => handleLeadChange('fullName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
              />
              {errors.fullName && <p className="text-[10px] font-bold text-rose-500 pt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={data.leadTraveler.phone}
                onChange={(e) => handleLeadChange('phone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
              />
              {errors.phone && <p className="text-[10px] font-bold text-rose-500 pt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={data.leadTraveler.email}
                onChange={(e) => handleLeadChange('email', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
              />
              {errors.email && <p className="text-[10px] font-bold text-rose-500 pt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Gender *</label>
              <select
                value={data.leadTraveler.gender}
                onChange={(e) => handleLeadChange('gender', e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Date of Birth *</label>
              <input
                type="date"
                value={data.leadTraveler.dob}
                onChange={(e) => handleLeadChange('dob', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Govt ID Type *</label>
              <select
                value={data.leadTraveler.idProofType}
                onChange={(e) => handleLeadChange('idProofType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Govt ID Number *</label>
            <input
              type="text"
              value={data.leadTraveler.idProofNumber}
              onChange={(e) => handleLeadChange('idProofNumber', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#583BE8] outline-none transition-all"
            />
          </div>
        </div>

        {/* Additional Companions */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-[#0F172A]">
                Additional Travelers ({data.additionalTravelers.length})
              </h3>
            </div>
            <span className="text-xs font-extrabold text-[#583BE8]">
              Total: {totalTravelerCount} Traveler(s)
            </span>
          </div>

          {data.additionalTravelers.map((comp, idx) => (
            <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#583BE8]">
                  Companion #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCompanion(comp.id)}
                  className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={comp.fullName}
                    onChange={(e) => handleCompanionChange(comp.id, 'fullName', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Gender *</label>
                  <select
                    value={comp.gender}
                    onChange={(e) => handleCompanionChange(comp.id, 'gender', e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={comp.dob}
                    onChange={(e) => handleCompanionChange(comp.id, 'dob', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Govt ID Type *</label>
                  <select
                    value={comp.idProofType}
                    onChange={(e) => handleCompanionChange(comp.id, 'idProofType', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCompanion}
            className="w-full py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] border border-purple-200/80 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Additional Traveler</span>
          </button>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-[#0F172A]">Emergency Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Contact Name *</label>
              <input
                type="text"
                value={data.emergencyContact.name}
                onChange={(e) => handleEmergencyChange('name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Relationship *</label>
              <input
                type="text"
                value={data.emergencyContact.relationship}
                onChange={(e) => handleEmergencyChange('relationship', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Phone Number *</label>
              <input
                type="tel"
                value={data.emergencyContact.phone}
                onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A]"
              />
            </div>
          </div>
        </div>

        {/* Medical & Travel Preferences */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-[#0F172A]">Medical & Travel Preferences</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Medical Conditions or Allergies</label>
              <input
                type="text"
                placeholder="E.g. Asthma, Peanut Allergy, Motion Sickness..."
                value={data.medicalNotes}
                onChange={(e) => setData((prev) => ({ ...prev, medicalNotes: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Special Requests & Preferences</label>
              <textarea
                rows={2}
                placeholder="E.g. Vegetarian meal request, twin bed configuration..."
                value={data.specialRequests}
                onChange={(e) => setData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-medium text-[#0F172A] outline-none focus:bg-white focus:border-[#583BE8] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-[#583BE8] hover:bg-[#482bd4] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>Save Traveler Details & Unlock Review</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </section>
  );
};

export default TravelerSection;
