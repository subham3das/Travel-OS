import React from 'react';
import { motion } from 'framer-motion';

import { AppHeader } from '../../components/home/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ProfileCard, UserProfileData } from '../../components/profile/ProfileCard';
import { TravelStatsBar } from '../../components/profile/TravelStatsBar';
import { AchievementGrid } from '../../components/profile/AchievementCard';
import { MapCard } from '../../components/profile/MapCard';
import { MediaTabsSection } from '../../components/profile/MediaTabs';
import { QuickAccessList, AccountSettingsList } from '../../components/profile/SettingsSection';
import { BottomNavigation } from '../../components/common/BottomNavigation';

const currentUserProfile: UserProfileData = {
  name: 'Subham Das',
  isVerified: true,
  badgeTitle: 'Verified Traveler',
  bio: 'Travel. Capture. Inspire.',
  location: 'Dibrugarh, Assam, India',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
};

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* 1. App Header */}
      <AppHeader
        unreadNotificationsCount={2}
        unreadMessagesCount={1}
        onNotificationClick={() => alert('Notifications coming soon!')}
        onMessageClick={() => alert('Messages coming soon!')}
      />

      {/* Main Page Scroll Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10 pb-28">
        {/* 2. Hero Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProfileCard
            profile={currentUserProfile}
            onEditProfile={() => alert('Edit profile clicked!')}
          />
        </motion.div>

        {/* 3. Travel Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <TravelStatsBar />
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
          <SectionHeader title="My Achievements" onViewAll={() => {}} />
          <AchievementGrid />
        </motion.section>

        {/* 6. Section: My Travel Map */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <SectionHeader title="My Travel Map" onViewAll={() => {}} />
          <MapCard />
        </motion.section>

        {/* 7. Section: User Media Tabs & Posts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <MediaTabsSection />
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
      </main>

      {/* 9. Floating Bottom Navigation Bar */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
