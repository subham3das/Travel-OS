import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  History,
  Sparkles,
  Plus,
  ChevronDown,
} from 'lucide-react';

interface AdminCMSHeaderProps {
  onPreviewSite: () => void;
  onContentHistory: () => void;
  onSEOAnalyzer: () => void;
  onCreateContent: () => void;
}

export const AdminCMSHeader: React.FC<AdminCMSHeaderProps> = ({
  onPreviewSite,
  onContentHistory,
  onSEOAnalyzer,
  onCreateContent,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none">
      {/* Left: Back Button + Title + Subtitle */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate('/admin')}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            CMS - Content Management System
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Manage and customize content across the Travel OS platform.
          </p>
        </div>
      </div>

      {/* Right Actions: Preview Site, Content History, SEO Analyzer, Create Content */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Preview Site */}
        <button
          onClick={onPreviewSite}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Preview Site</span>
        </button>

        {/* Content History */}
        <button
          onClick={onContentHistory}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>Content History</span>
        </button>

        {/* SEO Analyzer */}
        <button
          onClick={onSEOAnalyzer}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#6356E5]" />
          <span>SEO Analyzer</span>
        </button>

        {/* Create Content (Primary Purple CTA) */}
        <button
          onClick={onCreateContent}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Content</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>
      </div>
    </div>
  );
};
