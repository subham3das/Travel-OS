import React, { useState } from 'react';
import { Search, Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAdminAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SA';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-2xs select-none">
      {/* Left Greeting */}
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Welcome back, {admin?.name || 'Super Admin'}! 👋
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Here's today's agency verification overview.
        </p>
      </div>

      {/* Right Search & Profile Tools */}
      <div className="flex items-center gap-4">
        {/* Search Input Box */}
        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agencies, applications..."
            className="w-full pl-10 pr-10 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 rounded-md">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          onClick={() => alert('Notifications — 7 pending reviews require attention.')}
          className="relative w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
            7
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {admin?.avatar ? (
              <img
                src={admin.avatar}
                alt="Avatar"
                className="w-9 h-9 rounded-2xl object-cover border border-purple-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-[#583BE8] text-white flex items-center justify-center text-xs font-black shadow-sm">
                {getInitials(admin?.name)}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-[#0F172A] truncate">{admin?.name || 'Super Admin'}</p>
                <p className="text-[10px] font-semibold text-slate-400 truncate">{admin?.email || 'admin@apnatrip.com'}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/admin/settings');
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Admin Profile</span>
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
