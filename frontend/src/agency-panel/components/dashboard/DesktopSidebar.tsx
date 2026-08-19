import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Package,
  MapPin,
  Bell,
  Users,
  Star,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';

export const DesktopSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { agency, logoutAgency } = useAgencyAuth();

  const handleLogout = () => {
    logoutAgency();
    navigate('/agency/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/agency/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'messages', label: 'Messages', path: '/agency/messages', icon: <MessageSquare className="w-4.5 h-4.5" /> },
    { id: 'customers', label: 'Customers', path: '/agency/customers', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'bookings', label: 'Bookings', path: '/agency/bookings', icon: <Calendar className="w-4.5 h-4.5" /> },
    { id: 'packages', label: 'Packages', path: '/agency/packages', icon: <Package className="w-4.5 h-4.5" /> },
    { id: 'trips', label: 'Trips', path: '/agency/trips', icon: <MapPin className="w-4.5 h-4.5" /> },
    { id: 'profile', label: 'Agency Profile', path: '/agency/profile', icon: <User className="w-4.5 h-4.5" /> },
    { id: 'notifications', label: 'Notifications', path: '/agency/notifications', icon: <Bell className="w-4.5 h-4.5" /> },
    { id: 'analytics', label: 'Analytics', path: '/agency/analytics', icon: <BarChart2 className="w-4.5 h-4.5" /> },
  ];

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-64 bg-white border-r border-slate-100 flex-col justify-between p-5 shrink-0 shadow-xs select-none z-30 overflow-y-auto scrollbar-none">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-2xl bg-[#583BE8] text-white flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
              <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#0F172A] block leading-none">
              Apna<span className="text-[#583BE8]">Trip</span>
            </span>
            <span className="text-[9px] font-black tracking-widest uppercase text-slate-400 block mt-0.5">
              PARTNER PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/25'
                    : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#583BE8]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div
          onClick={() => navigate('/agency/profile')}
          className="flex items-center gap-3 px-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          {agency?.logo ? (
            <img src={agency.logo} alt="Logo" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#583BE8] text-white font-black text-xs flex items-center justify-center">
              WH
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-[#0F172A] truncate">{agency?.name || 'Wander Horizons'}</p>
            <p className="text-[10px] font-semibold text-emerald-600">✓ Verified Partner</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
