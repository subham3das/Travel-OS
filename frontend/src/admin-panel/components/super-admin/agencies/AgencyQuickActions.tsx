import React from 'react';
import { ShieldCheck, PauseCircle, Edit3, MoreHorizontal } from 'lucide-react';
import { Agency } from '../../../types/agency';

interface AgencyQuickActionsProps {
  agency: Agency;
  onViewFullProfile: (agency: Agency) => void;
  onVerifyAgency: (agency: Agency) => void;
  onSuspendAgency: (agency: Agency) => void;
  onEditAgency: (agency: Agency) => void;
  onMoreActions: (agency: Agency) => void;
}

export const AgencyQuickActions: React.FC<AgencyQuickActionsProps> = ({
  agency,
  onViewFullProfile,
  onVerifyAgency,
  onSuspendAgency,
  onEditAgency,
  onMoreActions,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Quick Actions
      </h4>

      <div className="space-y-2.5">
        {/* Primary View Full Profile Button */}
        <button
          onClick={() => onViewFullProfile(agency)}
          className="w-full py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer text-center"
        >
          View Full Profile
        </button>

        {/* 2x2 Grid of Secondary Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onVerifyAgency(agency)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify Agency</span>
          </button>

          <button
            onClick={() => onSuspendAgency(agency)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-amber-200 text-amber-700 bg-white hover:bg-amber-50 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <PauseCircle className="w-4 h-4 text-amber-600" />
            <span>Suspend Agency</span>
          </button>

          <button
            onClick={() => onEditAgency(agency)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-purple-200 text-[#6356E5] bg-white hover:bg-purple-50 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#6356E5]" />
            <span>Edit Agency</span>
          </button>

          <button
            onClick={() => onMoreActions(agency)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
            <span>More Actions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
