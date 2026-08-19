import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Users,
  History,
  Plus,
} from 'lucide-react';

interface AdminNotificationsHeaderProps {
  onOpenTemplates: () => void;
  onOpenAudienceSegments: () => void;
  onOpenHistory: () => void;
  onCreateCampaign: () => void;
}

export const AdminNotificationsHeader: React.FC<AdminNotificationsHeaderProps> = ({
  onOpenTemplates,
  onOpenAudienceSegments,
  onOpenHistory,
  onCreateCampaign,
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
            Notifications Management
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Create, manage and analyze notifications across the Travel OS platform.
          </p>
        </div>
      </div>

      {/* Right Controls: Templates, Audience Segments, Notification History, Create Campaign */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Templates */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Templates</span>
        </button>

        {/* Audience Segments */}
        <button
          onClick={onOpenAudienceSegments}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Audience Segments</span>
        </button>

        {/* Notification History */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>Notification History</span>
        </button>

        {/* Create Campaign (Primary Purple CTA) */}
        <button
          onClick={onCreateCampaign}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>
    </div>
  );
};
