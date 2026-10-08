import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import { BrandLogo } from '../../../common/brand';


interface DashboardHeaderProps {
  unreadCount?: number;
  notificationsCount?: number;
  onToggleSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  unreadCount = 0,
  notificationsCount = 0,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { agency, agencyUser, logoutAgency } = useAgencyAuth();
  const { activeBusiness } = useActiveBusiness();
  const [showDropdown, setShowDropdown] = useState(false);

  const messagesPath = activeBusiness === 'car_rental' ? '/agency/car-rental/messages' : '/agency/messages';
  const notificationsPath = activeBusiness === 'car_rental' ? '/agency/car-rental/notifications' : '/agency/notifications';
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown]);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setShowDropdown(false);
    logoutAgency();
    navigate('/agency/login');
  };

  const rawName = agency?.agencyDisplayName || agency?.name || 'Agency Partner';
  const ownerEmail = agencyUser?.email || agency?.email || 'owner@agency.com';
  const nameWords = rawName.trim().split(/\s+/);
  const initials =
    nameWords.length >= 2
      ? `${nameWords[0][0]}${nameWords[1][0]}`.toUpperCase()
      : rawName.slice(0, 2).toUpperCase();

  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-2xs select-none">
      {/* Left: Brand Logo (Visible only on mobile where DesktopSidebar is hidden) */}
      <div className="flex items-center gap-3 md:hidden">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(activeBusiness === 'car_rental' ? '/agency/car-rental/dashboard' : '/agency/dashboard')}
          aria-label="ApnaTrip Agency Dashboard"
        >
          <BrandLogo
            theme="light"
            className="h-8 w-auto max-w-[150px]"
            alt="ApnaTrip"
          />
        </div>
      </div>

      {/* Desktop Left Spacer */}
      <div className="hidden md:block" />

      {/* Right: Notifications Bell & Avatar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(messagesPath)}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          aria-label="View messages"
        >
          <MessageSquare className="w-4.5 h-4.5 text-[#2563EB]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate(notificationsPath)}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
            aria-expanded={showDropdown}
          >
            {agency?.logo ? (
              <img
                src={agency.logo}
                alt="Agency Logo"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#2563EB] shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                {initials}
              </div>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-150 ${showDropdown ? 'rotate-180 text-[#2563EB]' : ''}`} />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop overlay to prevent clicking under dropdown */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-white/10">
                  <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">{rawName}</p>
                  <p className="text-[10px] font-semibold text-slate-400 truncate">{ownerEmail}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/agency/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-[#2563EB] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Agency Profile</span>
                </button>

                {/* Theme Selector */}
                <div className="px-4 py-2 border-t border-b border-slate-100 dark:border-white/10 my-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Theme
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl">
                    {[
                      { id: 'Light', label: '☀️ Light' },
                      { id: 'Dark', label: '🌙 Dark' },
                      { id: 'System', label: '💻 Auto' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTheme(t.id as any)}
                        className={`py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center ${
                          theme === t.id
                            ? 'bg-white dark:bg-slate-800 text-[#2563EB] shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
