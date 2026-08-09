import React from 'react';
import { Calendar, MapPin, Eye } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';

export const PackageSummaryHeader: React.FC = () => {
  const { draft } = usePackageWizard();

  const packageName = draft?.step1?.packageName || 'Ladakh Adventure Expedition';
  const duration = draft?.step2?.durationPreset || '7 Days / 6 Nights';
  const destinations =
    draft?.step2?.destinationsCovered?.length > 0
      ? draft.step2.destinationsCovered.join(' • ')
      : 'Leh • Nubra Valley • Pangong Lake • Khardung La';

  const defaultCover =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <img
          src={defaultCover}
          alt={packageName}
          className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl object-cover border border-slate-200/80 shadow-2xs shrink-0"
        />
        <div className="space-y-0.5 min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-black text-[#0F172A] tracking-tight truncate">
            {packageName}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
            <span className="truncate">{duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
            <span className="truncate">{destinations}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          alert(
            `Package Summary:\n\nName: ${packageName}\nDuration: ${duration}\nDestinations: ${destinations}`
          )
        }
        className="px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100/70 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <Eye className="w-4 h-4 text-[#583BE8]" />
        <span className="whitespace-nowrap">View Summary</span>
      </button>
    </div>
  );
};

export default PackageSummaryHeader;
