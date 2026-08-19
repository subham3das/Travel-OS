import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  SuperAdminProfileData,
  AdminPersonalInfo,
  AdminPreferences,
  AdminDeviceItem,
} from '../../types/profileManagement';
import { adminProfileManagementService } from '../../services/adminProfileManagement.service';
import { initialSuperAdminProfile } from '../../data/profileData';
import { useAdminAuth } from '../../hooks/useAdminAuth';

import { ProfileHeader } from '../../components/super-admin/profile/ProfileHeader';
import { PersonalInfoForm } from '../../components/super-admin/profile/PersonalInfoForm';
import { SecurityCard } from '../../components/super-admin/profile/SecurityCard';
import { PreferencesCard } from '../../components/super-admin/profile/PreferencesCard';
import { RecentActivityTimeline } from '../../components/super-admin/profile/RecentActivityTimeline';
import { ProfileQuickStats } from '../../components/super-admin/profile/ProfileQuickStats';
import { DevicesListCard } from '../../components/super-admin/profile/DevicesListCard';
import { AccountStatusCard } from '../../components/super-admin/profile/AccountStatusCard';
import { ProfileQuickActions } from '../../components/super-admin/profile/ProfileQuickActions';

import { ChangePasswordModal } from '../../components/super-admin/profile/ChangePasswordModal';
import { UploadAvatarModal } from '../../components/super-admin/profile/UploadAvatarModal';
import { TerminateSessionModal } from '../../components/super-admin/profile/TerminateSessionModal';

export const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { admin, updateAdmin } = useAdminAuth();

  // ── 1. STATE MANAGEMENT ──
  const [profile, setProfile] = useState<SuperAdminProfileData>(initialSuperAdminProfile);
  const [tempPersonalInfo, setTempPersonalInfo] = useState<AdminPersonalInfo>(initialSuperAdminProfile.personalInfo);
  const [isEditing, setIsEditing] = useState(false);

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [deviceToTerminate, setDeviceToTerminate] = useState<AdminDeviceItem | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadProfile = useCallback(async () => {
    try {
      const data = await adminProfileManagementService.getProfile();
      setProfile(data);
      setTempPersonalInfo(data.personalInfo);
    } catch (err) {
      console.error(err);
      showToast('Failed to load profile data', 'error');
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── 3. OPERATIONAL ACTIONS ──
  const handleToggleEdit = async () => {
    if (isEditing) {
      // Save changes
      await handleSavePersonalInfo();
    } else {
      setIsEditing(true);
      showToast('Edit mode enabled. Update your personal details below.', 'info');
    }
  };

  const handleSavePersonalInfo = async () => {
    const updatedProfile = await adminProfileManagementService.updatePersonalInfo(tempPersonalInfo);
    setProfile(updatedProfile);
    setIsEditing(false);

    // Propagate to global AdminAuthContext
    updateAdmin({
      name: `${tempPersonalInfo.firstName} ${tempPersonalInfo.lastName}`,
      email: tempPersonalInfo.email,
    });

    showToast('Profile information saved and synchronized successfully', 'success');
  };

  const handleCancelPersonalInfo = () => {
    setTempPersonalInfo(profile.personalInfo);
    setIsEditing(false);
    showToast('Changes discarded', 'info');
  };

  const handleUpdatePreferences = async (updated: Partial<AdminPreferences>) => {
    const newPrefs = await adminProfileManagementService.updatePreferences(updated);
    setProfile((prev) => ({ ...prev, preferences: newPrefs }));
    showToast('Account preferences updated', 'info');
  };

  const handleSaveAvatar = async (url: string) => {
    await adminProfileManagementService.updateAvatar(url);
    setProfile((prev) => ({ ...prev, avatarUrl: url }));

    // Propagate to global AdminAuthContext
    updateAdmin({ avatar: url });

    showToast('Profile photo updated across all client interfaces', 'success');
  };

  const handleConfirmTerminateSession = async () => {
    if (!deviceToTerminate) return;
    const remaining = await adminProfileManagementService.terminateDevice(deviceToTerminate.id);
    setProfile((prev) => ({
      ...prev,
      devices: remaining,
      security: {
        ...prev.security,
        activeSessionsCount: Math.max(1, prev.security.activeSessionsCount - 1),
      },
    }));
    showToast(`Session terminated for ${deviceToTerminate.name}`, 'success');
    setDeviceToTerminate(null);
  };

  const handleDownloadProfile = () => {
    showToast('Generating official administrator credentials dossier (PDF)...', 'info');
  };

  const handleExportActivity = () => {
    showToast('Exported recent admin activity log to CSV', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATIONS ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 shadow-xl"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. PAGE HEADER ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/admin')}
            className="w-9 h-9 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              My Profile
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Manage your administrator profile and account preferences.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. PROFILE HERO BANNER & HEADER ── */}
      <ProfileHeader
        personalInfo={profile.personalInfo}
        avatarUrl={profile.avatarUrl}
        isEditing={isEditing}
        onToggleEdit={handleToggleEdit}
        onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
      />

      {/* ── 3. MAIN 2-COLUMN PROFILE WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (≈65% / lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Personal Info Form */}
          <PersonalInfoForm
            personalInfo={tempPersonalInfo}
            isEditing={isEditing}
            onChange={(updated) => setTempPersonalInfo((prev) => ({ ...prev, ...updated }))}
            onSave={handleSavePersonalInfo}
            onCancel={handleCancelPersonalInfo}
          />

          {/* Security & Authentication */}
          <SecurityCard
            security={profile.security}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            onConfigure2FA={() => showToast('Opening Two-Factor Authentication configuration wizard', 'info')}
            onViewSessions={() => showToast('Displaying full active session directory', 'info')}
          />

          {/* Account Preferences */}
          <PreferencesCard
            preferences={profile.preferences}
            onUpdate={handleUpdatePreferences}
          />

          {/* Recent Activity Timeline */}
          <RecentActivityTimeline
            activities={profile.activities}
            onViewAllLogs={() => navigate('/admin/audit-logs')}
          />
        </div>

        {/* Right Column (≈35% / lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5 sticky top-20">
          {/* Quick Statistics */}
          <ProfileQuickStats stats={profile.stats} />

          {/* Devices List */}
          <DevicesListCard
            devices={profile.devices}
            onTerminate={(dev) => setDeviceToTerminate(dev)}
          />

          {/* Account Status Card */}
          <AccountStatusCard status={profile.accountStatus} />

          {/* Quick Actions */}
          <ProfileQuickActions
            onDownloadProfile={handleDownloadProfile}
            onExportActivity={handleExportActivity}
            onViewAuditLogs={() => navigate('/admin/audit-logs')}
            onManageSessions={() => showToast('Displaying all active device sessions', 'info')}
          />
        </div>
      </div>

      {/* ── 4. MODALS ── */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => showToast('Password changed successfully. Your account is secured.', 'success')}
      />

      <UploadAvatarModal
        isOpen={isAvatarModalOpen}
        currentAvatar={profile.avatarUrl}
        onClose={() => setIsAvatarModalOpen(false)}
        onSaveAvatar={handleSaveAvatar}
      />

      <TerminateSessionModal
        isOpen={!!deviceToTerminate}
        device={deviceToTerminate}
        onClose={() => setDeviceToTerminate(null)}
        onConfirm={handleConfirmTerminateSession}
      />
    </motion.div>
  );
};

export default AdminProfilePage;
