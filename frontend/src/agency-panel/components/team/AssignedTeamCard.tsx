import React from 'react';
import { PhoneCall, RefreshCw, Sparkles, Plus } from 'lucide-react';
import { AssignedStaffMember } from '../../data/staff';

interface AssignedTeamCardProps {
  assignedTeam: AssignedStaffMember[];
  onAutoSuggest?: () => void;
  onReplace?: (staffId: string) => void;
  onAssign?: (role: string) => void;
}

export const AssignedTeamCard: React.FC<AssignedTeamCardProps> = ({
  assignedTeam,
  onAutoSuggest,
  onReplace,
  onAssign,
}) => {
  const getRoleColor = (role: AssignedStaffMember['role']) => {
    switch (role) {
      case 'Tour Guide':
        return 'text-purple-600';
      case 'Assistant Guide':
        return 'text-blue-600';
      case 'Driver':
        return 'text-sky-600';
      case 'Coordinator':
        return 'text-amber-600';
      case 'Photographer':
        return 'text-rose-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Assigned Team</h3>
        <button
          type="button"
          onClick={onAutoSuggest}
          className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-[#583BE8] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto Suggest Team</span>
        </button>
      </div>

      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
        {assignedTeam.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col items-center text-center justify-between min-w-[150px] sm:min-w-0 shrink-0 space-y-3"
          >
            <div className="space-y-1.5 flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider block ${getRoleColor(member.role)}`}>
                {member.role}
              </span>

              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-2xs"
                />
                {member.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>

              <h4 className="text-xs font-extrabold text-[#0F172A] truncate w-full" title={member.name}>
                {member.name}
              </h4>

              <a
                href={`tel:${member.phone}`}
                className="text-[10px] font-medium text-slate-500 hover:text-[#583BE8] flex items-center gap-1 transition-colors"
              >
                <span>{member.phone}</span>
                <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
              </a>

              <span className="text-[10px] font-semibold text-slate-400 block">
                📍 {member.experienceText}
              </span>
            </div>

            {member.isAssigned ? (
              <button
                type="button"
                onClick={() => onReplace?.(member.id)}
                className="w-full py-2 px-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAssign?.(member.role)}
                className="w-full py-2 px-3 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Assign</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedTeamCard;
