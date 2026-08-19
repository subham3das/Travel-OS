import React, { useState } from 'react';
import {
  MoreVertical,
  X,
  ChevronDown,
  Lock,
  Smile,
  Image,
  Paperclip,
  Code,
  FileText,
  Link,
  Send,
  CheckCheck,
  User,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import {
  SupportTicketItem,
  SupportTicketStatus,
  SupportMessageSenderType,
} from '../../../types/supportManagement';

interface SupportConversationWorkspaceProps {
  ticket: SupportTicketItem;
  onStatusChange: (status: SupportTicketStatus) => void;
  onSendMessage: (text: string, senderType: SupportMessageSenderType) => void;
  onClose?: () => void;
}

export const SupportConversationWorkspace: React.FC<SupportConversationWorkspaceProps> = ({
  ticket,
  onStatusChange,
  onSendMessage,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'Conversation' | 'Customer Info' | 'Ticket Info' | 'Activity' | 'History'>('Conversation');
  const [composerMode, setComposerMode] = useState<'reply' | 'internal_note'>('reply');
  const [inputText, setInputText] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const statusOptions: SupportTicketStatus[] = ['Open', 'Assigned', 'Pending', 'Escalated', 'Closed'];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(
      inputText,
      composerMode === 'internal_note' ? 'internal_note' : 'agent'
    );
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3">
      {/* ── 1. TOP HEADER ── */}
      <div className="space-y-2 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          {/* Ticket ID & Priority */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-black text-[#0F172A] font-mono">
              Ticket {ticket.id}
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">
              {ticket.priority} Priority
            </span>
          </div>

          {/* Status Dropdown & Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
              >
                <span>{ticket.status}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs font-bold text-slate-700">
                  {statusOptions.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onStatusChange(st);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 hover:text-[#6356E5]"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="w-7 h-7 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Subject & Meta */}
        <div>
          <h2 className="text-sm font-black text-slate-900 leading-snug">
            {ticket.subject}
          </h2>
          <p className="text-[10px] font-medium text-slate-400 mt-0.5">
            Created: {ticket.createdAt} • via {ticket.channel}
          </p>
        </div>

        {/* Workspace Tabs */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 pt-1 border-t border-slate-50 overflow-x-auto scrollbar-none">
          {(['Conversation', 'Customer Info', 'Ticket Info', 'Activity', 'History'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#6356E5] border-[#6356E5] font-black'
                    : 'border-transparent hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. TAB CONTENT BODY ── */}
      <div className="flex-1 overflow-y-auto max-h-[460px] pr-1 space-y-3.5 scrollbar-thin">
        {activeTab === 'Conversation' && (
          <div className="space-y-3.5">
            {ticket.messages.map((msg) => {
              if (msg.senderType === 'internal_note') {
                return (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1 my-2"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-800">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>Internal Note by {msg.senderName} ({msg.timestamp})</span>
                    </div>
                    <p className="text-slate-800 font-medium leading-relaxed pl-4">
                      {msg.text}
                    </p>
                  </div>
                );
              }

              const isAgent = msg.senderType === 'agent';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isAgent ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <img
                    src={
                      msg.senderAvatar ||
                      (isAgent
                        ? ticket.assignedAgent?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150'
                        : ticket.customer.avatar)
                    }
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                  />

                  <div
                    className={`max-w-[82%] space-y-1 ${
                      isAgent ? 'items-end text-right' : 'items-start text-left'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400">
                      <span className="text-slate-800">{msg.senderName}</span>
                      {msg.senderRole && (
                        <span className="text-[#6356E5] font-semibold">({msg.senderRole})</span>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isAgent
                          ? 'bg-purple-50 text-slate-900 border border-purple-100 rounded-tr-xs'
                          : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[9px] font-mono text-slate-400 ${
                        isAgent ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isAgent && <CheckCheck className="w-3 h-3 text-[#6356E5]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'Customer Info' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={ticket.customer.avatar}
                alt={ticket.customer.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span>{ticket.customer.name}</span>
                  {ticket.customer.verified && (
                    <ShieldCheck className="w-4 h-4 text-[#6356E5]" />
                  )}
                </h4>
                <p className="text-slate-400 font-semibold text-[11px]">
                  {ticket.customer.userType} • Member since {ticket.customer.memberSince}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{ticket.customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{ticket.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{ticket.customer.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
              <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Total Bookings</span>
                <span className="text-base font-black font-mono text-slate-900">{ticket.customer.totalBookings}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Support Tickets</span>
                <span className="text-base font-black font-mono text-[#6356E5]">{ticket.customer.totalTickets}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Ticket Info' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/80">
              <span className="text-slate-400 font-bold">Ticket ID:</span>
              <span className="font-mono font-black text-slate-900">{ticket.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/80">
              <span className="text-slate-400 font-bold">Category:</span>
              <span className="font-black text-slate-800">{ticket.category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/80">
              <span className="text-slate-400 font-bold">Booking Reference:</span>
              <span className="font-mono font-black text-[#6356E5]">{ticket.bookingId || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/80">
              <span className="text-slate-400 font-bold">Assigned Agent:</span>
              <span className="font-bold text-slate-800">{ticket.assignedAgent?.name || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-bold">Channel:</span>
              <span className="font-bold text-slate-800">{ticket.channel}</span>
            </div>
          </div>
        )}

        {activeTab === 'Activity' && (
          <div className="space-y-2 text-xs">
            {(ticket.activityLog || []).map((act) => (
              <div key={act.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{act.action}</p>
                  <p className="text-[10px] text-slate-400 font-medium">By {act.actor}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{act.time}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'History' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
            <p className="font-bold text-slate-700">Previous Interactions:</p>
            <div className="p-2 rounded-xl bg-white border border-slate-100 space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>#TKT-90124</span>
                <span>May 18, 2024</span>
              </div>
              <p className="font-bold text-slate-800">Flight rescheduling query - Resolved</p>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. REPLY COMPOSER ── */}
      <form onSubmit={handleSend} className="pt-2 border-t border-slate-100 space-y-2 shrink-0">
        {/* Toggle Mode */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setComposerMode('reply')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              composerMode === 'reply'
                ? 'bg-purple-100 text-[#6356E5]'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Reply
          </button>
          <button
            type="button"
            onClick={() => setComposerMode('internal_note')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              composerMode === 'internal_note'
                ? 'bg-amber-100 text-amber-800'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Internal Note</span>
          </button>
        </div>

        {/* Input Box */}
        <div className="relative rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-[#6356E5] focus-within:bg-white transition-all overflow-hidden shadow-2xs">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              composerMode === 'internal_note'
                ? 'Write private note for staff...'
                : 'Type your reply here...'
            }
            rows={3}
            className="w-full p-3 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none resize-none"
          />

          {/* Action Toolbar */}
          <div className="flex items-center justify-between p-2 bg-slate-100/70 border-t border-slate-200/80">
            <div className="flex items-center gap-1 text-slate-400">
              <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
                <Smile className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
                <Image className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
                <Code className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
                <FileText className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
                <Link className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Send Reply (Primary Purple CTA) */}
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
            >
              <span>{composerMode === 'internal_note' ? 'Save Note' : 'Send Reply'}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
