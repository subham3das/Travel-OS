import React from 'react';
import { User, Check, X } from 'lucide-react';
import { AdminPersonalInfo } from '../../../types/profileManagement';

interface PersonalInfoFormProps {
  personalInfo: AdminPersonalInfo;
  isEditing: boolean;
  onChange: (updated: Partial<AdminPersonalInfo>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  isEditing,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#0F172A]">Personal Information</h3>
        </div>

        {isEditing && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Cancel</span>
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        {/* First Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400">First Name</label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              isEditing
                ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-[#6356E5] shadow-2xs'
                : 'bg-slate-50 border-slate-100 text-slate-800 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400">Last Name</label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              isEditing
                ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-[#6356E5] shadow-2xs'
                : 'bg-slate-50 border-slate-100 text-slate-800 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400">Email Address</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => onChange({ email: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              isEditing
                ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-[#6356E5] shadow-2xs'
                : 'bg-slate-50 border-slate-100 text-slate-800 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400">Phone Number</label>
          <input
            type="text"
            value={personalInfo.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              isEditing
                ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-[#6356E5] shadow-2xs'
                : 'bg-slate-50 border-slate-100 text-slate-800 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400">Country</label>
          <input
            type="text"
            value={personalInfo.country}
            onChange={(e) => onChange({ country: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              isEditing
                ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-[#6356E5] shadow-2xs'
                : 'bg-slate-50 border-slate-100 text-slate-800 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Timezone */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400">Timezone</label>
          <input
            type="text"
            value={personalInfo.timezone}
            onChange={(e) => onChange({ timezone: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              isEditing
                ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-[#6356E5] shadow-2xs'
                : 'bg-slate-50 border-slate-100 text-slate-800 cursor-not-allowed'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
