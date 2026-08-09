import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit3,
  Building,
  Phone,
  ShieldCheck,
  Clock,
  Share2,
  Landmark,
  Folder,
  Users,
  Settings,
} from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { AgencyHeroCard } from '../../components/profile/AgencyHeroCard';
import { ProfileSectionCard } from '../../components/profile/ProfileSectionCard';
import { PerformanceGrid } from '../../components/profile/PerformanceGrid';
import { PublicProfilePreview } from '../../components/profile/PublicProfilePreview';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { MOCK_AGENCY_PROFILE, CompleteAgencyProfile } from '../../data/profile';

/**
 * Agency Profile Main Page
 * Route: /agency/profile
 */
export const AgencyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CompleteAgencyProfile>(MOCK_AGENCY_PROFILE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveHeroUpdate = (updated: Partial<CompleteAgencyProfile['hero']>) => {
    setProfile((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...updated },
    }));
    alert('Agency Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-24 md:pb-16">
        <DashboardHeader />

        {/* Header Bar */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[3.5rem] z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/agency/dashboard')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Agency Profile</h2>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#583BE8] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Main Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-3xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* 1. Hero Card */}
            <AgencyHeroCard
              hero={profile.hero}
              onEditCover={() => setIsEditModalOpen(true)}
              onEditLogo={() => setIsEditModalOpen(true)}
            />

            {/* 2. Profile Sections Card List */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                Profile Sections
              </h3>

              <div className="space-y-2.5">
                <ProfileSectionCard
                  icon={<Building className="w-5 h-5" />}
                  title="Business Information"
                  subtitle="License, GST, PAN, Registration & more"
                  route="/agency/profile/business"
                />

                <ProfileSectionCard
                  icon={<Phone className="w-5 h-5" />}
                  title="Contact Information"
                  subtitle="Phone, Email, Address & Location"
                  route="/agency/profile/contact"
                />

                <ProfileSectionCard
                  icon={<ShieldCheck className="w-5 h-5" />}
                  title="Verification"
                  subtitle="Documents & verification status"
                  route="/agency/profile/verification"
                  badge="Verified"
                  badgeType="success"
                />

                <ProfileSectionCard
                  icon={<Clock className="w-5 h-5" />}
                  title="Business Hours"
                  subtitle="Working days & hours"
                  route="/agency/profile/business-hours"
                />

                <ProfileSectionCard
                  icon={<Share2 className="w-5 h-5" />}
                  title="Social Media"
                  subtitle="Instagram, Facebook, YouTube & more"
                  route="/agency/profile/social-media"
                />

                <ProfileSectionCard
                  icon={<Landmark className="w-5 h-5" />}
                  title="Bank Details"
                  subtitle="Payout account & settlement"
                  route="/agency/profile/bank"
                />

                <ProfileSectionCard
                  icon={<Folder className="w-5 h-5" />}
                  title="Documents"
                  subtitle="Uploaded documents & certificates"
                  route="/agency/profile/documents"
                />

                <ProfileSectionCard
                  icon={<Users className="w-5 h-5" />}
                  title="Team Overview"
                  subtitle="Manage your team & roles"
                  route="/agency/team"
                  badge={`${profile.teamMemberCount} Members`}
                  badgeType="purple"
                />

                <ProfileSectionCard
                  icon={<Settings className="w-5 h-5" />}
                  title="Settings"
                  subtitle="Business preferences, security & system configuration"
                  route="/agency/profile/settings"
                />
              </div>
            </div>

            {/* 3. Performance Snapshot */}
            <PerformanceGrid metrics={profile.performanceSnapshot} />

            {/* 4. Public Profile Preview */}
            <PublicProfilePreview hero={profile.hero} />
          </motion.div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        hero={profile.hero}
        onSave={handleSaveHeroUpdate}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AgencyProfilePage;
