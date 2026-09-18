import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, Compass, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ProfileCard, UserProfileData } from '../../components/profile/ProfileCard';
import { PublicProfilePreviewModal } from './components/PublicProfilePreviewModal';
import { TravelStatsBar } from '../../components/profile/TravelStatsBar';
import { AchievementGrid } from '../../components/profile/AchievementCard';
import { MapCard } from '../../components/profile/MapCard';
import { MediaTabsSection } from '../../components/profile/MediaTabs';
import { QuickAccessList, AccountSettingsList } from '../../components/profile/SettingsSection';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { useAuth } from '../../hooks/useAuth';
import { userAuthService, FullUserProfileResponse } from '../../services/userAuth.service';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<FullUserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAuthService.getProfile();
      if (data) {
        setProfile(data);
      }
    } catch (err: any) {
      console.warn('Failed to load profile from backend:', err);
      setError(err?.message || 'Could not load profile from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Derived user profile data with live fallbacks
  const displayProfile: UserProfileData = {
    name: profile?.fullName || user?.name || 'Traveler',
    isVerified: Boolean(profile?.isVerified || profile?.isEmailVerified),
    badgeTitle: profile?.badgeTitle || (profile?.isEmailVerified ? 'Verified Traveler' : 'New Explorer'),
    bio: profile?.bio || user?.bio || 'Passionate traveler exploring the world.',
    location: profile?.location || (user?.homeCity ? `${user.homeCity}, India` : 'India'),
    avatarUrl: profile?.avatar || user?.avatar || '',
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Full-screen Public Profile Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <PublicProfilePreviewModal
            profile={profile}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 1. App Header */}
      <AppHeader
        unreadNotificationsCount={0}
        unreadMessagesCount={0}
        onNotificationClick={() => navigate('/notifications')}
        onMessageClick={() => navigate('/chat')}
      />

      {/* Main Page Scroll Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10 pb-28">
        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-48 bg-slate-200 rounded-md" />
                <div className="h-4 w-28 bg-slate-200 rounded-md" />
                <div className="h-4 w-64 bg-slate-200 rounded-md" />
              </div>
            </div>
            <div className="h-24 bg-white rounded-3xl border border-slate-100" />
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchProfile}
              className="px-3 py-1 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-1 hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 2. Hero Profile Section */}
        {!loading && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <ProfileCard
                profile={displayProfile}
                onEditProfile={() => navigate('/edit-profile')}
              />

              {/* Preview Traveler Profile Button */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#0F172A] text-xs sm:text-sm font-black shadow-md shadow-purple-500/5 hover:shadow-lg hover:shadow-purple-500/10 border border-purple-100 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0 border border-purple-100/60">
                  <Eye className="w-4 h-4" />
                </div>
                <span>Preview Traveler Profile (Public View)</span>
              </button>
            </motion.div>

            {/* 3. Travel Statistics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <TravelStatsBar stats={profile?.stats} />
            </motion.div>

            {/* Current Trip Section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#0F172A]">Current Trip</h3>
                {profile?.currentTrip ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                    {profile.currentTrip.status || 'Confirmed'}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                    No Active Trip
                  </span>
                )}
              </div>

              {profile?.currentTrip ? (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.currentTrip.imageUrl}
                      alt={profile.currentTrip.title}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate">
                        {profile.currentTrip.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {profile.currentTrip.dates} • {profile.currentTrip.agencyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/trips/${profile.currentTrip!.id}`)}
                      className="flex-1 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-extrabold transition-all cursor-pointer text-center"
                    >
                      View Trip
                    </button>
                    <button
                      onClick={() => navigate(`/trips/${profile.currentTrip!.id}/documents`)}
                      className="flex-1 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-all cursor-pointer border border-purple-100 text-center"
                    >
                      Travel Documents
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-[#6356E5] flex items-center justify-center shrink-0 border border-indigo-100">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                        No active journeys right now
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-400">
                        Ready for your next adventure? Explore curated packages & destinations.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/explore')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-extrabold transition-all cursor-pointer text-center shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explore Trips</span>
                  </button>
                </div>
              )}
            </motion.div>

            {/* 4. Quick Access Navigation List */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <QuickAccessList />
            </motion.div>

            {/* 5. Section: My Achievements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <SectionHeader title="My Achievements" onViewAll={() => navigate('/passport')} />
              <AchievementGrid badges={profile?.achievements} />
            </motion.section>

            {/* 6. Section: My Travel Map */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <SectionHeader title="My Travel Map" onViewAll={() => navigate('/passport')} />
              <MapCard
                statesVisited={profile?.stats?.countriesVisited || 1}
                countriesVisited={profile?.stats?.countriesVisited || 1}
                locationLabel={displayProfile.location}
              />
            </motion.section>

            {/* 7. Section: User Media Tabs & Posts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <MediaTabsSection posts={profile?.mediaPosts} />
            </motion.section>

            {/* 8. Account Settings & Logout */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <AccountSettingsList />
            </motion.section>
          </>
        )}
      </main>

      {/* 9. Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;

