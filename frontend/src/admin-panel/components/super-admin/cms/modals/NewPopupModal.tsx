import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquarePlus, Plus, Clock, Users } from 'lucide-react';
import { PromoPopupItem, PopupAudience, PopupFrequency } from '../../../../types/cmsManagement';

interface NewPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (pop: Partial<PromoPopupItem>) => void;
}

export const NewPopupModal: React.FC<NewPopupModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('Claim Offer');
  const [buttonLink, setButtonLink] = useState('/offers');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop'
  );
  const [delaySeconds, setDelaySeconds] = useState(5);
  const [audience, setAudience] = useState<PopupAudience>('all');
  const [frequency, setFrequency] = useState<PopupFrequency>('once_per_session');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      buttonText: buttonText.trim(),
      buttonLink: buttonLink.trim(),
      imageUrl,
      delaySeconds,
      audience,
      frequency,
      hasCloseButton: true,
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
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                <MessageSquarePlus className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Create Storefront Popup</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Promotional modal displayed to visitors on the landing page
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
                Popup Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Download the Travel OS Mobile App"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Description / Message
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Get real-time trip tracking, offline vouchers, and ₹1,500 welcome credit."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Button Destination Link
                </label>
                <input
                  type="text"
                  required
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                Modal Graphic Image URL
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-[#0F172A]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Trigger Delay
                </label>
                <select
                  value={delaySeconds}
                  onChange={(e) => setDelaySeconds(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds</option>
                  <option value={10}>10 Seconds</option>
                  <option value={20}>20 Seconds</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Target Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as PopupAudience)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="all">All Visitors</option>
                  <option value="first_time">First Time Only</option>
                  <option value="registered">Registered</option>
                  <option value="agencies">Agencies</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                  Display Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as PopupFrequency)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="once_per_session">Once Per Session</option>
                  <option value="once_per_user">Once Per User</option>
                  <option value="always">Every Visit</option>
                </select>
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Popup</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
