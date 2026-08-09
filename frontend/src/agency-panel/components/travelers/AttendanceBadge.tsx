import React from 'react';

// AttendanceBadge — individual presence indicator for every traveler
interface AttendanceBadgeProps {
  status: 'Checked In' | 'Not Checked In';
  onCheckIn?: () => void;
}

export const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({ status, onCheckIn }) => {
  if (status === 'Checked In') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Present
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onCheckIn}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-extrabold hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-all cursor-pointer"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
      Absent
    </button>
  );
};

export default AttendanceBadge;
