import React from 'react';
import {
  Search,
  SlidersHorizontal,
  MoreVertical,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  ChevronDown,
  Users,
} from 'lucide-react';
import {
  CampaignItem,
  CampaignNotificationType,
  CampaignStatus,
} from '../../../types/notificationsManagement';

interface CampaignLibraryProps {
  campaigns: CampaignItem[];
  selectedCampaignId: string;
  onSelectCampaign: (campaign: CampaignItem) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoadMore?: () => void;
}

export const CampaignLibrary: React.FC<CampaignLibraryProps> = ({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onLoadMore,
}) => {
  const filterPills = [
    { id: 'All', label: 'All', count: 42 },
    { id: 'Draft', label: 'Draft', count: 8 },
    { id: 'Scheduled', label: 'Scheduled', count: 12 },
    { id: 'Sending', label: 'Sending', count: 3 },
    { id: 'Completed', label: 'Completed', count: 19 },
  ];

  const getTypeIcon = (type: CampaignNotificationType) => {
    switch (type) {
      case 'Push':
        return {
          icon: <Bell className="w-3.5 h-3.5" />,
          bg: 'bg-purple-50 text-[#6356E5] border-purple-100',
        };
      case 'Email':
        return {
          icon: <Mail className="w-3.5 h-3.5" />,
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
        };
      case 'SMS':
        return {
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          bg: 'bg-orange-50 text-orange-600 border-orange-100',
        };
      case 'In-App':
      default:
        return {
          icon: <Smartphone className="w-3.5 h-3.5" />,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
    }
  };

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
            Completed
          </span>
        );
      case 'Scheduled':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100">
            Scheduled
          </span>
        );
      case 'Sending':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100">
            Sending
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3.5">
      {/* ── 1. Top Header ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Campaigns</h3>
        <button
          className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          title="Filter campaigns"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 2. Search Input ── */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
        />
      </div>

      {/* ── 3. Status Filter Pills ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {filterPills.map((pill) => {
          const isActive = statusFilter.toLowerCase() === pill.id.toLowerCase();
          return (
            <button
              key={pill.id}
              onClick={() => onStatusFilterChange(pill.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`text-[9px] font-mono font-bold ${
                  isActive ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Campaign Cards List ── */}
      <div className="space-y-2.5 overflow-y-auto max-h-[620px] pr-1 scrollbar-thin">
        {campaigns.map((campaign) => {
          const isSelected = campaign.id === selectedCampaignId;
          const { icon, bg } = getTypeIcon(campaign.type);

          return (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-purple-50/40 border-[#6356E5] shadow-xs'
                  : 'bg-white border-slate-100/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
              }`}
            >
              {/* Left Accent Bar for Selected Item */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6356E5]" />
              )}

              {/* Top Row: Type Badge + Title + Status Badge */}
              <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-xl border flex flex-col items-center justify-center shrink-0 ${bg}`}>
                    {icon}
                    <span className="text-[7px] font-black uppercase mt-0.5 leading-none">{campaign.type}</span>
                  </div>
                  <h4 className="text-xs font-black text-[#0F172A] line-clamp-1">
                    {campaign.name}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {getStatusBadge(campaign.status)}
                  <button className="w-5 h-5 rounded-md hover:bg-slate-200/80 text-slate-400 flex items-center justify-center">
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Audience info */}
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mb-2">
                <span>{campaign.audience}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>{campaign.audienceReach}</span>
                </span>
              </div>

              {/* Progress Bar or Schedule Info */}
              {campaign.status === 'Completed' && (
                <div className="space-y-1 mb-2">
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="w-full h-full bg-emerald-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Sent on {campaign.sentDate}</span>
                    <span className="font-bold text-emerald-600">100%</span>
                  </div>
                </div>
              )}

              {campaign.status === 'Sending' && (
                <div className="space-y-1 mb-2">
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full animate-pulse"
                      style={{ width: `${campaign.progressPercentage || 62}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Started: {campaign.sentDate}</span>
                    <span className="font-bold text-blue-600">{campaign.progressPercentage || 62}%</span>
                  </div>
                </div>
              )}

              {campaign.status === 'Scheduled' && (
                <div className="p-1.5 rounded-xl bg-amber-50/60 border border-amber-100 text-[10px] font-mono text-amber-800 font-bold mb-2">
                  Schedule: {campaign.scheduleTime}
                </div>
              )}

              {campaign.status === 'Draft' && (
                <div className="text-[10px] text-slate-400 font-mono">
                  Created on {campaign.createdAt} • by {campaign.createdBy}
                </div>
              )}

              {/* Author footer if completed */}
              {campaign.status === 'Completed' && (
                <div className="text-[9px] text-slate-400 font-medium">
                  by {campaign.createdBy}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 5. Bottom Load More ── */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onLoadMore}
          className="w-full py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
        >
          <span>Load More Campaigns</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
