import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  Headphones,
  Clock,
  ShieldCheck,
  X,
  MessageSquareOff,
} from 'lucide-react';
import { getChats, ChatConversation } from '../../data/chats';
import { ChatCard } from './components/ChatCard';
import { BottomNavigation } from '../../components/common/BottomNavigation';

export const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatConversation[]>(getChats());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'agencies' | 'support' | 'bookings'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSecurityBanner, setShowSecurityBanner] = useState(true);

  const filterChips: { id: 'all' | 'agencies' | 'support' | 'bookings'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: null },
    { id: 'agencies', label: 'Agencies', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'support', label: 'Support', icon: <Headphones className="w-3.5 h-3.5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  const handleChatClick = (chat: ChatConversation) => {
    navigate(`/chat/${chat.id}`);
  };

  const filteredChats = chats.filter((c) => {
    if (selectedFilter === 'agencies' && c.category !== 'agencies') return false;
    if (selectedFilter === 'support' && c.category !== 'support') return false;
    if (selectedFilter === 'bookings' && !c.bookingId) return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        c.agencyName.toLowerCase().includes(q) ||
        (c.bookingId && c.bookingId.toLowerCase().includes(q)) ||
        (c.packageName && c.packageName.toLowerCase().includes(q)) ||
        (c.destinationName && c.destinationName.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Chats
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
              title="Search Chats"
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
                  placeholder="Search by agency name, booking ID, or package..."
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

        {/* Filter Chips Bar */}
        <div className="max-w-2xl mx-auto pt-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {filterChips.map((chip) => {
            const active = selectedFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedFilter(chip.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 select-none ${
                  active
                    ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20 border border-[#6356E5]'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Chat List Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-32">
        {filteredChats.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center space-y-3 my-8 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
              <MessageSquareOff className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-[#0F172A]">No Conversations Yet</h3>
            <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">
              Start chatting with a verified travel agency directly from any package or booking page.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {filteredChats.map((chat) => (
              <ChatCard key={chat.id} chat={chat} onClick={handleChatClick} />
            ))}
          </div>
        )}

        {/* Security Banner at Bottom */}
        {showSecurityBanner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6356E5]/10 text-[#6356E5] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-xs font-black text-[#0F172A]">Chat with verified travel agencies</h4>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">
                  All agencies are verified & your conversations are secured with end-to-end encryption.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSecurityBanner(false)}
              className="text-slate-400 hover:text-slate-600 p-1 shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </main>

      {/* Shared Bottom Navigation */}
      <BottomNavigation activeTab="chat" />
    </div>
  );
};

export default ChatListPage;
