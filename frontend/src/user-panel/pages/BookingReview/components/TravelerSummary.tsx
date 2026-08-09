import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, CheckCircle2 } from 'lucide-react';

export interface ReviewTravelerItem {
  id: string;
  name: string;
  isLead?: boolean;
  type: string; // Adult or Child
  subDetails: string; // e.g. "15/08/1992 • Male" or "12 Years • Female"
  isVerified?: boolean;
}

interface TravelerSummaryProps {
  packageId: string;
  travelers: ReviewTravelerItem[];
}

export const TravelerSummary: React.FC<TravelerSummaryProps> = ({
  packageId,
  travelers,
}) => {
  const navigate = useNavigate();

  const defaultList: ReviewTravelerItem[] = travelers && travelers.length > 0 ? travelers : [
    { id: '1', name: 'Rahul Sharma', isLead: true, type: 'Adult', subDetails: '15/08/1992 • Male', isVerified: true },
    { id: '2', name: 'Ananya Sharma', isLead: false, type: 'Child', subDetails: '12 Years • Female', isVerified: true },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Travelers
        </h2>
        <button
          onClick={() => navigate(`/booking/traveler-details/${packageId}`)}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
        {defaultList.map((trv, idx) => (
          <div
            key={trv.id}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F5F3FF] text-[#6356E5] font-black flex items-center justify-center text-xs shrink-0">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                  {trv.name} {trv.isLead && <span className="text-slate-400 font-semibold">(Lead)</span>}
                </h3>
                <p className="text-[11px] font-semibold text-slate-400">
                  {trv.type} • {trv.subDetails}
                </p>
              </div>
            </div>

            {trv.isVerified !== false && (
              <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-xs shrink-0">
                <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                <span>Verified</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
