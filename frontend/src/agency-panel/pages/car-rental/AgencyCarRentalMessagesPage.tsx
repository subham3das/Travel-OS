import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, AlertCircle, RefreshCw, Loader2, Car } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { InboxHeader } from '../../components/inbox/InboxHeader';
import { ConversationList } from '../../components/inbox/ConversationList';
import { ChatHeader } from '../../components/inbox/ChatHeader';
import { ChatBubble } from '../../components/inbox/ChatBubble';
import { MessageInput } from '../../components/inbox/MessageInput';
import { CarRentalCustomerInfoCard } from '../../components/car-rental/CarRentalCustomerInfoCard';

import { carRentalChatService } from '../../services/carRentalChat.service';
import { carRentalSocketService } from '../../services/carRentalSocket.service';
import { Conversation, ChatMessage, ConversationFilter } from '../../types/inbox';

/**
 * Car Rental Messages & Inbox Page
 * Route: /agency/car-rental/messages (Protected: APPROVED Car Rental providers only)
 *
 * Independent from Agency Messages — queries only Car Rental conversations.
 * Real-time via carRentalSocket.service (separate socket instance).
 * Socket rooms: conversation_<id> (same room system, but different data source)
 */
export const AgencyCarRentalMessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Core state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const paramConvId = searchParams.get('conversationId');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(paramConvId);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('All');

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);

  // 1. Load conversations from Car Rental API
  const loadConversations = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoadingConversations(true);
        setErrorMessage(null);

        const data = await carRentalChatService.getConversations(
          activeFilter,
          searchTerm.trim() || undefined
        );

        setConversations(data.conversations);
        setTotalUnreadCount(data.unreadCount);

        if (!selectedConvId && data.conversations.length > 0) {
          setSelectedConvId(data.conversations[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load Car Rental conversations:', err);
        setErrorMessage(err.message || 'Unable to load conversations. Please check your connection.');
      } finally {
        if (showLoading) setIsLoadingConversations(false);
      }
    },
    [activeFilter, searchTerm, selectedConvId]
  );

  useEffect(() => {
    loadConversations(true);
  }, [activeFilter, searchTerm]);

  const activeConversation = useMemo(() => {
    if (!selectedConvId) return conversations[0] || null;
    return conversations.find((c) => c.id === selectedConvId) || conversations[0] || null;
  }, [conversations, selectedConvId]);

  // 2. Load messages for selected conversation
  const loadMessages = useCallback(async (convId: string) => {
    try {
      setIsLoadingMessages(true);
      const data = await carRentalChatService.getMessages(convId, 1, 50);
      setActiveMessages(data.messages);

      carRentalChatService.markAsRead(convId).catch(console.warn);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err: any) {
      console.error('Failed to load Car Rental messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id);
    } else {
      setActiveMessages([]);
    }
  }, [activeConversation?.id, loadMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, selectedConvId]);

  // 3. Real-time Socket.IO — Car Rental socket service
  useEffect(() => {
    carRentalSocketService.connect();

    const cleanupMsg = carRentalSocketService.onNewMessage((newMsg: ChatMessage) => {
      if (activeConversation && newMsg.conversationId === activeConversation.id) {
        setActiveMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        carRentalChatService.markAsRead(activeConversation.id).catch(console.warn);
      }
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === newMsg.conversationId) {
            const isCurrentlyOpen = activeConversation && activeConversation.id === c.id;
            return {
              ...c,
              lastMessage: newMsg.text || 'Attachment',
              lastMessageTime: newMsg.timestampText || 'Just now',
              unreadCount: isCurrentlyOpen ? 0 : c.unreadCount + (newMsg.sender === 'customer' ? 1 : 0),
            };
          }
          return c;
        })
      );
    });

    const cleanupRead = carRentalSocketService.onMessageRead(({ conversationId }) => {
      if (activeConversation && activeConversation.id === conversationId) {
        setActiveMessages((prev) =>
          prev.map((m) => (m.sender === 'agency' ? { ...m, status: 'read' } : m))
        );
      }
    });

    const cleanupPresence = carRentalSocketService.onCustomerPresence(
      ({ customerId }) => setConversations((prev) => prev.map((c) => (c.customerId === customerId ? { ...c, isOnline: true } : c))),
      ({ customerId }) => setConversations((prev) => prev.map((c) => (c.customerId === customerId ? { ...c, isOnline: false } : c)))
    );

    const cleanupTyping = carRentalSocketService.onTyping(({ conversationId, senderType }) => {
      if (activeConversation && activeConversation.id === conversationId && senderType === 'customer') {
        setIsCustomerTyping(true);
      }
    });

    const cleanupStopTyping = carRentalSocketService.onStopTyping(({ conversationId }) => {
      if (activeConversation && activeConversation.id === conversationId) {
        setIsCustomerTyping(false);
      }
    });

    return () => {
      cleanupMsg();
      cleanupRead();
      cleanupPresence();
      cleanupTyping();
      cleanupStopTyping();
    };
  }, [activeConversation]);

  useEffect(() => {
    if (activeConversation?.id) {
      carRentalSocketService.joinConversation(activeConversation.id);
    }
    return () => {
      if (activeConversation?.id) {
        carRentalSocketService.leaveConversation(activeConversation.id);
      }
    };
  }, [activeConversation?.id]);

  // Handlers
  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setIsMobileChatOpen(true);
  };

  const handleSendMessage = async (
    text: string,
    type: 'text' | 'image' | 'pdf' | 'document' = 'text',
    attachmentUrl?: string,
    attachmentMeta?: { fileName?: string; fileSize?: string; publicId?: string }
  ) => {
    if (!activeConversation) return;
    try {
      setIsSendingMessage(true);
      const attachments = attachmentUrl
        ? [{ secureUrl: attachmentUrl, fileName: attachmentMeta?.fileName, fileSize: attachmentMeta?.fileSize, publicId: attachmentMeta?.publicId, fileType: type as 'image' | 'pdf' | 'document' }]
        : undefined;

      const sent = await carRentalChatService.sendMessage(activeConversation.id, { text, messageType: type, attachments });

      setActiveMessages((prev) => {
        if (prev.some((m) => m.id === sent.id)) return prev;
        return [...prev, sent];
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, lastMessage: text || 'Attachment', lastMessageTime: 'Just now' }
            : c
        )
      );
    } catch (err: any) {
      alert(`Failed to send message: ${err.message || 'Please try again'}`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleUploadFile = async (file: File) => carRentalChatService.uploadAttachment(file);

  const handleAddPrivateNote = async (noteText: string) => {
    // Car Rental does not use travel package private notes — no-op or future extension
    console.log('[Car Rental] Private note (future):', noteText);
  };

  const handleTyping = () => {
    if (activeConversation?.id) {
      carRentalSocketService.emitTyping(activeConversation.id, 'Car Rental Provider');
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row overflow-hidden">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        <DashboardHeader unreadCount={totalUnreadCount} />

        <div className="flex-1 flex min-w-0 overflow-hidden pb-16 md:pb-0 h-[calc(100vh-3.5rem)]">

          {/* LEFT: Conversation List */}
          <div className={`${isMobileChatOpen ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 bg-white border-r border-slate-100 shrink-0 h-full overflow-hidden`}>
            {/* Context badge */}
            <div className="px-4 pt-3 pb-0">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-xl mb-2">
                <Car className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest">Car Rental Messages</span>
              </div>
            </div>

            <InboxHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
              {isLoadingConversations ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
                  <Loader2 className="w-6 h-6 text-sky-500 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Loading vehicle booking conversations...</p>
                </div>
              ) : errorMessage ? (
                <div className="p-6 text-center bg-rose-50/50 rounded-3xl border border-rose-100 space-y-3">
                  <AlertCircle className="w-7 h-7 text-rose-500 mx-auto" />
                  <p className="text-xs font-bold text-rose-700">{errorMessage}</p>
                  <button
                    onClick={() => loadConversations(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-extrabold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <Car className="w-10 h-10 text-sky-200 mx-auto" />
                  <p className="text-sm font-bold text-slate-500">No vehicle booking conversations yet</p>
                  <p className="text-xs text-slate-400">When customers contact you about vehicle bookings, conversations will appear here.</p>
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedId={activeConversation?.id || null}
                  onSelectConversation={handleSelectConversation}
                />
              )}
            </div>
          </div>

          {/* MIDDLE: Chat Window */}
          {activeConversation ? (
            <div className={`${isMobileChatOpen ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#FBFBFE] border-r border-slate-100 min-w-0 h-full overflow-hidden`}>
              <div className="shrink-0">
                <ChatHeader
                  conversation={activeConversation}
                  onBackMobile={() => setIsMobileChatOpen(false)}
                  onToggleInfoPanel={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
                  isInfoPanelOpen={isInfoPanelOpen}
                />
              </div>

              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-2">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full py-12">
                    <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-2">
                    <MessageSquare className="w-8 h-8 text-sky-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">No messages in this conversation yet</p>
                    <p className="text-[11px] font-medium text-slate-400">Send a greeting to start the vehicle booking conversation.</p>
                  </div>
                ) : (
                  activeMessages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
                )}

                {isCustomerTyping && (
                  <div className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold text-slate-400 animate-pulse">
                    <span>{activeConversation.customerName} is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onUploadFile={handleUploadFile}
                  onTyping={handleTyping}
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-slate-50 text-center">
              <div className="space-y-2">
                <Car className="w-10 h-10 text-sky-500 mx-auto" />
                <p className="text-sm font-extrabold text-[#0F172A]">Select a conversation</p>
                <p className="text-xs text-slate-400">Vehicle booking customer conversations will appear here</p>
              </div>
            </div>
          )}

          {/* RIGHT: Customer Info Panel */}
          <AnimatePresence>
            {isInfoPanelOpen && activeConversation && (
              <div className="hidden lg:block h-full overflow-y-auto shrink-0">
                <CarRentalCustomerInfoCard
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

export default AgencyCarRentalMessagesPage;
