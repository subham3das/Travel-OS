import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Calendar,
  Layers,
  ArrowUpRight,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import {
  PromotionalCampaignItem,
  CampaignApplicableTo,
  ContentStatus,
} from '../../../../types/cmsManagement';

interface PromotionalCampaignsEditorProps {
  campaigns: PromotionalCampaignItem[];
  onSaveCampaign: (camp: Partial<PromotionalCampaignItem>) => void;
  onDeleteCampaign: (id: string) => void;
  onOpenNewModal: () => void;
}

export const PromotionalCampaignsEditor: React.FC<PromotionalCampaignsEditorProps> = ({
  campaigns,
  onSaveCampaign,
  onDeleteCampaign,
  onOpenNewModal,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Seasonal Marketing Campaigns</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Manage seasonal sales, coupon campaigns, and festival discount events
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3.5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-200 transition-all"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-full sm:w-44 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                <img src={camp.bannerImage} alt={camp.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    camp.status === 'active'
                      ? 'bg-emerald-500 text-white'
                      : camp.status === 'scheduled'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {camp.status}
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black text-[#0F172A]">{camp.title}</h3>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-1">
                      {camp.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onSaveCampaign({
                          id: camp.id,
                          status: camp.status === 'active' ? 'draft' : 'active',
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                        camp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {camp.status === 'active' ? 'Live' : 'Draft'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCampaign(camp.id)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <ArrowUpRight className="w-3 h-3" /> {camp.ctaText} → {camp.ctaLink}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {camp.startDate} to {camp.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-400" />
                    Target: <strong className="text-slate-800 uppercase">{camp.applicableTo}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
