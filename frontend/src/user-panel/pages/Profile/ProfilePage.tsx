import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

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

const currentUserProfile: UserProfileData = {
  name: 'Subham Das',
  isVerified: true,
  badgeTitle: 'Verified Traveler',
  bio: 'Travel. Capture. Inspire.',
  location: 'Dibrugarh, Assam, India',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D6D]/20 selection:text-[#FF4D6D]">
      {/* Full-screen Public Profile Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <PublicProfilePreviewModal onClose={() => setIsPreviewOpen(false)} />
        )}
      </AnimatePresence>

      {/* 1. App Header */}
      <AppHeader
        unreadNotificationsCount={2}
        unreadMessagesCount={1}
        onNotificationClick={() => navigate('/notifications')}
        onMessageClick={() => navigate('/chat')}
      />

      {/* Main Page Scroll Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10 pb-28">
        {/* 2. Hero Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <ProfileCard
            profile={currentUserProfile}
            onEditProfile={() => alert('Edit profile clicked!')}
          />

          {/* Preview Traveler Profile Button (White Primary Style) */}
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
          <TravelStatsBar />
        </motion.div>

        {/* Current Trip Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Current Trip</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">Confirmed</span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop"
              alt="Magical Meghalaya"
              className="w-14 h-14 rounded-2xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate">Magical Meghalaya</h4>
              <p className="text-[11px] font-semibold text-slate-500">20 May – 26 May, 2025 • Wander North Travel</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => navigate('/trips/trip-001')}
              className="flex-1 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-extrabold transition-all cursor-pointer text-center"
            >
              View Trip
            </button>
            <button
              onClick={() => navigate('/trips/trip-001/documents')}
              className="flex-1 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold transition-all cursor-pointer border border-purple-100 text-center"
            >
              Travel Documents
            </button>
          </div>
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
