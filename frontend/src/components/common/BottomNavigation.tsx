import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Briefcase, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

export interface NavTab {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface BottomNavigationProps {
  activeTab?: string;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: NavTab[] = [
    { id: 'home', label: 'Home', path: '/home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', path: '/explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'trips', label: 'My Trips', path: '/my-trips', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'community', label: 'Community', path: '/community', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md sm:max-w-lg bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-slate-100 px-3 sm:px-4 py-2 flex items-center justify-between transition-all ${className}`}
    >
      {tabs.map((tab) => {
        const isCurrent = activeTab
          ? activeTab === tab.id || (tab.id === 'trips' && (activeTab === 'my-trips' || activeTab === 'trips'))
          : location.pathname === tab.path ||
            (tab.id === 'trips' && (location.pathname === '/trips' || location.pathname === '/my-trips'));

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="relative flex flex-col items-center justify-center py-1 px-3 sm:px-4 rounded-full transition-all focus:outline-none group"
          >
            {/* Icon */}
            <div
              className={`transition-colors duration-200 ${
                isCurrent ? 'text-[#FF4D6D]' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            >
              {tab.icon}
            </div>

            {/* Label */}
            <span
              className={`text-[10px] sm:text-xs font-semibold leading-tight mt-0.5 transition-colors duration-200 ${
                isCurrent ? 'text-[#FF4D6D] font-bold' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            >
              {tab.label}
            </span>

            {/* Active Indicator Bar */}
            {isCurrent && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -bottom-1 w-5 h-1 bg-[#FF4D6D] rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
