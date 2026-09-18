import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, FileText, Sparkles, Loader2 } from 'lucide-react';
import { QuickActionBar } from './QuickActionBar';

interface MessageInputProps {
  onSendMessage: (
    text: string,
    type?: 'text' | 'image' | 'pdf' | 'document',
    attachmentUrl?: string,
    attachmentMeta?: { fileName?: string; fileSize?: string; publicId?: string }
  ) => void;
  onUploadFile?: (file: File) => Promise<any>;
  onTyping?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onUploadFile,
  onTyping,
}) => {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isUploading) return;
    onSendMessage(text.trim(), 'text');
    setText('');
  };

  const handleSelectTemplate = (templateText: string) => {
    setText(templateText);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, expectedType: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;

    try {
      setIsUploading(true);
      const uploaded = await onUploadFile(file);
      if (uploaded && uploaded.secureUrl) {
        onSendMessage(
          text.trim() || (expectedType === 'pdf' ? `Document: ${uploaded.fileName || file.name}` : `Photo: ${file.name}`),
          expectedType,
          uploaded.secureUrl,
          {
            fileName: uploaded.fileName || file.name,
            fileSize: uploaded.fileSize,
            publicId: uploaded.publicId,
          }
        );
        setText('');
      }
    } catch (err: any) {
      console.error('File upload failed:', err);
      alert(`Failed to upload attachment: ${err.message || 'Please try again'}`);
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white border-t border-slate-100 select-none">
      {/* Hidden native file inputs for real Cloudinary uploads */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileChange(e, 'image')}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />
      <input
        type="file"
        ref={pdfInputRef}
        onChange={(e) => handleFileChange(e, 'pdf')}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {/* Predefined Quick Actions Row */}
      <QuickActionBar onSelectTemplate={handleSelectTemplate} />

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => imageInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-400 hover:text-[#583BE8] hover:bg-purple-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Attach Photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => pdfInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-400 hover:text-[#583BE8] hover:bg-purple-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Attach PDF Document"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping?.();
          }}
          placeholder={isUploading ? 'Uploading attachment to cloud...' : 'Type message or choose template above...'}
          disabled={isUploading}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all disabled:bg-slate-100"
        />

        {/* AI Suggested Replies Button Placeholder */}
        <button
          type="button"
          onClick={() => {
            setText('Thank you! We have verified your request and will update your itinerary shortly.');
          }}
          className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#583BE8] text-xs font-black transition-all cursor-pointer shrink-0"
          title="AI Reply Assistant"
        >
          <Sparkles className="w-4 h-4 text-[#583BE8]" />
          <span>AI Reply</span>
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isUploading}
          className="p-3 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer shrink-0"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
