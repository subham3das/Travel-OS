import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye,
  Compass,
  AlertCircle,
  RefreshCw,
  Sparkles,
  User,
  Luggage,
  Users,
  ShieldAlert,
  Lock,
} from 'lucide-react';

import { AppHeader } from '../../components/home/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ProfileCard, UserProfileData } from '../../components/profile/ProfileCard';
import { PublicProfilePreviewModal } from './components/PublicProfilePreviewModal';
import { TravelStatsBar } from '../../components/profile/TravelStatsBar';
import { AchievementGrid } from '../../components/profile/AchievementCard';
import { MapCard } from '../../components/profile/MapCard';
import { QuickAccessList, AccountSettingsList } from '../../components/profile/SettingsSection';
import { CurrentTripCard } from '../../components/dashboard/CurrentTripCard';
import { BottomNavigation } from '../../components/common/BottomNavigation';
import { TravelProfileDashboardCard } from '../../components/dashboard/TravelProfileDashboardCard';

import { TravelProfileSection } from './components/TravelProfileSection';
import { SavedTravelersSection } from './components/SavedTravelersSection';
import { EmergencyContactsSection } from './components/EmergencyContactsSection';
import { PrivacySettingsSection } from './components/PrivacySettingsSection';

import { useAuth } from '../../hooks/useAuth';
import { userAuthService, FullUserProfileResponse } from '../../services/userAuth.service';

export type ProfileTabType =
  | 'personal'
  | 'travel-profile'
  | 'saved-travelers'
  | 'emergency'
  | 'privacy';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const currentTabParam = searchParams.get('tab');
  const initialTab: ProfileTabType =
    currentTabParam === 'travel-profile' ||
    currentTabParam === 'saved-travelers' ||
    currentTabParam === 'emergency' ||
    currentTabParam === 'privacy'
      ? currentTabParam
      : 'personal';

  const [activeTab, setActiveTab] = useState<ProfileTabType>(initialTab);
  const [profile, setProfile] = useState<FullUserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sync tab with URL search parameter
  useEffect(() => {
    if (currentTabParam) {
      if (
        currentTabParam === 'travel-profile' ||
        currentTabParam === 'saved-travelers' ||
        currentTabParam === 'emergency' ||
        currentTabParam === 'privacy'
      ) {
        setActiveTab(currentTabParam);
      } else {
        setActiveTab('personal');
      }
    }
  }, [currentTabParam]);

  const handleTabChange = (tab: ProfileTabType) => {
    setActiveTab(tab);
    setSearchParams(tab === 'personal' ? {} : { tab });
  };

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
    badgeTitle:
      profile?.badgeTitle || (profile?.isEmailVerified ? 'Verified Traveler' : 'New Explorer'),
    bio: profile?.bio || user?.bio || 'Passionate traveler exploring the world.',
    location: profile?.location || (user?.homeCity ? `${user.homeCity}, India` : 'India'),
    avatarUrl: profile?.avatar || user?.avatar || '',
  };

  const profileTabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'travel-profile', label: 'Travel Profile', icon: Luggage },
    { id: 'saved-travelers', label: 'Saved Travelers', icon: Users },
    { id: 'emergency', label: 'Emergency Contacts', icon: ShieldAlert },
    { id: 'privacy', label: 'Privacy', icon: Lock },
  ];

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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {profileTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as ProfileTabType)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/25 scale-[1.02]'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

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

        {/* TAB 1: Personal Information */}
        {!loading && activeTab === 'personal' && (
          <div className="space-y-6">
            {/* Travel Profile Quick Stats Overview Card */}
            <TravelProfileDashboardCard
              onManageClick={() => handleTabChange('travel-profile')}
            />

            {/* Profile Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
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

            {/* Travel Statistics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <TravelStatsBar stats={profile?.stats} />
            </motion.div>

            {/* Current Trip Widget */}
            <CurrentTripCard />

            {/* Quick Access Navigation List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <QuickAccessList />
            </motion.div>

            {/* Section: My Achievements */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <SectionHeader title="My Achievements" onViewAll={() => navigate('/passport')} />
              <AchievementGrid badges={profile?.achievements} />
            </motion.section>

            {/* Section: My Travel Map */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <SectionHeader title="My Travel Map" onViewAll={() => navigate('/passport')} />
              <MapCard
                statesVisited={profile?.stats?.countriesVisited || 1}
                countriesVisited={profile?.stats?.countriesVisited || 1}
                locationLabel={displayProfile.location}
              />
            </motion.section>

            {/* Account Settings & Logout */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <AccountSettingsList />
            </motion.section>
          </div>
        )}

        {/* TAB 2: Travel Profile */}
        {!loading && activeTab === 'travel-profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TravelProfileSection />
          </motion.div>
        )}

        {/* TAB 3: Saved Travelers */}
        {!loading && activeTab === 'saved-travelers' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SavedTravelersSection />
          </motion.div>
        )}

        {/* TAB 4: Emergency Contacts */}
        {!loading && activeTab === 'emergency' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmergencyContactsSection />
          </motion.div>
        )}

        {/* TAB 5: Privacy */}
        {!loading && activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PrivacySettingsSection />
          </motion.div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
