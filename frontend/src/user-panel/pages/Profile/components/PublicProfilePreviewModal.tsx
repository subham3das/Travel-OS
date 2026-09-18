import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Award, MapPin, Grid, Camera } from 'lucide-react';
import { TravelerPost } from '../../../components/community/TravelerPost';
import { FullUserProfileResponse } from '../../../services/userAuth.service';

interface PublicProfilePreviewModalProps {
  onClose: () => void;
  profile: FullUserProfileResponse | null;
}

export const PublicProfilePreviewModal: React.FC<PublicProfilePreviewModalProps> = ({
  onClose,
  profile,
}) => {
  const name = profile?.fullName || 'ApnaTrip Traveler';
  const avatar = profile?.avatar || profile?.profileImage || '';
  const bio = profile?.bio || 'Passionate backpacker & nature explorer.';
  const location = profile?.location || profile?.homeCity || 'India';
  const isVerified = Boolean(profile?.isVerified || profile?.isEmailVerified);
  const reputation = profile?.stats?.reputationScore ?? (isVerified ? 150 : 50);
  const levelTitle = profile?.stats?.levelTitle || (isVerified ? 'Explorer Level 2' : 'Explorer Level 1');
  const completedTrips = profile?.stats?.completedTrips ?? 0;
  const postsCount = profile?.stats?.postsCount ?? 0;
  const followersCount = profile?.stats?.followersCount ?? 0;
  const followingCount = profile?.stats?.followingCount ?? 0;
  const badges = profile?.achievements || [];
  const posts = profile?.mediaPosts || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans overflow-y-auto"
    >
      {/* Top Banner Bar */}
      <div className="sticky top-0 z-50 bg-purple-900 text-white px-4 sm:px-8 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-white">Traveler Profile Preview</h2>
            <p className="text-[10px] sm:text-xs text-purple-200 font-semibold">
              This is how other travelers see your public profile.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-white text-purple-900 text-xs font-black hover:bg-purple-50 transition-colors cursor-pointer shadow-xs"
        >
          Exit Preview
        </button>
      </div>

      {/* Main Public Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
        {/* Public Header Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#6356E5]/20 shrink-0 flex items-center justify-center bg-slate-100">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#6356E5] to-[#FF4D6D] flex items-center justify-center text-white font-black text-2xl">
                  {name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black text-[#0F172A] truncate">{name}</h1>
                {isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500/10 shrink-0" />
                )}
              </div>

              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6356E5]" />
                <span>{location}</span>
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-black border border-amber-200">
                  ⭐ {reputation} Reputation
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-xs font-black border border-purple-200">
                  {levelTitle}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
            {bio}
          </p>

          {/* Public Stats Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center divide-x divide-slate-100">
            <div>
              <p className="text-base sm:text-lg font-black text-[#0F172A]">{completedTrips}</p>
              <p className="text-[10px] font-bold text-slate-400">Trips</p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-black text-[#0F172A]">{postsCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Posts</p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-black text-[#0F172A]">{followersCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-black text-[#0F172A]">{followingCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Following</p>
            </div>
          </div>
        </div>

        {/* Public Badges */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3">
          <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Badges & Achievements</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {badges.filter((b) => b.unlocked).map((badge) => (
              <div key={badge.id} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                  🏆
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#0F172A] truncate">{badge.title}</p>
                  <p className="text-[9px] font-bold text-slate-400">{badge.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Activity Stream */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Grid className="w-4 h-4 text-[#6356E5]" />
            <span>Recent Community Posts</span>
          </h3>

          {posts.length > 0 ? (
            posts.map((post: any) => (
              <TravelerPost key={post.id} post={post} />
            ))
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#0F172A]">No public posts shared yet</p>
              <p className="text-[11px] text-slate-400">Trips and stories shared by this traveler will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};
