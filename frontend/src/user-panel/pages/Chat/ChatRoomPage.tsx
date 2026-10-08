import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Paperclip,
  Send,
  ExternalLink,
  Phone,
  Sparkles,
  Check,
  CheckCheck,
  Car,
  MapPin,
  Calendar,
  User,
  MessageSquareOff,
} from 'lucide-react';
import { ChatConversation, ChatMessage, AgencyContactInfo } from '../../data/chats';
import { customerChatService } from '../../services/customerChat.service';
import { userSocketService } from '../../services/userSocket.service';
import { cloudinaryUploadService } from '../../../services/cloudinaryUpload.service';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const ChatRoomPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const [chat, setChat] = useState<ChatConversation | null>(null);
  const [contactInfo, setContactInfo] = useState<AgencyContactInfo | null>(null);
  const [loading, setLoading] = useState(Boolean(chatId));
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    if (!chatId) {
      setLoading(false);
      return;
    }

    customerChatService.getConversationById(chatId).then((liveConv) => {
      if (isMounted && liveConv) {
        setChat(liveConv);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    // Fetch registered contact details for communication (Call & WhatsApp) from MongoDB
    customerChatService.getAgencyContact(chatId).then((contact) => {
      if (isMounted && contact) {
        setContactInfo(contact);
      }
    });

    userSocketService.joinConversation(chatId);

    const unsubscribe = userSocketService.subscribe('message:new', (data: any) => {
      if (!isMounted) return;
      if (data.conversationId === chatId && data.message) {
        setChat((prev) => {
          if (!prev) return prev;
          const exists = prev.messages.some((m) => m.id === data.message.id);
          if (exists) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message],
            lastMessage: data.message.text,
          };
        });
      }
    });

    return () => {
      isMounted = false;
      userSocketService.leaveConversation(chatId);
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSend = async (textToSend?: string) => {
    if (!chat) return;
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setInputText('');
    try {
      const sentMsg = await customerChatService.sendMessage(chat.id, text.trim());
      setChat((prev) => {
        if (!prev) return prev;
        const exists = prev.messages.some((m) => m.id === sentMsg.id);
        if (exists) return prev;
        return {
          ...prev,
          messages: [...prev.messages, sentMsg],
          lastMessage: sentMsg.text,
        };
      });
    } catch {
      console.warn('Failed to send message: network offline');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-9 h-9 border-3 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-500">Loading conversation...</p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
          <MessageSquareOff className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#0F172A]">Conversation Not Found</h2>
        <p className="text-xs font-semibold text-slate-500 max-w-sm">
          This conversation could not be loaded or the chat server is unavailable.
        </p>
        <button onClick={() => navigate('/chat')} className="px-5 py-2.5 rounded-xl bg-[#6356E5] text-white text-xs font-bold cursor-pointer">
          Back to Messages
        </button>
      </div>
    );
  }

  // Real MongoDB registered numbers (never hardcoded, no mock data)
  const registeredPhone = contactInfo?.phoneNumber || chat.vehicleBooking?.providerPhone || chat.hostPhone || null;
  const rawWhatsApp = contactInfo?.whatsappNumber || chat.whatsappNumber || null;
  const cleanWhatsAppNumber = rawWhatsApp ? rawWhatsApp.replace(/[^\d]/g, '') : null;

  // Real-time online socket status
  const isOnline = contactInfo?.onlineStatus
    ? contactInfo.onlineStatus === 'online'
    : (contactInfo?.isOnline ?? chat.isOnline);

  const lastSeenIso = contactInfo?.lastSeen || chat.lastSeen || null;
  const lastSeenFormatted = lastSeenIso ? (() => {
    try {
      const d = new Date(lastSeenIso);
      return isNaN(d.getTime()) ? null : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  })() : null;

  // Pre-filled support message with dynamic booking ID
  const activeBookingId = contactInfo?.bookingId || chat.bookingId || chat.vehicleBooking?.bookingId;
  let dynamicSupportMessage = contactInfo?.supportMessage;
  if (!dynamicSupportMessage) {
    if (activeBookingId) {
      dynamicSupportMessage = `Hello, I have a question regarding my booking ${activeBookingId}.`;
    } else {
      dynamicSupportMessage = 'Hello, I have a question regarding my travel booking.';
    }
  }

  const whatsappHref = cleanWhatsAppNumber
    ? `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(dynamicSupportMessage)}`
    : null;

  const quickReplies = chat.conversationType === 'CAR_RENTAL' || chat.vehicleBooking
    ? [
        'Confirmed pickup location! 📍',
        'What is driver contact? 📞',
        'When will car arrive? 🚗',
        'Need assistance 🚨',
      ]
    : [
        'Thank You! 🙏',
        'Where is the pickup point?',
        'Can you share the itinerary?',
        'Need Help 🚨',
      ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Header: Focused ONLY on communication actions (Back, Agency Info + Online Status, Call, WhatsApp) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Back & Agency Profile */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Back to messages"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div
              onClick={() => navigate(chat.conversationType === 'CAR_RENTAL' ? '/car-rental' : `/agencies/${contactInfo?.agencyId || chat.agencyId}`)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity min-w-0"
            >
              <div className="relative shrink-0">
                <img
                  src={contactInfo?.agencyLogo || chat.agencyLogo}
                  alt={contactInfo?.agencyName || chat.agencyName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 bg-slate-100"
                />
                {isOnline && (
                  <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-black text-[#0F172A] tracking-tight truncate max-w-[130px] sm:max-w-[220px]">
                    {contactInfo?.agencyName || chat.agencyName}
                  </h2>
                  {(contactInfo?.isVerified ?? chat.isVerified) && (
                    <CheckCircle2 className="w-4 h-4 text-[#583BE8] fill-[#583BE8]/10 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <p className={`text-[11px] font-semibold truncate ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isOnline
                      ? 'Online'
                      : lastSeenFormatted
                      ? `Offline • Last seen ${lastSeenFormatted}`
                      : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Only Communication Actions (Call & WhatsApp) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Call Agency Button — Only shown if phone exists in MongoDB */}
            {registeredPhone && (
              <a
                href={`tel:${registeredPhone.trim()}`}
                className="h-9 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Call Agency"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}

            {/* WhatsApp Button — Only shown if WhatsApp number exists in MongoDB */}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                title="Chat on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Chat Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-4 pb-36">
        {/* Pinned Context Card: Polymorphic based on conversationType */}
        {chat.conversationType === 'CAR_RENTAL' || chat.vehicleBooking ? (
          chat.vehicleBooking && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4.5 border border-sky-100 shadow-2xs space-y-3.5"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <span className="text-[11px] font-black text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-sky-500" />
                  <span>Vehicle Booking</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-[11px] font-black">
                  {chat.vehicleBooking.bookingId}
                </span>
              </div>

              {/* Vehicle Info & Thumbnail */}
              <div className="flex items-start gap-3">
                <img
                  src={chat.vehicleBooking.vehicleImage}
                  alt={chat.vehicleBooking.vehicleName}
                  className="w-20 h-16 rounded-2xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm font-black text-[#0F172A] leading-tight truncate">
                    {chat.vehicleBooking.vehicleName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 truncate">
                    Provider: {chat.vehicleBooking.rentalProvider}
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black">
                      {chat.vehicleBooking.bookingStatus}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-400">
                      Paid: <span className="text-emerald-600 font-black">₹{chat.vehicleBooking.depositPaid.toLocaleString()}</span> • Due: ₹{chat.vehicleBooking.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route & Timing Summary */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 font-semibold">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{chat.vehicleBooking.pickupLocation}</span>
                  </div>
                  <span className="text-slate-300 font-bold px-1">➔</span>
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end truncate">
                    <span className="truncate">{chat.vehicleBooking.dropLocation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-sky-500" />
                    <span>Pickup: {chat.vehicleBooking.pickupDate} ({chat.vehicleBooking.pickupTime})</span>
                  </span>
                  <span>Return: {chat.vehicleBooking.returnDate}</span>
                </div>

                {chat.vehicleBooking.driverName && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-bold flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-500" />
                      <span>Driver: {chat.vehicleBooking.driverName}</span>
                    </span>
                    {chat.vehicleBooking.driverPhone && (
                      <span className="font-semibold text-slate-400">{chat.vehicleBooking.driverPhone}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions for Car Rental */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(chat.vehicleBooking?.viewBookingRoute || `/car-bookings/${chat.vehicleBooking?.bookingId}`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>View Booking</span>
                </button>

                {chat.vehicleBooking.driverPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `tel:${chat.vehicleBooking?.driverPhone}`;
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Call Driver</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const providerPhone = chat.vehicleBooking?.providerPhone || chat.hostPhone || '+919876543210';
                    window.location.href = `tel:${providerPhone}`;
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Call Rental Provider"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )
        ) : chat.bookingId ? (
          /* Pinned Tour Package Booking Context Card */
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-[#6356E5] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Linked Booking</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-[11px] font-black">
                {chat.bookingId}
              </span>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-[#0F172A]">{chat.packageName}</h3>
              <p className="text-xs font-semibold text-slate-500">
                {chat.destinationName} • {chat.travelDates}
              </p>
            </div>

            {/* Quick Actions for Tour Package */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate(`/trips/${chat.tripId || 'trip-001'}`)}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Trip</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {registeredPhone && (
                <a
                  href={`tel:${registeredPhone.trim()}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Call Agency"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        ) : null}

        {/* Message Stream */}
        <div className="space-y-3 pt-2">
          {chat.messages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="text-center py-2">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black shadow-2xs">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isUser = msg.senderId === 'user-001';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl p-3.5 space-y-1 shadow-2xs ${
                    isUser
                      ? 'bg-[#6356E5] text-white rounded-br-xs'
                      : 'bg-white text-[#0F172A] border border-slate-100/90 rounded-bl-xs'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium leading-relaxed break-words">
                    {msg.text}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] ${
                      isUser ? 'text-purple-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Sticky Bottom Composer & Quick Replies */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-2.5">
          {/* Quick Replies Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                type="button"
                onClick={() => handleSend(qr)}
                className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-bold shrink-0 transition-colors cursor-pointer border border-purple-100"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Form Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              id="chat-file-attachment"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const uploadRes = await cloudinaryUploadService.uploadImage(file, 'travelos/chat');
                    handleSend(`📷 [Image] ${uploadRes.secureUrl}`);
                  } catch (err: any) {
                    console.error('Chat attachment upload failed:', err);
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('chat-file-attachment')?.click()}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message to the agency..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-3.5 rounded-2xl text-white font-bold transition-all cursor-pointer shadow-md shrink-0 ${
                inputText.trim()
                  ? 'bg-[#6356E5] hover:bg-[#5245d6] shadow-[#6356E5]/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
