import React, { useState } from 'react';
import { Bell, MessageSquare, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { agency, agencyUser, logoutAgency } = useAgencyAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutAgency();
    navigate('/agency/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-2xs select-none">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
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
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#583BE8] text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
            2
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/agency/notifications')}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {agency?.logo ? (
              <img
                src={agency.logo}
                alt="Agency Logo"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#583BE8] shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#583BE8] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                {agency?.name ? agency.name.substring(0, 2).toUpperCase() : 'AT'}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-[#0F172A] truncate">{agency?.name || 'Himalayan Trails'}</p>
                <p className="text-[10px] font-semibold text-slate-400 truncate">{agencyUser?.email || 'owner@agency.com'}</p>
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
                onClick={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
