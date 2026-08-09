import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, FileText, Download, Image as ImageIcon } from 'lucide-react';
import { ChatMessage, MessageStatus } from '../../data/inbox';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAgency = message.sender === 'agency';

  const renderStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-sky-300" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-slate-300" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-slate-300" />;
      case 'sending':
      default:
        return <span className="text-[9px] text-slate-300 animate-pulse">...</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex flex-col ${isAgency ? 'items-end' : 'items-start'} my-2 select-none`}
    >
      <div
        className={`max-w-[85%] sm:max-w-md p-3.5 sm:p-4 rounded-3xl space-y-2 shadow-2xs ${
          isAgency
            ? 'bg-[#583BE8] text-white rounded-br-none'
            : 'bg-white border border-slate-100 text-[#0F172A] rounded-bl-none'
        }`}
      >
        {/* PDF Attachment */}
        {message.type === 'pdf' && message.attachment && (
          <div
            className={`p-3 rounded-2xl flex items-center justify-between gap-3 text-xs border ${
              isAgency ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className={`w-5 h-5 shrink-0 ${isAgency ? 'text-amber-300' : 'text-[#583BE8]'}`} />
              <div className="min-w-0">
                <p className="font-extrabold truncate">{message.attachment.fileName}</p>
                <span className="text-[10px] opacity-80">{message.attachment.fileSize}</span>
              </div>
            </div>
            <a
              href={message.attachment.url}
              target="_blank"
              rel="noreferrer"
              className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                isAgency ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Image Attachment */}
        {message.type === 'image' && message.attachment && (
          <div className="rounded-2xl overflow-hidden border border-white/20 max-w-xs">
            <img src={message.attachment.url} alt="Attachment" className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Message Text */}
        <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>

        {/* Message Timestamp & Status */}
        <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isAgency ? 'text-purple-200 justify-end' : 'text-slate-400'}`}>
          <span>{message.timestampText}</span>
          {isAgency && renderStatusIcon(message.status)}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
