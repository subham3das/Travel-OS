import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Luggage,
  Heart,
  Receipt,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Globe2,
  HelpCircle,
  LogOut,
  Settings,
} from 'lucide-react';

export const QuickAccessList: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    {
      id: 'trips',
      title: 'My Trips',
      subtitle: 'Manage your bookings & itineraries',
      icon: <Luggage className="w-5 h-5" />,
      iconBg: 'bg-emerald-50 text-emerald-600',
      path: '/my-trips',
    },
    {
      id: 'saved',
      title: 'Saved Trips',
      subtitle: 'Places you want to visit',
      icon: <Heart className="w-5 h-5" />,
      iconBg: 'bg-rose-50 text-[#FF4D6D]',
      path: '/explore',
    },
    {
      id: 'bookings',
      title: 'Booking History',
      subtitle: 'All your bookings in one place',
      icon: <Receipt className="w-5 h-5" />,
      iconBg: 'bg-sky-50 text-sky-600',
      path: '/my-trips',
    },
    {
      id: 'wishlist',
      title: 'Wishlisted',
      subtitle: 'Packages, stays & experiences',
      icon: <Bookmark className="w-5 h-5" />,
      iconBg: 'bg-[#FFE5EC] text-[#FF4D6D]',
      path: '/saved-destinations',
    },
    {
      id: 'agencies',
      title: 'Saved Agencies',
      subtitle: 'Your trusted travel partners',
      icon: <Bookmark className="w-5 h-5" />,
      iconBg: 'bg-purple-50 text-purple-600',
      path: '/agencies',
    },
  ];

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-2 sm:p-3 shadow-2xs divide-y divide-slate-100">
      {items.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ x: 3 }}
          onClick={() => navigate(item.path)}
          className="p-3 sm:p-4 flex items-center justify-between gap-4 cursor-pointer group rounded-2xl hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
            >
              {item.icon}
            </div>

            <div>
              <h5 className="text-sm font-bold text-[#0F172A] tracking-tight">{item.title}</h5>
              <p className="text-xs font-semibold text-slate-400">{item.subtitle}</p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </motion.div>
      ))}
    </div>
  );
};

export const AccountSettingsList: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const settingsItems = [
    { id: 'security', label: 'Privacy & Security', path: '/settings', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> },
    { id: 'payments', label: 'Payment Methods', path: '/settings', icon: <CreditCard className="w-5 h-5 text-sky-600" /> },
    { id: 'language', label: 'Language & Region', path: '/settings', icon: <Globe2 className="w-5 h-5 text-purple-600" /> },
    { id: 'help', label: 'Help & Support', path: '/settings', icon: <HelpCircle className="w-5 h-5 text-amber-600" /> },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5 text-[#6356E5]" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-3 sm:p-4 shadow-2xs space-y-2">
      <h4 className="text-sm font-extrabold text-[#0F172A] tracking-tight px-3 pt-2">
        Account Settings
      </h4>

      <div className="divide-y divide-slate-100">
        {settingsItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            className="p-3 flex items-center justify-between gap-4 cursor-pointer rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full p-3 rounded-xl hover:bg-rose-50 text-[#FF4D6D] text-xs sm:text-sm font-bold flex items-center gap-3 transition-colors focus:outline-none cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
