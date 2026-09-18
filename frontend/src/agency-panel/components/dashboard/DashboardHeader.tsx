import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [showDropdown, setShowDropdown] = useState(false);
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

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-2xs select-none">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/agency/dashboard')}>
          <div className="w-8 h-8 rounded-full bg-[#583BE8] flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
              <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Apna<span className="text-[#583BE8]">Trip</span>
          </span>
        </div>
      </div>

      {/* Right: Notifications Bell & Avatar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/agency/messages')}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          aria-label="View messages"
        >
          <MessageSquare className="w-4.5 h-4.5 text-[#583BE8]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#583BE8] text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/agency/notifications')}
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
                className="w-9 h-9 rounded-full object-cover border-2 border-[#583BE8] shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#583BE8] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                {initials}
              </div>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-150 ${showDropdown ? 'rotate-180 text-[#583BE8]' : ''}`} />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop overlay to prevent clicking under dropdown */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#0F172A] truncate">{rawName}</p>
                  <p className="text-[10px] font-semibold text-slate-400 truncate">{ownerEmail}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/agency/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Agency Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
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
