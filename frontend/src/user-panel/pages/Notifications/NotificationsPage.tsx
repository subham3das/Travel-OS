import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  MessageSquare,
  Building2,
  Tag,
  CheckCheck,
  BellOff,
  X,
} from 'lucide-react';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  NotificationCategory,
  NotificationItem,
} from '../../data/notifications';
import { NotificationCard } from './components/NotificationCard';
import { BottomNavigation } from '../../components/common/BottomNavigation';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(getNotifications());
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filterChips: { id: NotificationCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: null },
    { id: 'bookings', label: 'Bookings', icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'community', label: 'Community', icon: <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> },
    { id: 'agency', label: 'Agency', icon: <Building2 className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'offers', label: 'Offers', icon: <Tag className="w-3.5 h-3.5 text-orange-500" /> },
  ];

  const handleNotificationClick = (n: NotificationItem) => {
    markAsRead(n.id);
    setNotifications(getNotifications());
    navigate(n.actionRoute);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    setNotifications(getNotifications());
  };

  // Filtered Notifications
  const filteredList = notifications.filter((n) => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (showUnreadOnly && n.isRead) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        (n.highlightText && n.highlightText.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Group by Section
  const sections: ('Today' | 'Yesterday' | 'This Week' | 'Earlier')[] = [
    'Today',
    'Yesterday',
    'This Week',
    'Earlier',
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Notifications
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
              title="Search Notifications"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Drawer */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto pt-3"
            >
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications by trip, agency, or post..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Chips Bar */}
        <div className="max-w-2xl mx-auto pt-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {filterChips.map((chip) => {
            const active = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedCategory(chip.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 select-none ${
                  active
                    ? 'bg-white text-[#6356E5] border-2 border-[#6356E5] shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="ml-auto text-[11px] font-black text-[#6356E5] hover:underline cursor-pointer shrink-0 flex items-center gap-1 pl-2"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>
      </header>

      {/* Main Notification Sections Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
        {filteredList.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center space-y-3 my-8 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
              <BellOff className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-[#0F172A]">No Notifications Yet</h3>
            <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">
              We'll notify you when something important happens with your bookings, community posts, or trip updates.
            </p>
          </div>
        ) : (
          sections.map((sec) => {
            const secItems = filteredList.filter((n) => n.section === sec);
            if (secItems.length === 0) return null;

            return (
              <div key={sec} className="space-y-2">
                <h3 className="text-xs font-black text-slate-500 tracking-tight px-1">
                  {sec}
                </h3>

                <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {secItems.map((item) => (
                    <NotificationCard
                      key={item.id}
                      notification={item}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Shared Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default NotificationsPage;
