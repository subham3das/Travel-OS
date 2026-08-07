import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, MessageSquare } from 'lucide-react';
import { Logo } from '../common/Logo';

interface AppHeaderProps {
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  unreadNotificationsCount = 2,
  unreadMessagesCount = 1,
  onNotificationClick,
  onMessageClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Explore', path: '/explore' },
    { label: 'My Trips', path: '/my-trips' },
    { label: 'Community', path: '/community' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Name & Icon */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-[#0F172A] hover:opacity-90 transition-opacity focus:outline-none"
          >
            <svg className="w-6 h-6 text-[#FF4D6D] fill-current" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            <span className="text-xl sm:text-2xl font-black tracking-tight">ApnaTrip</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path.includes('trips') &&
                  (location.pathname === '/trips' || location.pathname === '/my-trips'));
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions (Notification & Message icons) */}
        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <button
            onClick={onNotificationClick}
            className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 hover:text-[#0F172A] transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FF4D6D] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Message Icon */}
          <button
            onClick={onMessageClick}
            className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 hover:text-[#0F172A] transition-colors focus:outline-none"
            aria-label="Messages"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FF4D6D] rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
