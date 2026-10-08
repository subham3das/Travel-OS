import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Package,
  MapPin,
  Users,
  Car,
  Star,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  X,
  MoreHorizontal,
  ChevronRight,
  User,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface TabItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface MoreItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  color?: string;
  danger?: boolean;
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBusiness } = useActiveBusiness();
  const { agency, logoutAgency } = useAgencyAuth();
  const [showMore, setShowMore] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close sheet on route change
  useEffect(() => {
    setShowMore(false);
  }, [location.pathname]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMore]);

  const handleLogout = () => {
    setShowMore(false);
    logoutAgency();
    navigate('/agency/login');
  };

  /* ── Car Rental primary tabs (5 items) ── */
  const carRentalTabs: TabItem[] = [
    {
      id: 'cr-dashboard',
      label: 'Dashboard',
      path: '/agency/car-rental/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'cr-cars',
      label: 'Vehicles',
      path: '/agency/car-rental/cars',
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: 'cr-bookings',
      label: 'Bookings',
      path: '/agency/car-rental/bookings',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'cr-customers',
      label: 'Customers',
      path: '/agency/car-rental/customers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'cr-more',
      label: 'More',
      path: '__more__',
      icon: <MoreHorizontal className="w-5 h-5" />,
    },
  ];

  /* ── Car Rental "More" sheet items ── */
  const carRentalMoreItems: MoreItem[] = [
    {
      id: 'cr-messages',
      label: 'Messages',
      path: '/agency/car-rental/messages',
      icon: <MessageSquare className="w-4 h-4" />,
      color: '#0ea5e9',
    },
    {
      id: 'cr-notifications',
      label: 'Notifications',
      path: '/agency/car-rental/notifications',
      icon: <Bell className="w-4 h-4" />,
      color: '#f59e0b',
    },
    {
      id: 'cr-drivers',
      label: 'Drivers',
      path: '/agency/car-rental/drivers',
      icon: <User className="w-4 h-4" />,
      color: '#583BE8',
    },
    {
      id: 'cr-reviews',
      label: 'Reviews',
      path: '/agency/car-rental/reviews',
      icon: <Star className="w-4 h-4" />,
      color: '#f59e0b',
    },
    {
      id: 'cr-analytics',
      label: 'Analytics',
      path: '/agency/car-rental/analytics',
      icon: <BarChart2 className="w-4 h-4" />,
      color: '#10b981',
    },
    {
      id: 'cr-settings',
      label: 'Settings',
      path: '/agency/car-rental/settings',
      icon: <Settings className="w-4 h-4" />,
      color: '#64748b',
    },
  ];

  /* ── Agency primary tabs (5 items) ── */
  const agencyTabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/agency/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      path: '/agency/bookings',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'packages',
      label: 'Packages',
      path: '/agency/packages',
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: 'customers',
      label: 'Customers',
      path: '/agency/customers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'more',
      label: 'More',
      path: '__more__',
      icon: <MoreHorizontal className="w-5 h-5" />,
    },
  ];

  /* ── Agency "More" sheet items ── */
  const agencyMoreItems: MoreItem[] = [
    {
      id: 'messages',
      label: 'Messages',
      path: '/agency/messages',
      icon: <MessageSquare className="w-4 h-4" />,
      color: '#3b82f6',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/agency/notifications',
      icon: <Bell className="w-4 h-4" />,
      color: '#f59e0b',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/agency/analytics',
      icon: <BarChart2 className="w-4 h-4" />,
      color: '#10b981',
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/agency/profile/settings',
      icon: <Settings className="w-4 h-4" />,
      color: '#64748b',
    },
  ];

  const isCarRental = activeBusiness === 'car_rental';
  const tabs = isCarRental ? carRentalTabs : agencyTabs;
  const moreItems = isCarRental ? carRentalMoreItems : agencyMoreItems;

  const accentColor = isCarRental ? '#0ea5e9' : '#583BE8';
  const accentBg = isCarRental ? 'bg-sky-500' : 'bg-[#583BE8]';
  const accentShadow = isCarRental ? 'shadow-sky-500/30' : 'shadow-[#583BE8]/30';
  const accentText = isCarRental ? 'text-sky-500' : 'text-[#583BE8]';

  const isTabActive = (tab: TabItem) => {
    if (tab.path === '__more__') {
      return (
        showMore ||
        moreItems.some(
          (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/')
        )
      );
    }
    // Exact match for dashboard roots, prefix match for others
    const isDashboard = tab.path.endsWith('/dashboard');
    return isDashboard ? location.pathname === tab.path : location.pathname.startsWith(tab.path);
  };

  const handleTabPress = (tab: TabItem) => {
    if (tab.path === '__more__') {
      setShowMore((prev) => !prev);
      return;
    }
    setShowMore(false);
    navigate(tab.path);
  };

  const rawName = agency?.agencyDisplayName || agency?.name || 'Partner';
  const nameWords = rawName.trim().split(/\s+/);
  const initials =
    nameWords.length >= 2
      ? `${nameWords[0][0]}${nameWords[1][0]}`.toUpperCase()
      : rawName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* ── More Sheet Modal with Exit Animation ── */}
      <AnimatePresence>
        {showMore && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end pointer-events-none">
            {/* Backdrop */}
            <motion.div
              key="more-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs pointer-events-auto"
              onClick={() => setShowMore(false)}
            />

            {/* Sheet */}
            <motion.div
              key="more-sheet-panel"
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
                mass: 0.8,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 90 || info.velocity.y > 400) {
                  setShowMore(false);
                }
              }}
              className="relative bg-white rounded-t-[32px] shadow-2xl border-t border-slate-100 max-h-[85vh] flex flex-col pointer-events-auto z-10 touch-none"
              style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
            >
              {/* Sheet Handle with drag indicator */}
              <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 rounded-full bg-slate-300" />
              </div>

              {/* Sheet Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  {agency?.logo ? (
                    <img
                      src={agency.logo}
                      alt="Logo"
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-black text-xs shadow-sm bg-[#583BE8]"
                    >
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-none">{rawName}</p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1">
                      {isCarRental ? 'Car Rental Portal' : 'Travel Agency Portal'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMore(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sheet Items */}
              <div className="px-4 py-3 space-y-1 overflow-y-auto flex-1 overscroll-contain">
                {moreItems.map((item, idx) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + '/');
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.18 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setShowMore(false);
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-50 text-[#583BE8] font-bold'
                          : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${item.color}18` }}
                        >
                          <span style={{ color: item.color }}>{item.icon}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Divider + Actions */}
              <div className="px-4 pb-2 pt-1 border-t border-slate-100 space-y-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowMore(false);
                    navigate('/agency/help');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-semibold">Help & Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4 text-rose-500" />
                    </div>
                    <span className="text-sm font-semibold">Logout</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-300" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Proper Mobile Bottom Navigation Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(15,23,42,0.06)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        role="navigation"
        aria-label="Mobile bottom navigation"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1.5">
          {tabs.map((tab) => {
            const active = isTabActive(tab);
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => handleTabPress(tab)}
                aria-label={tab.label}
                className={`flex-1 flex flex-col items-center justify-center h-full py-1.5 px-0.5 rounded-2xl transition-colors duration-150 cursor-pointer relative min-w-0 ${
                  active ? 'text-[#583BE8]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {/* Active indicator pill */}
                {active && (
                  <motion.span
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className="absolute inset-x-1.5 inset-y-2 bg-[#583BE8]/10 rounded-xl -z-0"
                  />
                )}

                {/* Icon */}
                <span className={`relative z-10 transition-transform duration-150 ${active ? 'scale-110 text-[#583BE8]' : 'text-slate-400'}`}>
                  {tab.icon}
                </span>

                {/* Label */}
                <span className={`relative z-10 text-[10px] font-bold tracking-tight mt-1 transition-colors ${
                  active ? 'text-[#583BE8]' : 'text-slate-500'
                }`}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
