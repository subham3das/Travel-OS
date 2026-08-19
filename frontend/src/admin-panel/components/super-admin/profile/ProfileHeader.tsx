import React from 'react';
import {
  Camera,
  ShieldCheck,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit2,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { AdminPersonalInfo } from '../../../types/profileManagement';

interface ProfileHeaderProps {
  personalInfo: AdminPersonalInfo;
  avatarUrl: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onOpenAvatarModal: () => void;
  onOpenPasswordModal: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  personalInfo,
  avatarUrl,
  isEditing,
  onToggleEdit,
  onOpenAvatarModal,
  onOpenPasswordModal,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar Container with Upload Overlay */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-purple-100/80 shadow-md shadow-[#6356E5]/15">
              <img
                src={avatarUrl}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Photo Upload Trigger Button */}
            <button
              onClick={onOpenAvatarModal}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-2xl bg-[#6356E5] text-white flex items-center justify-center shadow-md shadow-[#6356E5]/30 hover:bg-[#5244e0] transition-colors cursor-pointer border-2 border-white"
              title="Upload Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Details */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {personalInfo.firstName} {personalInfo.lastName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Admin</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-[#6356E5] text-[10px] font-black border border-purple-100">
                <ShieldCheck className="w-3 h-3" />
                <span>{personalInfo.role}</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono font-semibold">
              Admin ID: <span className="text-slate-700 font-bold">{personalInfo.adminId}</span> • 
              <span className="text-emerald-600 font-bold ml-1.5 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Now
              </span>
            </p>

            {/* Contact & Meta Badges */}
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-500 font-medium flex-wrap">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Member since {personalInfo.memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Buttons: Edit Profile, Change Password */}
        <div className="flex items-center justify-center sm:justify-end gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={onToggleEdit}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-[#6356E5] hover:bg-[#5244e0] text-white shadow-[#6356E5]/25'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={onOpenPasswordModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};
