import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Sparkles, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';

import { InboxHeader } from '../../components/inbox/InboxHeader';
import { ConversationList } from '../../components/inbox/ConversationList';
import { ChatHeader } from '../../components/inbox/ChatHeader';
import { ChatBubble } from '../../components/inbox/ChatBubble';
import { MessageInput } from '../../components/inbox/MessageInput';
import { CustomerInfoCard } from '../../components/inbox/CustomerInfoCard';

import { agencyChatService } from '../../services/agencyChat.service';
import { agencySocketService } from '../../services/agencySocket.service';
import { Conversation, ChatMessage, ConversationFilter } from '../../types/inbox';

/**
 * Agency Customer Inbox & DM Center Page
 * Route: /agency/messages (Protected: APPROVED agencies only)
 *
 * Fully Live MongoDB & Real-Time Socket.IO Production Architecture:
 * - Session/JWT scoped multi-tenant isolation
 * - Live MongoDB Conversation, Message, Customer, Booking, and Staff Note records
 * - Real-time Socket.IO room events, typing indicators, and presence detection
 */
export const AgencyCustomerInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Core Data State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);

  // Selected conversation ID state
  const paramConvId = searchParams.get('conversationId');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(paramConvId);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('All');

  // Loading & Error States
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Typing state
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);

  // 1. Fetch Conversations from Backend
  const loadConversations = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoadingConversations(true);
        setErrorMessage(null);

        const data = await agencyChatService.getConversations(
          activeFilter,
          searchTerm.trim() || undefined
        );

        setConversations(data.conversations);
        setTotalUnreadCount(data.unreadCount);

        // Auto-select initial conversation if none is selected
        if (!selectedConvId && data.conversations.length > 0) {
          setSelectedConvId(data.conversations[0].id);
        } else if (selectedConvId && !data.conversations.some((c) => c.id === selectedConvId)) {
          // If selected conversation not in filtered list, fall back to first if available
          if (data.conversations.length > 0) {
            setSelectedConvId(data.conversations[0].id);
          }
        }
      } catch (err: any) {
        console.error('Failed to load agency conversations:', err);
        setErrorMessage(err.message || 'Unable to load conversations. Please check your connection.');
      } finally {
        if (showLoading) setIsLoadingConversations(false);
      }
    },
    [activeFilter, searchTerm, selectedConvId]
  );

  // Load conversations on mount & filter/search change
  useEffect(() => {
    loadConversations(true);
  }, [activeFilter, searchTerm]);

  // Selected active conversation object
  const activeConversation = useMemo(() => {
    if (!selectedConvId) return conversations[0] || null;
    return conversations.find((c) => c.id === selectedConvId) || conversations[0] || null;
  }, [conversations, selectedConvId]);

  // 2. Fetch Messages for Selected Conversation
  const loadMessages = useCallback(async (convId: string) => {
    try {
      setIsLoadingMessages(true);
      const data = await agencyChatService.getMessages(convId, 1, 50);
      setActiveMessages(data.messages);

      // Mark as read on backend
      agencyChatService.markAsRead(convId).catch(console.warn);

      // Clear local unread badge for this conversation
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err: any) {
      console.error('Failed to load messages for conversation:', err);
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

  // Auto-scroll to bottom of chat when activeMessages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, selectedConvId]);

  // 3. Real-Time Socket.IO Subscriptions
  useEffect(() => {
    const socket = agencySocketService.connect();

    // Listen for new messages
    const cleanupMsg = agencySocketService.onNewMessage((newMsg: ChatMessage) => {
      // If message is for currently active conversation
      if (activeConversation && newMsg.conversationId === activeConversation.id) {
        setActiveMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        // Auto mark as read
        agencyChatService.markAsRead(activeConversation.id).catch(console.warn);
      }

      // Update conversation list preview & unread counts
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === newMsg.conversationId) {
            const isCurrentlyOpen = activeConversation && activeConversation.id === c.id;
            return {
              ...c,
              lastMessage: newMsg.text || (newMsg.type === 'pdf' ? 'PDF Document' : 'Photo attachment'),
              lastMessageTime: newMsg.timestampText || 'Just now',
              unreadCount: isCurrentlyOpen ? 0 : c.unreadCount + (newMsg.sender === 'customer' ? 1 : 0),
            };
          }
          return c;
        })
      );
    });

    // Listen for read receipts
    const cleanupRead = agencySocketService.onMessageRead(({ conversationId }) => {
      if (activeConversation && activeConversation.id === conversationId) {
        setActiveMessages((prev) =>
          prev.map((m) => (m.sender === 'agency' ? { ...m, status: 'read' } : m))
        );
      }
    });

    // Listen for presence (online / offline)
    const cleanupPresence = agencySocketService.onCustomerPresence(
      ({ customerId }) => {
        setConversations((prev) =>
          prev.map((c) => (c.customerId === customerId ? { ...c, isOnline: true } : c))
        );
      },
      ({ customerId }) => {
        setConversations((prev) =>
          prev.map((c) => (c.customerId === customerId ? { ...c, isOnline: false } : c))
        );
      }
    );

    // Listen for typing indicators
    const cleanupTyping = agencySocketService.onTyping(({ conversationId, senderType }) => {
      if (activeConversation && activeConversation.id === conversationId && senderType === 'customer') {
        setIsCustomerTyping(true);
      }
    });

    const cleanupStopTyping = agencySocketService.onStopTyping(({ conversationId }) => {
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

  // Join/Leave Socket Room when active conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      agencySocketService.joinConversation(activeConversation.id);
    }
    return () => {
      if (activeConversation?.id) {
        agencySocketService.leaveConversation(activeConversation.id);
      }
    };
  }, [activeConversation?.id]);

  // Select conversation handler
  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setIsMobileChatOpen(true);
  };

  // Send Message Handler (Live Backend API + Optimistic UI + Socket)
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
        ? [
            {
              secureUrl: attachmentUrl,
              fileName: attachmentMeta?.fileName,
              fileSize: attachmentMeta?.fileSize,
              publicId: attachmentMeta?.publicId,
              fileType: type as 'image' | 'pdf' | 'document',
            },
          ]
        : undefined;

      const sent = await agencyChatService.sendMessage(activeConversation.id, {
        text,
        messageType: type,
        attachments,
      });

      // Update active messages
      setActiveMessages((prev) => {
        if (prev.some((m) => m.id === sent.id)) return prev;
        return [...prev, sent];
      });

      // Update conversation in list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                lastMessage: text || (type === 'pdf' ? 'PDF Attachment' : 'Image Attachment'),
                lastMessageTime: 'Just now',
              }
            : c
        )
      );
    } catch (err: any) {
      console.error('Failed to send message:', err);
      alert(`Failed to send message: ${err.message || 'Please try again'}`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Upload File Handler
  const handleUploadFile = async (file: File) => {
    return agencyChatService.uploadAttachment(file);
  };

  // Add Private Note Handler (Live MongoDB Persistence)
  const handleAddPrivateNote = async (noteText: string) => {
    if (!activeConversation || !activeConversation.customerId) return;

    try {
      const savedNote = await agencyChatService.createPrivateNote(
        activeConversation.customerId,
        noteText,
        activeConversation.customerInfo.bookingId !== 'BK-DIRECT'
          ? activeConversation.customerInfo.bookingId
          : undefined
      );

      // Append to active conversation customer info
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversation.id) return c;
          return {
            ...c,
            customerInfo: {
              ...c.customerInfo,
              privateNotes: [savedNote.note, ...c.customerInfo.privateNotes],
            },
          };
        })
      );
    } catch (err: any) {
      console.error('Failed to save staff private note:', err);
      alert(`Failed to save private note: ${err.message || 'Please try again'}`);
    }
  };

  // Emit typing indicator
  const handleTyping = () => {
    if (activeConversation?.id) {
      agencySocketService.emitTyping(activeConversation.id, 'Agency Staff');
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row overflow-hidden">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        <DashboardHeader unreadCount={totalUnreadCount} />

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
              {isLoadingConversations ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
                  <Loader2 className="w-6 h-6 text-[#583BE8] animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Loading live conversations...</p>
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
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedId={activeConversation?.id || null}
                  onSelectConversation={handleSelectConversation}
                />
              )}
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
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full py-12">
                    <Loader2 className="w-6 h-6 text-[#583BE8] animate-spin" />
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-2">
                    <MessageSquare className="w-8 h-8 text-purple-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">No messages in this conversation yet</p>
                    <p className="text-[11px] font-medium text-slate-400">Send a greeting or share an itinerary to start chatting.</p>
                  </div>
                ) : (
                  activeMessages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))
                )}

                {/* Customer Typing Indicator */}
                {isCustomerTyping && (
                  <div className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold text-slate-400 animate-pulse">
                    <span>{activeConversation.customerName} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input & Quick Action Templates (Fixed at bottom of chat area) */}
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
