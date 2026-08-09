import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Sparkles } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { InboxHeader } from '../../components/inbox/InboxHeader';
import { ConversationList } from '../../components/inbox/ConversationList';
import { ChatHeader } from '../../components/inbox/ChatHeader';
import { ChatBubble } from '../../components/inbox/ChatBubble';
import { MessageInput } from '../../components/inbox/MessageInput';
import { CustomerInfoCard } from '../../components/inbox/CustomerInfoCard';

import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  Conversation,
  ChatMessage,
  ConversationFilter,
} from '../../data/inbox';

/**
 * Agency Customer Inbox & DM Center Page
 * Route: /agency/messages (Protected: APPROVED agencies only)
 *
 * Central communications hub connecting agencies and travelers.
 * Mobile Layout: 100% viewport constrained so MessageInput stays fixed & visible at bottom without page scrolling.
 * Desktop Layout: 3-column split view (List | Chat Window | Customer Info Panel).
 */
export const AgencyCustomerInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Selected conversation state (from query param or default first)
  const initialConvId = searchParams.get('conversationId') || MOCK_CONVERSATIONS[0].id;
  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConvId);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('All');

  // Conversations & Messages State
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES);

  // Filtered Conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // 1. Search Query (Name, Booking ID, Trip Name, Phone)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = c.customerName.toLowerCase().includes(q);
        const matchBooking = c.bookingId.toLowerCase().includes(q);
        const matchTrip = c.tripName.toLowerCase().includes(q);
        const matchPhone = c.customerInfo.phone.includes(q);
        if (!matchName && !matchBooking && !matchTrip && !matchPhone) {
          return false;
        }
      }

      // 2. Filter Chip
      if (activeFilter === 'Unread') return c.unreadCount > 0;
      if (activeFilter === 'Upcoming Trips') return c.customerInfo.tripStatus === 'Upcoming';
      if (activeFilter === 'Completed Trips') return c.customerInfo.tripStatus === 'Completed';
      if (activeFilter === 'VIP Customers') return c.customerInfo.isVIP;

      return true;
    });
  }, [conversations, searchTerm, activeFilter]);

  // Selected active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConvId) || conversations[0];
  }, [conversations, selectedConvId]);

  // Active messages list
  const activeMessages = useMemo(() => {
    if (!activeConversation) return [];
    return messages[activeConversation.id] || [];
  }, [messages, activeConversation]);

  // Auto-scroll to bottom of chat when activeMessages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, selectedConvId]);

  // Select conversation handler
  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setIsMobileChatOpen(true);
    // Clear unread count for selected conversation
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Send Message Handler
  const handleSendMessage = (text: string, type: 'text' | 'image' | 'pdf' = 'text', attachmentUrl?: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: activeConversation.id,
      sender: 'agency',
      text,
      timestampText: 'Just now',
      status: 'sent',
      type,
      attachment: attachmentUrl
        ? {
            type: type as 'image' | 'pdf',
            url: attachmentUrl,
            fileName: type === 'pdf' ? 'Attachment.pdf' : undefined,
          }
        : undefined,
    };

    // Add message
    setMessages((prev) => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMsg],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: 'Just now',
            }
          : c
      )
    );
  };

  // Add Private Note Handler
  const handleAddPrivateNote = (noteText: string) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c;
        return {
          ...c,
          customerInfo: {
            ...c.customerInfo,
            privateNotes: [noteText, ...c.customerInfo.privateNotes],
          },
        };
      })
    );
  };

  return (
    <div className="h-screen max-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row overflow-hidden">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        <DashboardHeader />

        {/* ── SPLIT LAYOUT FIXED HEIGHT VIEWPORT ── */}
        <div className="flex-1 flex min-w-0 overflow-hidden pb-16 md:pb-0 h-[calc(100vh-3.5rem)]">

          {/* LEFT COLUMN: Conversation List */}
          <div className={`${isMobileChatOpen ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 bg-white border-r border-slate-100 shrink-0 h-full overflow-hidden`}>
            <InboxHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
              <ConversationList
                conversations={filteredConversations}
                selectedId={activeConversation?.id || null}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          </div>

          {/* MIDDLE COLUMN: Chat Window (Full height flex column with pinned MessageInput at bottom) */}
          {activeConversation ? (
            <div className={`${isMobileChatOpen ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#FBFBFE] border-r border-slate-100 min-w-0 h-full overflow-hidden`}>
              {/* Chat Header (Fixed at top of chat area) */}
              <div className="shrink-0">
                <ChatHeader
                  conversation={activeConversation}
                  onBackMobile={() => setIsMobileChatOpen(false)}
                  onToggleInfoPanel={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
                  isInfoPanelOpen={isInfoPanelOpen}
                />
              </div>

              {/* Chat Message Scrollable Area (Flex grow & scrolls independently) */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-2">
                {activeMessages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input & Quick Action Templates (Fixed at bottom of chat area) */}
              <div className="shrink-0">
                <MessageInput onSendMessage={handleSendMessage} />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-slate-50 text-center">
              <div className="space-y-2">
                <MessageSquare className="w-10 h-10 text-[#583BE8] mx-auto" />
                <p className="text-sm font-extrabold text-[#0F172A]">Select a conversation to start chatting</p>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: Collapsible Customer Info Panel */}
          <AnimatePresence>
            {isInfoPanelOpen && activeConversation && (
              <div className="hidden lg:block h-full overflow-y-auto shrink-0">
                <CustomerInfoCard
                  info={activeConversation.customerInfo}
                  onClose={() => setIsInfoPanelOpen(false)}
                  onAddNote={handleAddPrivateNote}
                />
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AgencyCustomerInboxPage;
