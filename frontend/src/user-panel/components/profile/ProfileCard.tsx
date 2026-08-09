import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Edit3 } from 'lucide-react';

export interface UserProfileData {
  name: string;
  isVerified: boolean;
  badgeTitle: string;
  bio: string;
  location: string;
  avatarUrl: string;
}

interface ProfileCardProps {
  profile: UserProfileData;
  onEditProfile?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEditProfile,
}) => {
  return (
    <div className="w-full bg-transparent flex flex-col sm:flex-row items-center justify-between gap-5">
      {/* Left: Avatar + Name Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        {/* Large Profile Picture with Green Online Status Dot */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 shrink-0">
          <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
        </div>

        {/* Profile Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              {profile.name}
            </h2>
            {profile.isVerified && (
              <CheckCircle2 className="w-6 h-6 text-sky-500 fill-sky-500/10 shrink-0" />
            )}
          </div>

          <div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-bold">
              {profile.badgeTitle}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-700">{profile.bio}</p>

          <p className="text-xs font-semibold text-slate-400 flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{profile.location}</span>
          </p>
        </div>
      </div>

      {/* Right: Edit Profile Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onEditProfile}
        className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#0F172A] text-xs sm:text-sm font-bold shadow-2xs transition-all focus:outline-none flex items-center gap-2 shrink-0"
      >
        <Edit3 className="w-4 h-4 text-slate-600" />
        <span>Edit Profile</span>
      </motion.button>
    </div>
  );
};
