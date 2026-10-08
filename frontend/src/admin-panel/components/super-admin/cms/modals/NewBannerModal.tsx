import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Plus } from 'lucide-react';
import { HeroBannerItem, BannerTargetType, CMSSelectItem } from '../../../../types/cmsManagement';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';
import { CMSSelectionModal } from './CMSSelectionModal';

interface NewBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (banner: Partial<HeroBannerItem>) => void;
}

export const NewBannerModal: React.FC<NewBannerModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Explore Now');
  const [targetType, setTargetType] = useState<BannerTargetType>('Package');
  const [targetId, setTargetId] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [isBrowseTargetOpen, setIsBrowseTargetOpen] = useState(false);
  const [desktopImage, setDesktopImage] = useState(
    'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200'
  );
  const [priority, setPriority] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desktopImage) return;

    onCreate({
      title: title.trim(),
      subtitle: subtitle.trim(),
      ctaText: ctaText.trim(),
      targetType,
      targetId: targetType !== 'External' ? targetId.trim() : undefined,
      externalUrl: targetType === 'External' ? externalUrl.trim() : undefined,
      desktopImage,
      mobileImage: desktopImage,
      startDate,
      endDate,
      priority: Number(priority) || 1,
      isEnabled: true,
      status: 'published',
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
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100">
                <ImageIcon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">Create Hero Banner</h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Publish a new slide to the storefront hero carousel
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
              <label className="font-bold text-slate-700 block mb-1">Slide Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Discover the Untouched Beauty of Kashmir"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Brief description or teaser..."
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Route Type</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as BannerTargetType)}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                >
                  <option value="Package">Package</option>
                  <option value="Agency">Agency</option>
                  <option value="Destination">Destination</option>
                  <option value="Car Rental">Car Rental</option>
                  <option value="External">External URL</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    {targetType === 'External' ? 'External URL' : 'Target ID / Slug'}
                  </label>
                  {targetType !== 'External' && (
                    <button
                      type="button"
                      onClick={() => setIsBrowseTargetOpen(true)}
                      className="text-[10px] font-extrabold text-[#6356E5] hover:underline cursor-pointer"
                    >
                      Browse {targetType}s
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={targetType === 'External' ? externalUrl : targetId}
                    onChange={(e) =>
                      targetType === 'External' ? setExternalUrl(e.target.value) : setTargetId(e.target.value)
                    }
                    placeholder={
                      targetType === 'External'
                        ? 'https://...'
                        : `Select or type ${targetType.toLowerCase()} ID...`
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                  {targetType !== 'External' && (
                    <button
                      type="button"
                      onClick={() => setIsBrowseTargetOpen(true)}
                      className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#6356E5] rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border border-purple-200/60"
                      title={`Browse available ${targetType}s from database`}
                    >
                      Browse
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Priority</label>
                <input
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            {/* Cloudinary Universal Uploader */}
            <UniversalImageUploader
              label="Banner Image (Cloudinary)"
              helpText="PNG, JPG, WEBP • Max 10MB"
              folder="travelos/banners"
              value={desktopImage}
              onChange={(url: any) => setDesktopImage(url)}
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
                className="px-4 py-2 rounded-xl bg-[#6356E5] text-white font-black text-xs cursor-pointer"
              >
                Publish Banner
              </button>
            </div>
          </form>
        </motion.div>

        {/* Target Selector Modal */}
        {targetType !== 'External' && isBrowseTargetOpen && (
          <CMSSelectionModal
            isOpen={isBrowseTargetOpen}
            onClose={() => setIsBrowseTargetOpen(false)}
            type={
              targetType === 'Package'
                ? 'packages'
                : targetType === 'Agency'
                ? 'agencies'
                : targetType === 'Destination'
                ? 'destinations'
                : 'vehicles'
            }
            title={`Select ${targetType}`}
            subtitle={`Choose a ${targetType.toLowerCase()} from MongoDB to link to this banner`}
            multiSelect={false}
            actionButtonText="Select as Target"
            onConfirm={(selectedItems) => {
              if (selectedItems.length > 0) {
                const item = selectedItems[0];
                const code = item.packageId || item.agencyId || item.destination || item.name || item.id;
                setTargetId(code);
                if (!title) {
                  setTitle(item.title || item.name || '');
                }
                if (item.coverImage && (!desktopImage || desktopImage.includes('unsplash'))) {
                  setDesktopImage(item.coverImage);
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
