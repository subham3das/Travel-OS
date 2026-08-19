import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Calendar,
  Filter,
  ChevronDown,
  User,
  Shield,
  LogOut,
  Settings,
  Menu,
  Sun,
  Moon,
  Laptop,
  Globe,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { LogoutConfirmModal } from '../super-admin/profile/LogoutConfirmModal';
import { AdminNotificationDropdown } from '../super-admin/notifications/AdminNotificationDropdown';
import { adminHeaderNotificationsService } from '../../services/adminHeaderNotifications.service';

interface AdminHeaderProps {
  onSearchChange?: (q: string) => void;
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onSearchChange, onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logoutAdmin } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('May 21 – Jun 21, 2025');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Header Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Submenu states
  const [activeTheme, setActiveTheme] = useState<'Light' | 'Dark' | 'System'>('Light');
  const [activeLanguage, setActiveLanguage] = useState<'English' | 'Hindi'>('English');
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const [isLanguageSubmenuOpen, setIsLanguageSubmenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const defaultAvatar =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
  const currentAvatar = admin?.avatar || defaultAvatar;
  const currentName = admin?.name || 'Super Admin';
  const currentRole = 'Platform Owner';
  const currentEmail = admin?.email || 'admin@travelos.com';

  // Real-time unread notifications subscription
  useEffect(() => {
    const unsubscribe = adminHeaderNotificationsService.subscribe((items) => {
      setUnreadNotifCount(items.filter((i) => !i.isRead).length);
    });
    return () => unsubscribe();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsThemeSubmenuOpen(false);
        setIsLanguageSubmenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setIsDateDropdownOpen(false);
        setIsThemeSubmenuOpen(false);
        setIsLanguageSubmenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close when navigating
  useEffect(() => {
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
    setIsDateDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleConfirmLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/90 px-4 sm:px-6 py-3.5 shadow-2xs select-none">
        {/* Toast inside header for instant feedback */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="fixed top-16 right-6 z-[1100] shadow-xl"
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

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1600px] mx-auto">
          {/* Left: Mobile Menu Toggle + Global Search Input */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search agencies, users, bookings, packages..."
                className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-extrabold text-slate-400 bg-white border border-slate-200 rounded-lg shadow-2xs pointer-events-none">
                Ctrl + K
              </kbd>
            </div>
          </div>

          {/* Right Controls: Platform Status, Date Range, Filter, Notifications, Profile */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-end">
            {/* Platform Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Platform Online</span>
            </div>

            {/* Date Range Selector */}
            <div className="relative shrink-0" ref={dateRef}>
              <button
                type="button"
                onClick={() => setIsDateDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{selectedDateRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {isDateDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs font-bold text-slate-700 space-y-1"
                  >
                    {['Today', 'Yesterday', 'Last 7 Days', 'May 21 – Jun 21, 2025', 'This Month', 'Custom Range'].map(
                      (range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => {
                            setSelectedDateRange(range);
                            setIsDateDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer ${
                            selectedDateRange === range ? 'bg-[#EEF2FF] text-[#6356E5] font-black' : ''
                          }`}
                        >
                          {range}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Filter Button */}
            <button
              type="button"
              onClick={() => {}}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0"
            >
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Custom Filter</span>
            </button>

            {/* ── NOTIFICATION BELL DROPDOWN INBOX ── */}
            <div className="relative shrink-0" ref={notifRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsNotificationsOpen((prev) => !prev);
                  setIsProfileOpen(false);
                }}
                className={`relative w-10 h-10 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shadow-2xs shrink-0 ${
                  isNotificationsOpen
                    ? 'bg-[#EEF2FF] border-[#6356E5] text-[#6356E5]'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title="Notifications Inbox"
                aria-expanded={isNotificationsOpen}
                aria-haspopup="true"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6356E5] text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              <AdminNotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                onShowToast={showToast}
              />
            </div>

            {/* ── Super Admin Profile Dropdown Area ── */}
            <div className="relative shrink-0 z-50" ref={profileRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsProfileOpen((prev) => !prev);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-colors cursor-pointer group"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6356E5] to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-[#6356E5]/20 overflow-hidden shrink-0 group-hover:ring-2 group-hover:ring-[#6356E5]/30 transition-all">
                  <img
                    src={currentAvatar}
                    alt={currentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-black text-[#0F172A] leading-tight group-hover:text-[#6356E5] transition-colors">
                    {currentName}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">
                    {currentRole}
                  </p>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 hidden lg:block transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180 text-[#6356E5]' : ''
                  }`}
                />
              </button>

              {/* ── Profile Dropdown Menu Card ── */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-[999] space-y-1 text-xs font-bold text-slate-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* User Header */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileOpen(false);
                        navigate('/super-admin/profile');
                      }}
                      className="p-3 bg-slate-50/80 hover:bg-purple-50/70 transition-colors rounded-2xl border border-slate-100 flex items-center gap-3 cursor-pointer group/card"
                    >
                      <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-2xs border border-purple-100 shrink-0">
                        <img
                          src={currentAvatar}
                          alt={currentName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-black text-[#0F172A] group-hover/card:text-[#6356E5] transition-colors truncate">
                            {currentName}
                          </p>
                          <span className="flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Online</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">{currentEmail}</p>
                        <span className="text-[9px] font-black text-[#6356E5] block pt-0.5">{currentRole}</span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="pt-1 space-y-0.5">
                      {/* 1. My Profile */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                          navigate('/super-admin/profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>

                      {/* 2. Account Settings */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                          navigate('/super-admin/settings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Account Settings</span>
                      </button>

                      {/* 3. Security */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                          navigate('/super-admin/settings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer text-left"
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span>Security & Access</span>
                      </button>

                      {/* 4. Theme Submenu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsThemeSubmenuOpen(!isThemeSubmenuOpen);
                            setIsLanguageSubmenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            {activeTheme === 'Light' ? (
                              <Sun className="w-4 h-4 text-amber-500" />
                            ) : activeTheme === 'Dark' ? (
                              <Moon className="w-4 h-4 text-indigo-500" />
                            ) : (
                              <Laptop className="w-4 h-4 text-slate-400" />
                            )}
                            <span>Theme</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{activeTheme} ▾</span>
                        </button>

                        {isThemeSubmenuOpen && (
                          <div className="p-1 my-1 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                            {(['Light', 'Dark', 'System'] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTheme(t);
                                  setIsThemeSubmenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                                  activeTheme === t
                                    ? 'bg-purple-100/70 text-[#6356E5] font-black'
                                    : 'text-slate-600 hover:bg-white'
                                }`}
                              >
                                <span>{t}</span>
                                {activeTheme === t && <Check className="w-3 h-3 text-[#6356E5]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 5. Language Submenu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLanguageSubmenuOpen(!isLanguageSubmenuOpen);
                            setIsThemeSubmenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span>Language</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{activeLanguage} ▾</span>
                        </button>

                        {isLanguageSubmenuOpen && (
                          <div className="p-1 my-1 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                            {(['English', 'Hindi'] as const).map((l) => (
                              <button
                                key={l}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveLanguage(l);
                                  setIsLanguageSubmenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                                  activeLanguage === l
                                    ? 'bg-purple-100/70 text-[#6356E5] font-black'
                                    : 'text-slate-600 hover:bg-white'
                                }`}
                              >
                                <span>{l}</span>
                                {activeLanguage === l && <Check className="w-3 h-3 text-[#6356E5]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 6. Help Center */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsProfileOpen(false);
                          navigate('/super-admin/support');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer text-left"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span>Help Center</span>
                      </button>

                      {/* 7. Logout */}
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsProfileOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />
    </>
  );
};
