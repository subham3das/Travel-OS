import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Tag } from 'lucide-react';
import { PromotionalCampaignItem, CampaignType } from '../../../../types/cmsManagement';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';
import { CMSSelectionModal } from './CMSSelectionModal';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (camp: Partial<PromotionalCampaignItem>) => void;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType>('Festival');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>(undefined);
  const [landingUrl, setLandingUrl] = useState('');
  const [bannerImage, setBannerImage] = useState(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800'
  );
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [isBrowseTargetOpen, setIsBrowseTargetOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !bannerImage) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      campaignType,
      couponCode: couponCode.trim().toUpperCase() || undefined,
      discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
      landingUrl: landingUrl.trim() || undefined,
      bannerImage,
      startDate,
      endDate: endDate || undefined,
      status: 'published',
      priority: 1,
      isEnabled: true,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">Launch Campaign</h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Create a promotional sale linked to platform coupons
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Campaign Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Monsoon Magic Flash Sale"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of discounts or promotions..."
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Type</label>
                <select
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                >
                  <option value="Discount">Discount</option>
                  <option value="Festival">Festival Sale</option>
                  <option value="Seasonal">Seasonal</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Linked Coupon Code (Optional)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. MONSOON20"
                  className="w-full px-3 py-2 border rounded-xl uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Discount % (Optional)</label>
                <input
                  type="number"
                  value={discountPercentage || ''}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">Landing URL (Optional)</label>
                  <button
                    type="button"
                    onClick={() => setIsBrowseTargetOpen(true)}
                    className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Browse Packages
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={landingUrl}
                    onChange={(e) => setLandingUrl(e.target.value)}
                    placeholder="/campaigns/monsoon"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setIsBrowseTargetOpen(true)}
                    className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border border-emerald-200/60"
                    title="Browse MongoDB packages for campaign"
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>

            {/* Cloudinary Universal Uploader */}
            <UniversalImageUploader
              label="Campaign Banner (Cloudinary)"
              helpText="PNG, JPG, WEBP • Max 10MB"
              folder="travelos/campaigns"
              value={bannerImage}
              onChange={(url: any) => setBannerImage(url)}
              aspectRatio="wide"
            />

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs cursor-pointer"
              >
                Launch Campaign
              </button>
            </div>
          </form>
        </motion.div>

        {/* Browse Package Modal for Campaign */}
        {isBrowseTargetOpen && (
          <CMSSelectionModal
            isOpen={isBrowseTargetOpen}
            onClose={() => setIsBrowseTargetOpen(false)}
            type="packages"
            title="Link Campaign to Package"
            subtitle="Browse verified packages from MongoDB to link to this promotional campaign"
            multiSelect={false}
            actionButtonText="Link Package"
            onConfirm={(selectedItems) => {
              if (selectedItems.length > 0) {
                const item = selectedItems[0];
                const code = item.packageId || item.id;
                setLandingUrl(`/packages/${code}`);
                if (!title) {
                  setTitle(item.title || item.name || '');
                }
                if (item.coverImage && (!bannerImage || bannerImage.includes('unsplash'))) {
                  setBannerImage(item.coverImage);
                }
              }
              setIsBrowseTargetOpen(false);
            }}
          />
        )}
      </div>
    </AnimatePresence>
  );
};
