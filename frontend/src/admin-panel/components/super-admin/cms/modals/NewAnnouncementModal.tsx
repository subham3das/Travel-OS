import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Plus } from 'lucide-react';
import {
  PlatformAnnouncementItem,
  AnnouncementType,
  AnnouncementPlacement,
} from '../../../../types/cmsManagement';

interface NewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ann: Partial<PlatformAnnouncementItem>) => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AnnouncementType>('info');
  const [placement, setPlacement] = useState<AnnouncementPlacement>('all');
  const [bgColor, setBgColor] = useState('#3B82F6');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [ctaText, setCtaText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isDismissible, setIsDismissible] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      type,
      placement,
      bgColor,
      textColor,
      ctaText: ctaText.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
      isPinned,
      isDismissible,
      priority: 1,
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
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Megaphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0F172A]">Broadcast Announcement</h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Publish a real-time notification alert or header ticker
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
              <label className="font-bold text-slate-700 block mb-1">Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled System Maintenance on Sunday 02:00 AM"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Message Content</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short explanation for travelers..."
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AnnouncementType)}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Critical Alert</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Placement</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as AnnouncementPlacement)}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                >
                  <option value="all">Everywhere</option>
                  <option value="home_only">Homepage Only</option>
                  <option value="mobile_only">Mobile App Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Background Color</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-9 border rounded-xl p-1 cursor-pointer"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-9 border rounded-xl p-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">CTA Text (Optional)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Learn More"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Link URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="/packages or https://..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>Pin to top</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={isDismissible}
                  onChange={(e) => setIsDismissible(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>Allow dismissal</span>
              </label>
            </div>

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
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-black text-xs cursor-pointer"
              >
                Publish Notice
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
