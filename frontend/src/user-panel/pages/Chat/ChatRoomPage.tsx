import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  MoreVertical,
  Paperclip,
  Send,
  ExternalLink,
  FileText,
  Phone,
  Sparkles,
  Check,
  CheckCheck,
} from 'lucide-react';
import { getChatById, sendMessage, markChatRead, ChatConversation, ChatMessage } from '../../data/chats';

export const ChatRoomPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const chatData = getChatById(chatId || 'chat-001') || getChatById('chat-001')!;

  const [chat, setChat] = useState<ChatConversation>(chatData);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markChatRead(chat.id);
  }, [chat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sendMessage(chat.id, text.trim());
    setChat({ ...getChatById(chat.id)! });
    setInputText('');
  };

  const quickReplies = [
    'Thank You! 🙏',
    'Where is the pickup point?',
    'Can you share the itinerary?',
    'Need Help 🚨',
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div
              onClick={() => navigate(`/agencies/${chat.agencyId}`)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="relative shrink-0">
                <img
                  src={chat.agencyLogo}
                  alt={chat.agencyName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 bg-slate-100"
                />
                {chat.isOnline && (
                  <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-black text-[#0F172A] tracking-tight">{chat.agencyName}</h2>
                  {chat.isVerified && <CheckCircle2 className="w-4 h-4 text-[#583BE8] fill-[#583BE8]/10 shrink-0" />}
                </div>
                <p className="text-[11px] font-semibold text-emerald-600">
                  {chat.isOnline ? 'Online now' : 'Active today'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.location.href = 'tel:+919876543210';
              }}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-all cursor-pointer"
              title="Call Agency"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                handleSend('📍 Shared Location: Shillong, Meghalaya (25.5788° N, 91.8933° E)');
              }}
              className="w-9 h-9 rounded-full bg-purple-50 text-[#583BE8] hover:bg-purple-100 flex items-center justify-center transition-all cursor-pointer"
              title="Share Location"
            >
              📍
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-4 pb-36">
        {/* Pinned Booking Context Card */}
        {chat.bookingId && (
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

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate(`/trips/${chat.tripId || 'trip-001'}`)}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Trip</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => navigate(`/trips/${chat.tripId || 'trip-001'}/documents`)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Documents</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = 'tel:+919876543210';
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Call Agency"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleSend(`📎 Attached File: ${file.name} (${Math.round(file.size / 1024)} KB)`);
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
