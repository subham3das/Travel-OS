import React from 'react';
import { Info } from 'lucide-react';
import { UniversalImageUploader } from '../../../components/common/UniversalImageUploader';

export interface PhotoSlotConfig {
  id: string;
  label: string;
  subtitle: string;
  tag: string;
  isPrimary?: boolean;
}

export const PHOTO_SLOTS: PhotoSlotConfig[] = [
  {
    id: 'front',
    label: 'Front View',
    subtitle: 'Primary exterior & listing thumbnail',
    tag: 'Front Exterior',
    isPrimary: true,
  },
  {
    id: 'rear',
    label: 'Rear / Back View',
    subtitle: 'Tail lights, number plate & trunk exterior',
    tag: 'Rear Exterior',
  },
  {
    id: 'side',
    label: 'Side Profile',
    subtitle: 'Full side body, doors & wheels',
    tag: 'Side Profile',
  },
  {
    id: 'interior',
    label: 'Cabin & Dashboard',
    subtitle: 'Cockpit, steering, infotainment & front seats',
    tag: 'Inside Front',
  },
  {
    id: 'boot',
    label: 'Rear Seats & Boot Space',
    subtitle: 'Rear passenger row & luggage cargo trunk',
    tag: 'Inside Rear',
  },
];

interface VehiclePhotoUploadGridProps {
  images: string[];
  thumbnail: string;
  onChange: (images: string[], thumbnail: string) => void;
}

export const VehiclePhotoUploadGrid: React.FC<VehiclePhotoUploadGridProps> = ({
  images,
  thumbnail,
  onChange,
}) => {
  const slotUrls = PHOTO_SLOTS.map((_, idx) => {
    if (idx === 0) return thumbnail || images[0] || '';
    return images[idx] || '';
  });

  const updateSlotImage = (index: number, newUrl: string) => {
    const updated = [...slotUrls];
    updated[index] = newUrl;
    const newThumb = updated[0] || '';
    const cleanedImages = updated.filter((url) => Boolean(url));
    onChange(cleanedImages, newThumb);
  };

  const uploadedCount = slotUrls.filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
            <span>5-Angle Inspection Photo Slots</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#583BE8]">
              {uploadedCount} / 5 Uploaded
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Upload clear, high-resolution photos for verification & customer booking.
          </p>
        </div>
      </div>

      {/* Grid of Universal Uploaders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PHOTO_SLOTS.map((slot, index) => (
          <div key={slot.id} className={slot.isPrimary ? 'sm:col-span-2 lg:col-span-1' : ''}>
            <UniversalImageUploader
              label={`${slot.label} ${slot.isPrimary ? '(Primary Thumbnail) *' : '*'}`}
              helpText={slot.subtitle}
              folder="travelos/cars"
              value={slotUrls[index]}
              onChange={(newUrl) => updateSlotImage(index, newUrl)}
              aspectRatio="video"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-800 text-xs">
        <Info className="w-4 h-4 shrink-0 text-amber-600" />
        <span>Front view will be displayed as the primary vehicle thumbnail across user search and booking cards.</span>
      </div>
    </div>
  );
};
