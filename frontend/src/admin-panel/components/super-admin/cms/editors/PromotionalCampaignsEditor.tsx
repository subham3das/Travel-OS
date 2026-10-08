import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Upload,
  Loader2,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { PromotionalCampaignItem } from '../../../../types/cmsManagement';
import { adminCMSManagementService } from '../../../../services/adminCMSManagement.service';

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
  const [editingCamp, setEditingCamp] = useState<PromotionalCampaignItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCamp) return;
    setIsUploading(true);
    try {
      const res = await adminCMSManagementService.uploadMedia(file, 'travelos/campaigns');
      setEditingCamp({ ...editingCamp, bannerImage: res.url });
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-[#0F172A]">Promotional Campaigns</h2>
          <p className="text-[11px] text-slate-400 font-semibold">
            Launch seasonal, festival, or flash sale campaigns connected with real platform coupons
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

      {/* Empty State */}
      {campaigns.length === 0 ? (
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">No Active Promotional Campaigns</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
              Launch a seasonal campaign with a linked coupon code to drive booking conversions.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-sm hover:bg-emerald-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Launch First Campaign</span>
          </button>
        </div>
      ) : (
        /* Campaigns Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all space-y-2.5 relative"
            >
              <div className="relative h-28 rounded-xl overflow-hidden bg-slate-200">
                <img src={camp.bannerImage} alt={camp.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[9px] font-black backdrop-blur-xs">
                  {camp.campaignType}
                </span>
                {camp.couponCode && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {camp.couponCode}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onDeleteCampaign(camp.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-black text-[#0F172A]">{camp.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{camp.description}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-500">
                  {camp.startDate ? `${camp.startDate} to ${camp.endDate || 'Ongoing'}` : 'Always Active'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                  {camp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
