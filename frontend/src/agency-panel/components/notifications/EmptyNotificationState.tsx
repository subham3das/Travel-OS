import React from 'react';
import { BellOff, RefreshCw } from 'lucide-react';

interface EmptyNotificationStateProps {
  onResetSearch?: () => void;
}

export const EmptyNotificationState: React.FC<EmptyNotificationStateProps> = ({
  onResetSearch,
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100/90 shadow-2xs text-center space-y-4 select-none my-6">
      <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto shadow-xs">
        <BellOff className="w-8 h-8" />
      </div>

      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
          No Notifications Yet
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 leading-relaxed">
          You'll see important updates here as your business grows. Check back later for new bookings, payments, and trip activity.
        </p>
      </div>

      {onResetSearch && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetSearch}
            className="px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black inline-flex items-center gap-2 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyNotificationState;
