import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  MessageSquare,
  Calendar,
  Filter,
  ChevronDown,
  User,
  Shield,
  LogOut,
  Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface AdminHeaderProps {
  onSearchChange?: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onSearchChange }) => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('May 21 – Jun 21, 2025');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100/90 px-4 sm:px-6 py-3.5 shadow-2xs select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1600px] mx-auto">
        {/* Left: Global Search Input */}
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

        {/* Right Controls: Platform Status, Date Range, Filter, Notifications, Profile */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-end overflow-x-auto scrollbar-none">
          {/* Platform Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Platform Online</span>
          </div>

          {/* Date Range Selector */}
          <div className="relative shrink-0">
            <button
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
            onClick={() => {}}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0"
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Custom Filter</span>
          </button>

          {/* Notification Icon */}
          <button
            onClick={() => navigate('/admin/notifications')}
            className="relative w-10 h-10 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
              12
            </span>
          </button>

          {/* Message Icon */}
          <button
            onClick={() => navigate('/admin/support')}
            className="relative w-10 h-10 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
            title="Messages & Support"
          >
            <MessageSquare className="w-4.5 h-4.5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6356E5] text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
              5
            </span>
          </button>

          {/* Admin Profile Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6356E5] to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-[#6356E5]/20 overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  alt="Super Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-black text-[#0F172A] leading-tight">Super Admin</p>
                <p className="text-[10px] font-bold text-slate-400 leading-tight">Platform Owner</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 space-y-1 text-xs font-bold text-slate-700"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-black text-[#0F172A]">{admin?.name || 'Super Admin'}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{admin?.email || 'superadmin@apnatrip.com'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/admin/roles');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Roles & Permissions</span>
                  </button>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
