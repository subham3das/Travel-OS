import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  KeyRound,
  Share2,
  Sun,
  Moon,
  Laptop,
  Globe,
  Coins,
  Ruler,
  Clock,
  Bell,
  MessageSquare,
  Tag,
  Mail,
  Smartphone,
  Eye,
  Award,
  Compass,
  BookOpen,
  HelpCircle,
  Headphones,
  AlertTriangle,
  FileText,
  ShieldCheck,
  FileCheck,
  Receipt,
  Info,
  Sparkles,
  Star,
  LogOut,
  Trash2,
  ChevronRight,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme, ThemeMode } from '../../../context/ThemeContext';
import { BottomNavigation } from '../../components/common/BottomNavigation';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Bottom Sheet state
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Notification Toggles state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('apnatrip_settings_notifications');
    return saved
      ? JSON.parse(saved)
      : {
          bookingUpdates: true,
          communityActivity: true,
          promotions: false,
          emailNotifications: true,
          pushNotifications: true,
        };
  });

  // Privacy Toggles state
  const [privacy, setPrivacy] = useState(() => {
    const saved = localStorage.getItem('apnatrip_settings_privacy');
    return saved
      ? JSON.parse(saved)
      : {
          publicProfile: true,
          showReputation: true,
          showCompletedTrips: true,
          showStories: true,
        };
  });

  // Preferences State
  const [language, setLanguage] = useState(() => localStorage.getItem('apnatrip_pref_lang') || 'English (US)');
  const [currency, setCurrency] = useState(() => localStorage.getItem('apnatrip_pref_curr') || 'INR (₹)');
  const [distanceUnit, setDistanceUnit] = useState(() => localStorage.getItem('apnatrip_pref_dist') || 'Kilometers (km)');
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('apnatrip_pref_time') || '12 Hour');

  useEffect(() => {
    localStorage.setItem('apnatrip_settings_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('apnatrip_settings_privacy', JSON.stringify(privacy));
  }, [privacy]);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev: typeof notifications) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy((prev: typeof privacy) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    logout();
    alert('Your account deletion request has been submitted.');
    navigate('/login');
  };

  const getThemeLabel = (t: ThemeMode) => {
    if (t === 'light') return 'Light';
    if (t === 'dark') return 'Dark';
    return 'System Default';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Back to Profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight text-center">
            Settings
          </h1>

          <div className="w-10" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-36">
        {/* SECTION 1: Account */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
            Account
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div
              onClick={() => navigate('/edit-profile')}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Edit Profile</h3>
                  <p className="text-xs font-medium text-slate-400">Name, email, phone number</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            <div
              onClick={() => alert('Change Password drawer opened')}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Change Password</h3>
                  <p className="text-xs font-medium text-slate-400">Update security credentials</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            <div className="p-4 flex items-center justify-between gap-4 opacity-75">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Connected Accounts</h3>
                  <p className="text-xs font-medium text-slate-400">Google, Apple, Facebook</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                Coming Soon
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Preferences */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
            Preferences
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {/* Theme Item */}
            <div
              onClick={() => setIsThemeSheetOpen(true)}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Theme</h3>
                  <p className="text-xs font-medium text-slate-400">Customize the appearance of ApnaTrip</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6356E5] bg-purple-50 px-2.5 py-1 rounded-xl">
                  {getThemeLabel(theme)}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Language Item */}
            <div
              onClick={() => {
                const newLang = language === 'English (US)' ? 'Hindi (हिन्दी)' : 'English (US)';
                setLanguage(newLang);
                localStorage.setItem('apnatrip_pref_lang', newLang);
              }}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Language</h3>
                  <p className="text-xs font-medium text-slate-400">Select app language</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">{language}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Currency Item */}
            <div
              onClick={() => {
                const newCurr = currency === 'INR (₹)' ? 'USD ($)' : 'INR (₹)';
                setCurrency(newCurr);
                localStorage.setItem('apnatrip_pref_curr', newCurr);
              }}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Currency</h3>
                  <p className="text-xs font-medium text-slate-400">Default currency display</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">{currency}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Distance Unit Item */}
            <div
              onClick={() => {
                const newDist = distanceUnit === 'Kilometers (km)' ? 'Miles (mi)' : 'Kilometers (km)';
                setDistanceUnit(newDist);
                localStorage.setItem('apnatrip_pref_dist', newDist);
              }}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Distance Unit</h3>
                  <p className="text-xs font-medium text-slate-400">Units of measurement</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">{distanceUnit}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Time Format Item */}
            <div
              onClick={() => {
                const newTime = timeFormat === '12 Hour' ? '24 Hour' : '12 Hour';
                setTimeFormat(newTime);
                localStorage.setItem('apnatrip_pref_time', newTime);
              }}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Time Format</h3>
                  <p className="text-xs font-medium text-slate-400">Clock display mode</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">{timeFormat}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Notifications */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
            Notifications
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              { key: 'bookingUpdates', label: 'Booking Updates', subtitle: 'Flight, hotel & itinerary status', icon: <Bell className="w-5 h-5 text-purple-600" /> },
              { key: 'communityActivity', label: 'Community Activity', subtitle: 'Comments, likes & mentions', icon: <MessageSquare className="w-5 h-5 text-sky-600" /> },
              { key: 'promotions', label: 'Promotions & Offers', subtitle: 'Exclusive deals & discounts', icon: <Tag className="w-5 h-5 text-emerald-600" /> },
              { key: 'emailNotifications', label: 'Email Notifications', subtitle: 'Weekly summaries & receipts', icon: <Mail className="w-5 h-5 text-amber-600" /> },
              { key: 'pushNotifications', label: 'Push Notifications', subtitle: 'Instant alerts on mobile', icon: <Smartphone className="w-5 h-5 text-rose-600" /> },
            ].map((item) => (
              <div key={item.key} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.label}</h3>
                    <p className="text-xs font-medium text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-[#6356E5]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Privacy */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
            Privacy
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              { key: 'publicProfile', label: 'Public Traveler Profile', subtitle: 'Allow others to view your profile', icon: <Eye className="w-5 h-5 text-sky-600" /> },
              { key: 'showReputation', label: 'Show Reputation Badge', subtitle: 'Display verified status & points', icon: <Award className="w-5 h-5 text-purple-600" /> },
              { key: 'showCompletedTrips', label: 'Show Completed Trips', subtitle: 'Share past travel history', icon: <Compass className="w-5 h-5 text-emerald-600" /> },
              { key: 'showStories', label: 'Show Travel Stories', subtitle: 'Make published stories public', icon: <BookOpen className="w-5 h-5 text-amber-600" /> },
            ].map((item) => (
              <div key={item.key} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.label}</h3>
                    <p className="text-xs font-medium text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => togglePrivacy(item.key as keyof typeof privacy)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    privacy[item.key as keyof typeof privacy] ? 'bg-[#6356E5]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      privacy[item.key as keyof typeof privacy] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Support */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
            Support
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              { label: 'Help Center', subtitle: 'Guides, tutorials & support', icon: <HelpCircle className="w-5 h-5 text-indigo-600" /> },
              { label: 'Contact Support', subtitle: 'Speak with 24/7 team', icon: <Headphones className="w-5 h-5 text-emerald-600" /> },
              { label: 'Report a Problem', subtitle: 'Feedback & bug reporting', icon: <AlertTriangle className="w-5 h-5 text-rose-600" /> },
              { label: 'FAQs', subtitle: 'Frequently asked questions', icon: <FileText className="w-5 h-5 text-purple-600" /> },
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => alert(`Opened ${item.label}`)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.label}</h3>
                    <p className="text-xs font-medium text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Legal */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
            Legal
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {[
              { label: 'Privacy Policy', subtitle: 'Data handling & privacy terms', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> },
              { label: 'Terms & Conditions', subtitle: 'Service usage guidelines', icon: <FileCheck className="w-5 h-5 text-sky-600" /> },
              { label: 'Refund Policy', subtitle: 'Cancellations & refunds', icon: <Receipt className="w-5 h-5 text-purple-600" /> },
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => alert(`Opened ${item.label}`)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.label}</h3>
                    <p className="text-xs font-medium text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: About */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
            About
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">App Version</h3>
                  <p className="text-xs font-medium text-slate-400">ApnaTrip v1.0.4 (Latest)</p>
                </div>
              </div>
              <span className="text-xs font-black text-slate-600">v1.0.4</span>
            </div>

            <div
              onClick={() => alert('Release Notes: ApnaTrip v1.0.4 includes Chat Module, Notifications, and Theme Customization.')}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">What's New</h3>
                  <p className="text-xs font-medium text-slate-400">Latest release notes & features</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            <div
              onClick={() => alert('Thank you for rating ApnaTrip 5 stars!')}
              className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF4D6D] flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Rate App</h3>
                  <p className="text-xs font-medium text-slate-400">Love ApnaTrip? Leave a review</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </section>

        {/* SECTION 8: Danger Zone */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-black text-rose-500 uppercase tracking-wider px-3">
            Danger Zone
          </h2>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full p-4 rounded-3xl bg-rose-50 hover:bg-rose-100 text-[#FF4D6D] font-extrabold text-sm flex items-center justify-between transition-colors cursor-pointer border border-rose-100 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span>Log Out of ApnaTrip</span>
              </div>
              <ChevronRight className="w-5 h-5 text-rose-400" />
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full p-4 rounded-3xl bg-white hover:bg-rose-50/50 text-rose-600 font-extrabold text-sm flex items-center justify-between transition-colors cursor-pointer border border-slate-100 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5" />
                <span>Delete Account</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </section>
      </main>

      {/* Theme Bottom Sheet Modal */}
      <AnimatePresence>
        {isThemeSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsThemeSheetOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
            />

            {/* Bottom Sheet Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl max-w-xl mx-auto border-t border-slate-100 p-6 pb-32 sm:pb-36 space-y-6 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              {/* Sheet Handle & Header */}
              <div className="space-y-4">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#0F172A]">Choose Theme</h3>
                    <p className="text-xs font-semibold text-slate-400">Select how ApnaTrip should appear.</p>
                  </div>

                  <button
                    onClick={() => setIsThemeSheetOpen(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Theme Options */}
              <div className="space-y-3">
                {[
                  {
                    id: 'light' as ThemeMode,
                    title: '☀️ Light',
                    subtitle: 'Always use the light theme.',
                    icon: <Sun className="w-5 h-5 text-amber-500" />,
                  },
                  {
                    id: 'dark' as ThemeMode,
                    title: '🌙 Dark',
                    subtitle: 'Always use the dark theme.',
                    icon: <Moon className="w-5 h-5 text-purple-500" />,
                  },
                  {
                    id: 'system' as ThemeMode,
                    title: '📱 System Default',
                    subtitle: 'Automatically match your device theme.',
                    icon: <Laptop className="w-5 h-5 text-sky-500" />,
                  },
                ].map((opt) => {
                  const isSelected = theme === opt.id;
                  return (
                    <motion.div
                      key={opt.id}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setTheme(opt.id);
                        setTimeout(() => setIsThemeSheetOpen(false), 200);
                      }}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-50/60 border-[#6356E5] shadow-xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                          {opt.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-[#0F172A]">{opt.title}</h4>
                          <p className="text-xs font-medium text-slate-400">{opt.subtitle}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#6356E5] fill-[#6356E5]/10 shrink-0" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[90]"
            />
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#0F172A]">Delete Account?</h3>
                  <p className="text-xs font-medium text-slate-500">
                    This action is permanent and cannot be undone. All your bookings, stories, and saved trips will be permanently deleted.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
                  >
                    Delete Permanently
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Shared Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default SettingsPage;
