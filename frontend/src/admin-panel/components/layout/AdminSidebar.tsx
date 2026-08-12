import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  UserCheck,
  Users,
  Package,
  CalendarCheck,
  Compass,
  CreditCard,
  Wallet,
  Star,
  MessageSquare,
  Headphones,
  Bell,
  FileText,
  Layout,
  ShieldCheck,
  Clock,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'agencies', label: 'Agencies', path: '/admin/agencies', icon: <Building2 className="w-4.5 h-4.5" /> },
    { id: 'requests', label: 'Agency Requests', path: '/admin/verification-pending', icon: <UserCheck className="w-4.5 h-4.5" />, badge: 23 },
    { id: 'users', label: 'Users', path: '/admin/users', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'packages', label: 'Packages', path: '/admin/packages', icon: <Package className="w-4.5 h-4.5" /> },
    { id: 'bookings', label: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck className="w-4.5 h-4.5" /> },
    { id: 'trips', label: 'Trips', path: '/admin/trips', icon: <Compass className="w-4.5 h-4.5" /> },
    { id: 'payments', label: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-4.5 h-4.5" /> },
    { id: 'finance', label: 'Finance', path: '/admin/finance', icon: <Wallet className="w-4.5 h-4.5" /> },
    { id: 'reviews', label: 'Reviews', path: '/admin/reviews', icon: <Star className="w-4.5 h-4.5" /> },
    { id: 'community', label: 'Community', path: '/admin/community', icon: <MessageSquare className="w-4.5 h-4.5" /> },
    { id: 'support', label: 'Support', path: '/admin/support', icon: <Headphones className="w-4.5 h-4.5" />, badge: 8 },
    { id: 'notifications', label: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4.5 h-4.5" /> },
    { id: 'reports', label: 'Reports', path: '/admin/reports', icon: <FileText className="w-4.5 h-4.5" /> },
    { id: 'cms', label: 'CMS', path: '/admin/cms', icon: <Layout className="w-4.5 h-4.5" /> },
    { id: 'roles', label: 'Roles', path: '/admin/roles', icon: <ShieldCheck className="w-4.5 h-4.5" /> },
    { id: 'audit-logs', label: 'Audit Logs', path: '/admin/audit-logs', icon: <Clock className="w-4.5 h-4.5" /> },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  return (
    <aside
      className={`h-full bg-white border-r border-slate-100/90 flex flex-col justify-between transition-all duration-300 z-40 select-none shadow-xs shrink-0 ${
        isCollapsed ? 'w-20 px-2 py-4' : 'w-64 px-4 py-5'
      }`}
    >
      <div className="flex flex-col h-full min-h-0 space-y-4">
        {/* Sidebar Header: Logo & Collapsible Toggle */}
        <div className="flex items-center justify-between px-2 py-1 shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            <div className="w-9 h-9 rounded-2xl bg-[#6356E5] text-white flex items-center justify-center shadow-md shadow-[#6356E5]/20 shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                  fill="white"
                  fillOpacity="0.4"
                />
                <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
                <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
              </svg>
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-base font-black text-[#0F172A] tracking-tight block leading-tight">
                  Travel OS
                </span>
                <span className="text-[10px] font-bold text-slate-400 block leading-tight">
                  Super Admin
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto space-y-1 scrollbar-none pr-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/admin' && (location.pathname === '/admin' || location.pathname === '/admin/dashboard'));

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#6356E5] shadow-2xs font-black'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-[#6356E5]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      isActive
                        ? 'bg-[#6356E5] text-white'
                        : 'bg-[#EEF2FF] text-[#6356E5]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Platform View Button */}
        <div className="pt-3 border-t border-slate-100 shrink-0">
          <button
            onClick={() => navigate('/home')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
          >
            {!isCollapsed && <span>View Platform</span>}
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
};
