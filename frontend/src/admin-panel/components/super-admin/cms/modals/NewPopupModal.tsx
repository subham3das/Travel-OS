import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquarePlus } from 'lucide-react';
import { PromoPopupItem, PopupFrequency } from '../../../../types/cmsManagement';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';
import { CMSSelectionModal } from './CMSSelectionModal';

interface NewPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (pop: Partial<PromoPopupItem>) => void;
}

export const NewPopupModal: React.FC<NewPopupModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('Claim Voucher');
  const [buttonLink, setButtonLink] = useState('/offers');
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [frequency, setFrequency] = useState<PopupFrequency>('once_per_session');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600'
  );
  const [isBrowseTargetOpen, setIsBrowseTargetOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      buttonText: buttonText.trim(),
      buttonLink: buttonLink.trim(),
      imageUrl,
      mediaUrl: imageUrl,
      mediaType: 'image',
      delaySeconds: Number(delaySeconds) || 3,
      frequency,
      hasCloseButton: true,
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
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <MessageSquarePlus className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">Storefront Promo Popup</h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Trigger an interactive lead capture or promotion modal
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
              <label className="font-bold text-slate-700 block mb-1">Popup Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Get ₹2,000 Off Your First Trip! 🎉"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Promo terms or explanation..."
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Frequency Rule</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as PopupFrequency)}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                >
                  <option value="once_per_session">Once Per Session</option>
                  <option value="once_per_user">Once Per User</option>
                  <option value="always_show">Always Show</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trigger Delay (Seconds)</label>
                <input
                  type="number"
                  value={delaySeconds}
                  onChange={(e) => setDelaySeconds(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Button Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">Button Link URL</label>
                  <button
                    type="button"
                    onClick={() => setIsBrowseTargetOpen(true)}
                    className="text-[10px] text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Browse Packages
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    placeholder="/offers or https://..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setIsBrowseTargetOpen(true)}
                    className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border border-purple-200/60"
                    title="Browse MongoDB packages to link"
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>

            {/* Cloudinary Universal Uploader */}
            <UniversalImageUploader
              label="Popup Image (Cloudinary)"
              helpText="PNG, JPG, WEBP • Max 10MB"
              folder="travelos/popups"
              value={imageUrl}
              onChange={(url: any) => setImageUrl(url)}
              aspectRatio="video"
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
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-black text-xs cursor-pointer"
              >
                Publish Popup
              </button>
            </div>
          </form>
        </motion.div>

        {/* Browse Package Modal for Popup */}
        {isBrowseTargetOpen && (
          <CMSSelectionModal
            isOpen={isBrowseTargetOpen}
            onClose={() => setIsBrowseTargetOpen(false)}
            type="packages"
            title="Link Popup to Package"
            subtitle="Browse verified packages from MongoDB to link to this popup CTA"
            multiSelect={false}
            actionButtonText="Link Package"
            onConfirm={(selectedItems) => {
              if (selectedItems.length > 0) {
                const item = selectedItems[0];
                const code = item.packageId || item.id;
                setButtonLink(`/packages/${code}`);
                if (!title) {
                  setTitle(item.title || item.name || '');
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
