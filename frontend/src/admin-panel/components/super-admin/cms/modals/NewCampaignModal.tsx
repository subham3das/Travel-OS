import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Calendar } from 'lucide-react';
import { PromotionalCampaignItem, CampaignApplicableTo } from '../../../../types/cmsManagement';

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
  const [ctaText, setCtaText] = useState('Claim Offer');
  const [ctaLink, setCtaLink] = useState('/campaigns/seasonal');
  const [bannerImage, setBannerImage] = useState(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
  );
  const [applicableTo, setApplicableTo] = useState<CampaignApplicableTo>('both');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2025-12-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      ctaText: ctaText.trim(),
      ctaLink: ctaLink.trim(),
      bannerImage,
      applicableTo,
      startDate,
      endDate,
      status: 'active',
      priority: 1,
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
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Launch Seasonal Campaign</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Create full-width promotional banner and discount codes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Splash Mega Sale 2025"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Description / Offer Terms
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Flat ₹5,000 off on all international beach holiday packages"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  required
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Target Audience / Panel
                </label>
                <select
                  value={applicableTo}
                  onChange={(e) => setApplicableTo(e.target.value as CampaignApplicableTo)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="both">All (Homepage & Agency)</option>
                  <option value="homepage">Homepage Only</option>
                  <option value="agency">Agency Portal Only</option>
                  <option value="customer">Customer App Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Campaign Banner URL (800x400)
              </label>
              <input
                type="url"
                required
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Campaign</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
