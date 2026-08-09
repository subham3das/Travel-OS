import React, { useState } from 'react';
import { Send, Paperclip, Image as ImageIcon, FileText, Sparkles, Smile } from 'lucide-react';
import { QuickActionBar } from './QuickActionBar';

interface MessageInputProps {
  onSendMessage: (text: string, type?: 'text' | 'image' | 'pdf', attachmentUrl?: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim(), 'text');
    setText('');
  };

  const handleSelectTemplate = (templateText: string) => {
    setText(templateText);
  };

  const handleAttachImage = () => {
    onSendMessage('Photo attachment uploaded.', 'image', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600');
  };

  const handleAttachPDF = () => {
    onSendMessage('Document attachment uploaded.', 'pdf', '#');
  };

  return (
    <div className="bg-white border-t border-slate-100 select-none">
      {/* Predefined Quick Actions Row */}
      <QuickActionBar onSelectTemplate={handleSelectTemplate} />

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleAttachImage}
            className="p-2 rounded-xl text-slate-400 hover:text-[#583BE8] hover:bg-purple-50 transition-colors cursor-pointer"
            title="Attach Photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleAttachPDF}
            className="p-2 rounded-xl text-slate-400 hover:text-[#583BE8] hover:bg-purple-50 transition-colors cursor-pointer"
            title="Attach PDF Document"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message or choose template above..."
          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
        />

        {/* AI Suggested Replies Button Placeholder */}
        <button
          type="button"
          onClick={() => alert('AI Smart Reply: "Thank you! We will update your pickup details shortly."')}
          className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-black transition-all cursor-pointer shrink-0"
          title="AI Reply Assistant"
        >
          <Sparkles className="w-4 h-4 text-[#583BE8]" />
          <span>AI Reply</span>
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-3 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
