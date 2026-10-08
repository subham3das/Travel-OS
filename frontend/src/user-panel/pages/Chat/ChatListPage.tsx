import React, { useState, useEffect, useMemo } from 'react';
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
  Car,
} from 'lucide-react';
import { ChatConversation } from '../../data/chats';
import { customerChatService } from '../../services/customerChat.service';
import { userSocketService } from '../../services/userSocket.service';
import { ChatCard } from './components/ChatCard';
import { BottomNavigation } from '../../components/common/BottomNavigation';

type FilterType = 'all' | 'packages' | 'cars' | 'bookings' | 'support' | 'agencies';

export const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSecurityBanner, setShowSecurityBanner] = useState(true);

  useEffect(() => {
    let isMounted = true;
    customerChatService.getConversations().then((liveList) => {
      if (isMounted) {
        setChats(liveList || []);
      }
    });

    const unsubscribe = userSocketService.subscribe('message:new', () => {
      if (!isMounted) return;
      customerChatService.getConversations().then((updated) => {
        if (isMounted) {
          setChats(updated || []);
        }
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const isPackageChat = (c: ChatConversation) =>
    (c.conversationType === 'PACKAGE' || c.category === 'agencies' || c.category === 'hosts' || Boolean(c.packageName)) &&
    c.conversationType !== 'CAR_RENTAL' &&
    c.category !== 'cars' &&
    c.category !== 'support';

  const isCarChat = (c: ChatConversation) =>
    c.conversationType === 'CAR_RENTAL' || c.category === 'cars' || Boolean(c.vehicleBooking);

  const isBookingChat = (c: ChatConversation) =>
    Boolean(
      (c.bookingId && c.bookingId.trim().length > 0) ||
      (c.vehicleBooking?.bookingId && c.vehicleBooking.bookingId.trim().length > 0)
    );

  const isSupportChat = (c: ChatConversation) =>
    c.category === 'support' ||
    c.agencyId?.startsWith('support') ||
    c.agencyName?.toLowerCase().includes('support') ||
    c.agencyName?.toLowerCase().includes('concierge') ||
    c.agencyName?.toLowerCase().includes('billing');

  const counts = useMemo(() => {
    return {
      all: chats.length,
      packages: chats.filter(isPackageChat).length,
      cars: chats.filter(isCarChat).length,
      bookings: chats.filter(isBookingChat).length,
      support: chats.filter(isSupportChat).length,
    };
  }, [chats]);

  const filterChips: { id: FilterType; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All', icon: null, count: counts.all },
    { id: 'packages', label: 'Packages', icon: <Briefcase className="w-3.5 h-3.5" />, count: counts.packages },
    { id: 'cars', label: 'Car Rentals', icon: <Car className="w-3.5 h-3.5" />, count: counts.cars },
    { id: 'bookings', label: 'Bookings', icon: <Clock className="w-3.5 h-3.5" />, count: counts.bookings },
    { id: 'support', label: 'Support', icon: <Headphones className="w-3.5 h-3.5" />, count: counts.support },
  ];

  const handleChatClick = (chat: ChatConversation) => {
    navigate(`/chat/${chat.id}`);
  };

  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      if (selectedFilter === 'packages' || selectedFilter === 'agencies') {
        if (!isPackageChat(c)) return false;
      } else if (selectedFilter === 'cars') {
        if (!isCarChat(c)) return false;
      } else if (selectedFilter === 'bookings') {
        if (!isBookingChat(c)) return false;
      } else if (selectedFilter === 'support') {
        if (!isSupportChat(c)) return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          c.agencyName?.toLowerCase().includes(q) ||
          (c.bookingId && c.bookingId.toLowerCase().includes(q)) ||
          (c.packageName && c.packageName.toLowerCase().includes(q)) ||
          (c.destinationName && c.destinationName.toLowerCase().includes(q)) ||
          (c.vehicleBooking?.vehicleName && c.vehicleBooking.vehicleName.toLowerCase().includes(q)) ||
          (c.vehicleBooking?.bookingId && c.vehicleBooking.bookingId.toLowerCase().includes(q)) ||
          (c.vehicleBooking?.rentalProvider && c.vehicleBooking.rentalProvider.toLowerCase().includes(q)) ||
          (c.vehicleBooking?.pickupLocation && c.vehicleBooking.pickupLocation.toLowerCase().includes(q)) ||
          (c.vehicleBooking?.dropLocation && c.vehicleBooking.dropLocation.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [chats, selectedFilter, searchQuery]);

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
                  placeholder="Search by agency, car, package, or booking ID..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                {chip.count > 0 && (
                  <span
                    className={`ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {chip.count}
                  </span>
                )}
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
            <h3 className="text-base font-black text-[#0F172A]">No Conversations Found</h3>
            <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">
              {searchQuery
                ? `No conversation matches "${searchQuery}". Try a different keyword.`
                : 'No conversations match the selected filter category.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 inline-flex items-center px-4 py-2 text-xs font-bold text-[#6356E5] bg-purple-50 hover:bg-purple-100 rounded-full transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Chat List */
          <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-2xs overflow-hidden">
            {filteredChats.map((chat) => (
              <ChatCard key={chat.id} chat={chat} onClick={handleChatClick} />
            ))}
          </div>
        )}

        {/* Security & Verification Banner */}
        {showSecurityBanner && (
          <div className="p-4 rounded-3xl bg-indigo-50/60 border border-indigo-100/80 flex items-start gap-3 relative">
            <div className="p-2 rounded-2xl bg-white shadow-2xs text-[#6356E5] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pr-6 space-y-0.5">
              <h4 className="text-xs font-black text-[#0F172A]">
                End-to-End Secure Booking Channels
              </h4>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                All communications and vehicle bookings are verified by ApnaTrip.
                Never share UPI PINs or passwords in chat.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSecurityBanner(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ChatListPage;
