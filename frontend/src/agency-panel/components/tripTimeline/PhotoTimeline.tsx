import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Image as ImageIcon, X, Upload } from 'lucide-react';
import { TripPhoto, PhotoCategory } from '../../data/tripTimeline';

interface PhotoTimelineProps {
  photos: TripPhoto[];
  onAddPhoto: (photo: Omit<TripPhoto, 'id'>) => void;
}

const CATEGORIES: PhotoCategory[] = ['Departure', 'Hotel Check-in', 'Sightseeing', 'Group Photos', 'Other'];

export const PhotoTimeline: React.FC<PhotoTimelineProps> = ({ photos, onAddPhoto }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState<PhotoCategory>('Sightseeing');
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');

  const SAMPLE_PHOTOS = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = url.trim() || SAMPLE_PHOTOS[Math.floor(Math.random() * SAMPLE_PHOTOS.length)];
    const now = new Date();
    const timeStr = `${now.getDate()} May, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    onAddPhoto({
      url: finalUrl,
      caption: caption.trim() || `${category} moment`,
      category,
      timestampText: timeStr,
    });

    setCaption('');
    setUrl('');
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Trip Photo Log & Gallery</h3>
            <p className="text-[11px] font-semibold text-slate-400">Live visual records uploaded by trip host</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'Cancel' : 'Upload Photo'}</span>
        </button>
      </div>

      {/* Add Photo Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Photo Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PhotoCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#0F172A] focus:outline-none focus:border-sky-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Photo Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Group photo at Khardung La Top"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Image URL (Optional)</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Leave blank to use sample photo..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Timeline</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-4/3">
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
              <span className="text-[9px] font-black uppercase text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded w-fit mb-0.5">
                {photo.category}
              </span>
              <p className="text-[11px] font-extrabold text-white truncate">{photo.caption}</p>
              <span className="text-[9px] text-slate-300 font-medium">{photo.timestampText}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PhotoTimeline;
