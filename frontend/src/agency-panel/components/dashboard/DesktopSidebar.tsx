import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from '../../../common/brand';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Package,
  MapPin,
  Bell,
  Users,
  MessageSquare,
  BarChart2,
  LogOut,
  User,
  Car,
  Settings,
  CalendarDays,
  Star,
  Layers,
  Lock,
} from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
import { AgencyVerificationStatus } from '../../types/agency';
import { ApprovalRequiredModal } from './ApprovalRequiredModal';

export const DesktopSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { agency, logoutAgency } = useAgencyAuth();
  const { activeBusiness } = useActiveBusiness();
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const handleLogout = () => {
    logoutAgency();
    navigate('/agency/login');
  };

  const agencyNavItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/agency/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'packages', label: 'Packages', path: '/agency/packages', icon: <Package className="w-4.5 h-4.5" /> },
    { id: 'bookings', label: 'Bookings', path: '/agency/bookings', icon: <Calendar className="w-4.5 h-4.5" /> },
    { id: 'customers', label: 'Customers', path: '/agency/customers', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'messages', label: 'Messages', path: '/agency/messages', icon: <MessageSquare className="w-4.5 h-4.5" /> },
    { id: 'analytics', label: 'Analytics', path: '/agency/analytics', icon: <BarChart2 className="w-4.5 h-4.5" /> },
    { id: 'settings', label: 'Settings', path: '/agency/profile/settings', icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  const carRentalNavItems = [
    { id: 'cr-dashboard', label: 'Dashboard', path: '/agency/car-rental/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'cr-cars', label: 'Vehicles', path: '/agency/car-rental/cars', icon: <Car className="w-4.5 h-4.5" /> },
    { id: 'cr-fleet-overview', label: 'Fleet Overview', path: '/agency/car-rental/fleet-overview', icon: <Layers className="w-4.5 h-4.5" /> },
    { id: 'cr-bookings', label: 'Bookings', path: '/agency/car-rental/bookings', icon: <Calendar className="w-4.5 h-4.5" /> },
    { id: 'cr-drivers', label: 'Drivers', path: '/agency/car-rental/drivers', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'cr-customers', label: 'Customers', path: '/agency/car-rental/customers', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'cr-reviews', label: 'Reviews', path: '/agency/car-rental/reviews', icon: <Star className="w-4.5 h-4.5" /> },
    { id: 'cr-analytics', label: 'Analytics', path: '/agency/car-rental/analytics', icon: <BarChart2 className="w-4.5 h-4.5" /> },
    { id: 'cr-settings', label: 'Settings', path: '/agency/car-rental/settings', icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  const navItems = activeBusiness === 'car_rental' ? carRentalNavItems : agencyNavItems;

  const rawName = agency?.agencyDisplayName || agency?.name || 'Agency Partner';
  const nameWords = rawName.trim().split(/\s+/);
  const initials =
    nameWords.length >= 2
      ? `${nameWords[0][0]}${nameWords[1][0]}`.toUpperCase()
      : rawName.slice(0, 2).toUpperCase();

  const onboardingStatus =
    agency?.onboardingStatus ||
    (agency?.verificationStatus === 'APPROVED' ? 'APPROVED' : 'PAYMENT_PENDING');
  const isApproved = onboardingStatus === 'APPROVED';

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-64 bg-white border-r border-slate-100 flex-col justify-between p-5 shrink-0 shadow-xs select-none z-30 overflow-y-auto scrollbar-none">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div
          className="flex flex-col gap-1.5 px-2 cursor-pointer"
          onClick={() => navigate(activeBusiness === 'car_rental' ? '/agency/car-rental/dashboard' : '/agency/dashboard')}
        >
          <BrandLogo theme="light" className="h-8 w-auto max-w-[170px]" alt="ApnaTrip" />
          <span className="text-[9px] font-black tracking-widest uppercase text-slate-400 block pl-0.5">
            {activeBusiness === 'car_rental' ? 'CAR RENTAL PORTAL' : 'TRAVEL AGENCY PORTAL'}
          </span>
        </div>

        {/* Animated Navigation Items */}
        <AnimatePresence mode="wait">
          <motion.nav
            key={activeBusiness}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/agency/dashboard' &&
                  item.path !== '/agency/car-rental/dashboard' &&
                  location.pathname.startsWith(item.path));

              const isOperational =
                item.id !== 'dashboard' &&
                item.id !== 'cr-dashboard' &&
                item.id !== 'settings' &&
                item.id !== 'cr-settings';

              const isItemLocked = !isApproved && isOperational;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isItemLocked) {
                      setShowApprovalModal(true);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  title={isItemLocked ? 'Locked until registration fee is paid and application is verified.' : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/25'
                      : isItemLocked
                      ? 'text-slate-400 hover:bg-slate-50'
                      : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#583BE8]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isItemLocked && (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.nav>
        </AnimatePresence>
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
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-[#0F172A] truncate">{rawName}</p>
            <p
              className={`text-[10px] font-semibold ${
                onboardingStatus === 'APPROVED'
                  ? 'text-emerald-600'
                  : onboardingStatus === 'UNDER_REVIEW'
                  ? 'text-indigo-600'
                  : 'text-amber-600'
              }`}
            >
              {onboardingStatus === 'APPROVED'
                ? '✓ Verified Partner'
                : onboardingStatus === 'UNDER_REVIEW'
                ? '• Under Review'
                : '• Registration Fee Pending'}
            </p>
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

      {/* Approval Required Modal */}
      <ApprovalRequiredModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        applicationId={agency?.applicationId || (agency as any)?._id}
        businessName={rawName}
      />
    </aside>
  );
};

export default DesktopSidebar;
