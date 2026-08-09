import React from 'react';
import { UserCheck, Play, Square, BarChart2, Lock } from 'lucide-react';

interface StickyActionBarProps {
  statusCategory: 'Pending Setup' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  isSetupComplete?: boolean;
  onCheckInTravelers?: () => void;
  onPrimaryAction?: () => void;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  statusCategory,
  isSetupComplete = true,
  onCheckInTravelers,
  onPrimaryAction,
}) => {
  const getPrimaryButtonContent = () => {
    if (statusCategory === 'Pending Setup' || !isSetupComplete) {
      return {
        label: 'Activate Trip',
        icon: <Lock className="w-4 h-4" />,
        disabled: true,
      };
    }

    switch (statusCategory) {
      case 'Upcoming':
        return {
          label: 'Start Trip',
          icon: <Play className="w-4 h-4 fill-current" />,
          disabled: false,
        };
      case 'Ongoing':
        return {
          label: 'End Trip',
          icon: <Square className="w-4 h-4 fill-current" />,
          disabled: false,
        };
      case 'Completed':
      default:
        return {
          label: 'View Summary',
          icon: <BarChart2 className="w-4 h-4" />,
          disabled: false,
        };
    }
  };

  const { label, icon, disabled } = getPrimaryButtonContent();

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 sm:px-6 shadow-2xl select-none md:ml-64">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
        {disabled && (
          <p className="text-[11px] font-bold text-amber-700 w-full text-center sm:text-left">
            ⚠️ Complete all required assignments before activating this trip.
          </p>
        )}

        <div className="w-full flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCheckInTravelers}
            className="flex-1 py-3 px-4 rounded-2xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-[#583BE8] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 stroke-[2.2]" />
            <span>Check-in Travelers</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={onPrimaryAction}
            className={`flex-1 py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              disabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white shadow-lg shadow-[#583BE8]/25 cursor-pointer'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyActionBar;
