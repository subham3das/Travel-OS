import React from 'react';
import { MapPin, Calendar, Star, CheckCircle2 } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const PackagePreviewHero: React.FC = () => {
  const { draft, isAllStepsValid } = usePackageWizard();

  const title = draft?.step1?.packageName || 'Ladakh Adventure Expedition';
  const duration = draft?.step2?.durationPreset || '7 Days / 6 Nights';
  const destinations = draft?.step2?.destinationsCovered?.length
    ? draft.step2.destinationsCovered.join(' • ')
    : 'Leh • Nubra Valley • Pangong Lake';
  const coverImage =
    draft?.step5?.coverImage ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
  const price = draft?.step3?.discountedPrice || draft?.step3?.originalPrice || 16999;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-stretch md:items-center gap-5 select-none">
      {/* Cover Image with Price Pill */}
      <div className="relative w-full md:w-80 h-48 md:h-44 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
        <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-sm text-white">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Starting from</p>
          <p className="text-sm font-black text-white">₹{price.toLocaleString()} <span className="text-[10px] font-semibold text-slate-300">/ person</span></p>
        </div>
      </div>

      {/* Hero Details */}
      <div className="flex-1 min-w-0 space-y-2.5 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base sm:text-xl font-black text-[#0F172A] leading-tight truncate">
            {title}
          </h2>
          {isAllStepsValid && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold flex items-center gap-1.5 shrink-0 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ready to Publish</span>
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-xs font-semibold text-slate-600">
          <p className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin className="w-4 h-4 text-[#583BE8] shrink-0" />
            <span className="truncate">{destinations}</span>
          </p>

          <p className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-4 h-4 text-[#583BE8] shrink-0" />
            <span>{duration}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1 text-xs font-bold border-t border-slate-100">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-black text-[#0F172A]">4.8</span>
            <span className="text-slate-400 font-semibold">(120 reviews)</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>By MountRoam Adventures</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#583BE8] fill-purple-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePreviewHero;
