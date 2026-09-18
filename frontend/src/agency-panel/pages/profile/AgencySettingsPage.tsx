import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Settings, Save, Edit3, X, CheckCircle2 } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { GeneralSettingsCard } from '../../components/profile/settings/GeneralSettingsCard';
import { BookingSettingsCard } from '../../components/profile/settings/BookingSettingsCard';
import { PaymentSettingsCard } from '../../components/profile/settings/PaymentSettingsCard';
import { NotificationSettingsCard } from '../../components/profile/settings/NotificationSettingsCard';
import { TripDefaultsCard } from '../../components/profile/settings/TripDefaultsCard';
import { SecurityCard } from '../../components/profile/settings/SecurityCard';
import { DataManagementCard } from '../../components/profile/settings/DataManagementCard';
import { IntegrationCard } from '../../components/profile/settings/IntegrationCard';
import { AboutCard } from '../../components/profile/settings/AboutCard';
import { useAgencyProfile } from '../../hooks/useAgencyProfile';
import { AgencySettingsData } from '../../data/profile';

/**
 * Agency Settings Page (Integrated inside Agency Profile flow)
 * Route: /agency/profile/settings
 */
export const AgencySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isLoading, updateSettings } = useAgencyProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [draftSettings, setDraftSettings] = useState<AgencySettingsData>(profile.settings);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile.settings) {
      setDraftSettings(profile.settings);
    }
  }, [profile.settings]);

  const handleStartEdit = () => {
    setDraftSettings(profile.settings);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftSettings(profile.settings);
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateSettings(draftSettings);
      setIsEditing(false);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update agency settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-24 md:pb-16">
        <DashboardHeader />

        {/* Header Bar */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/agency/profile')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to Agency Profile"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Settings</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-3.5 py-2 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="px-4 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#583BE8] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Settings</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {showSaveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500 text-white px-4 py-3 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Agency settings saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">
          {isLoading && !profile.settings?.general?.agencyName ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="w-8 h-8 border-3 border-[#583BE8] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-400">Loading settings...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* 1. General Settings */}
              <GeneralSettingsCard
                data={isEditing ? draftSettings.general : profile.settings.general}
                isEditing={isEditing}
                onChange={(updated) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    general: { ...prev.general, ...updated },
                  }))
                }
              />

              {/* 2. Booking Settings */}
              <BookingSettingsCard
                data={isEditing ? draftSettings.booking : profile.settings.booking}
                isEditing={isEditing}
                onChange={(updated) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    booking: { ...prev.booking, ...updated },
                  }))
                }
              />

              {/* 3. Payment & Tax Settings */}
              <PaymentSettingsCard
                data={isEditing ? draftSettings.payment : profile.settings.payment}
                isEditing={isEditing}
                onChange={(updated) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    payment: { ...prev.payment, ...updated },
                  }))
                }
              />

              {/* 4. Notification Settings */}
              <NotificationSettingsCard
                data={isEditing ? draftSettings.notification : profile.settings.notification}
                isEditing={isEditing}
                onChange={(updated) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    notification: { ...prev.notification, ...updated },
                  }))
                }
              />

              {/* 5. Trip Defaults */}
              <TripDefaultsCard
                data={isEditing ? draftSettings.tripDefaults : profile.settings.tripDefaults}
                isEditing={isEditing}
                onChange={(updated) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    tripDefaults: { ...prev.tripDefaults, ...updated },
                  }))
                }
              />

              {/* 6. Security Settings */}
              <SecurityCard data={profile.settings.security} />

              {/* 7. Data Management */}
              <DataManagementCard />

              {/* 8. Integrations */}
              <IntegrationCard integrations={profile.settings.integrations} />

              {/* 9. About Travel OS */}
              <AboutCard about={profile.settings.about} />
            </motion.div>
          )}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencySettingsPage;
