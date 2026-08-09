import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  User,
  Calendar,
  CreditCard,
  BarChart2,
  Clock,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ADMIN_NAV_SECTIONS } from '../../constants/adminNavigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { AdminDesktopOnly } from '../../components/auth/AdminDesktopOnly';

/**
 * Super Admin Panel Layout Shell
 * Matches reference image admin-dashboard.png (Dark Sidebar #181739).
 */
export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logoutAdmin } = useAdminAuth();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />;
      case 'Building2':
        return <Building2 className="w-4.5 h-4.5 shrink-0" />;
      case 'Users':
        return <Users className="w-4.5 h-4.5 shrink-0" />;
      case 'User':
        return <User className="w-4.5 h-4.5 shrink-0" />;
      case 'Calendar':
        return <Calendar className="w-4.5 h-4.5 shrink-0" />;
      case 'CreditCard':
        return <CreditCard className="w-4.5 h-4.5 shrink-0" />;
      case 'BarChart2':
        return <BarChart2 className="w-4.5 h-4.5 shrink-0" />;
      case 'Clock':
        return <Clock className="w-4.5 h-4.5 shrink-0" />;
      case 'Shield':
        return <Shield className="w-4.5 h-4.5 shrink-0" />;
      case 'Settings':
      default:
        return <Settings className="w-4.5 h-4.5 shrink-0" />;
    }
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
    <>
      {/* ── Screen Width Guard: Small Screens / Mobile fallback (< 1024px) ── */}
      <div className="lg:hidden">
        <AdminDesktopOnly />
      </div>

      {/* ── Desktop Admin Layout (>= 1024px) ── */}
      <div className="hidden lg:flex min-h-screen bg-[#F8F9FC] text-[#0F172A] font-sans select-none overflow-hidden">
        {/* ── DARK SIDEBAR (Width 260px) ── */}
        <aside className="w-64 bg-[#181739] text-white flex flex-col justify-between p-4 shrink-0 shadow-xl border-r border-slate-800/60 z-30">
          <div className="space-y-6">
            {/* Brand Logo Header */}
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 rounded-2xl bg-[#583BE8] text-white flex items-center justify-center shadow-md shadow-[#583BE8]/30 shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                    fill="white"
                    fillOpacity="0.3"
                  />
                  <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
                  <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-none">
                  Apna<span className="text-purple-400">Trip</span>
                </span>
                <span className="text-[9px] font-black tracking-widest uppercase text-slate-400 block mt-0.5">
                  ADMIN PORTAL
                </span>
              </div>
            </div>

            {/* Navigation Groups */}
            <nav className="space-y-5">
              {ADMIN_NAV_SECTIONS.map((section, idx) => (
                <div key={idx} className="space-y-1.5">
                  {section.title && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">
                      {section.title}
                    </p>
                  )}

                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path;

                      return (
                        <button
                          key={item.id}
                          disabled={item.isDisabled}
                          onClick={() => !item.isDisabled && navigate(item.path)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                            item.isDisabled
                              ? 'text-slate-500 opacity-50 cursor-not-allowed'
                              : isActive
                              ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/30 cursor-pointer'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white cursor-pointer'
                          }`}
                        >
                          {getIcon(item.iconName)}
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Admin User Profile Card & Logout */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#583BE8] text-white flex items-center justify-center text-xs font-black shrink-0">
                  {getInitials(admin?.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-white truncate leading-tight">
                    {admin?.name || 'Super Admin'}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 truncate leading-tight">
                    {admin?.email || 'superadmin@apnatrip.com'}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT CONTAINER ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
