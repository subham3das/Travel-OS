import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  MapPin,
  CheckCircle2,
  Award,
  UserPlus,
  UserCheck,
  Grid,
  Camera,
  Star,
  Compass,
} from 'lucide-react';
import { TravelerPost } from '../../components/community/TravelerPost';
import { getUserReputation } from '../../data/reputation';
import { useToast } from '../../context/ToastContext';

export const TravelerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { userId, id } = useParams<{ userId?: string; id?: string }>();
  const targetUserId = userId || id || 'user-002';

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'stories' | 'reviews' | 'visited'>('posts');
  const reputation = getUserReputation();

  const traveler = {
    id: targetUserId,
    name: targetUserId === 'user-001' ? 'Subham Das' : 'Ananya Sharma',
    handle: targetUserId === 'user-001' ? '@subham_das' : '@ananya_wild',
    isVerified: true,
    bio: 'Passionate solo traveler & high-altitude trekking guide. Exploring raw mountain landscapes across North & Northeast India!',
    location: targetUserId === 'user-001' ? 'Dibrugarh, Assam' : 'Spiti Valley, Himachal',
    tripsCount: 24,
    followersCount: isFollowing ? 1241 : 1240,
    followingCount: 380,
    avatar:
      targetUserId === 'user-001'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  };

  const sampleUserPosts = [
    {
      id: 'usr-post-1',
      authorName: traveler.name,
      authorAvatar: traveler.avatar,
      isVerified: traveler.isVerified,
      timeAgo: '3 days ago',
      location: traveler.location,
      imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
      caption: 'Trekking through high mountain passes in Spiti Valley! 🏔️✨',
      likesCount: 342,
      commentsCount: 45,
      sharesCount: 19,
      agencyName: 'Himalayan Trekkers',
      agencyVerified: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight truncate max-w-[200px]">
            {traveler.name}
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
                showToast('Profile link copied to clipboard!', 'success');
              }}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => showToast('Report submitted for admin review', 'info')}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
              title="Report User"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4"
        >
          <div className="flex items-start gap-4">
            <img
              src={traveler.avatar}
              alt={traveler.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#6356E5]/20 shrink-0"
            />

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black text-[#0F172A] truncate">
                  {traveler.name}
                </h2>
                {traveler.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500/10 shrink-0" />
                )}
              </div>

              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6356E5]" />
                <span>{traveler.location}</span>
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-black border border-amber-200">
                  ⭐ {reputation.reputation} Reputation
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-xs font-black border border-purple-200">
                  {reputation.levelTitle}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
            {traveler.bio}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsFollowing((f) => !f)}
              className={`flex-1 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  : 'bg-[#6356E5] text-white hover:bg-[#5245d6] shadow-[#6356E5]/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow Traveler</span>
                </>
              )}
            </button>
          </div>

          {/* Public Stats Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center divide-x divide-slate-100">
            <div>
              <p className="text-base font-black text-[#0F172A]">{traveler.tripsCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Trips</p>
            </div>
            <div>
              <p className="text-base font-black text-[#0F172A]">12</p>
              <p className="text-[10px] font-bold text-slate-400">Posts</p>
            </div>
            <div>
              <p className="text-base font-black text-[#0F172A]">{traveler.followersCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-base font-black text-[#0F172A]">{traveler.followingCount}</p>
              <p className="text-[10px] font-bold text-slate-400">Following</p>
            </div>
          </div>
        </motion.div>

        {/* Public Badges */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3">
          <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Traveler Badges</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {reputation.badges.filter((b) => b.unlocked).map((badge) => (
              <div key={badge.id} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="text-lg">{badge.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#0F172A] truncate">{badge.name}</p>
                  <p className="text-[9px] font-bold text-slate-400">Unlocked</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'posts', label: 'Posts', icon: <Grid className="w-3.5 h-3.5" /> },
            { id: 'stories', label: 'Stories', icon: <Camera className="w-3.5 h-3.5" /> },
            { id: 'reviews', label: 'Reviews', icon: <Star className="w-3.5 h-3.5" /> },
            { id: 'visited', label: 'Visited', icon: <Compass className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  active ? 'bg-[#6356E5] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Activity List */}
        <div className="space-y-4">
          {sampleUserPosts.map((post) => (
            <TravelerPost key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default TravelerProfilePage;
