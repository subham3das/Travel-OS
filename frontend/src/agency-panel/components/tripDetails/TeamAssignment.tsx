import React from 'react';
import { PhoneCall } from 'lucide-react';
import { TeamMember } from '../../data/tripDetails';

interface TeamAssignmentProps {
  team: TeamMember[];
  onManageTeam?: () => void;
}

export const TeamAssignment: React.FC<TeamAssignmentProps> = ({ team, onManageTeam }) => {
  const getRoleBadge = (role: TeamMember['role']) => {
    switch (role) {
      case 'Tour Guide':
        return 'text-purple-600';
      case 'Driver':
        return 'text-sky-600';
      case 'Coordinator':
        return 'text-amber-600';
      case 'Vehicle':
        return 'text-emerald-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Team Assignment</h3>
        <button
          type="button"
          onClick={onManageTeam}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
        >
          Manage Team
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {team.map((member) => (
          <div
            key={member.id}
            onClick={onManageTeam}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-100/80 hover:border-purple-200 transition-all flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
            />

            <div className="min-w-0 flex-1 space-y-0.5">
              <span className={`text-[10px] font-black uppercase tracking-wider block ${getRoleBadge(member.role)}`}>
                {member.role}
              </span>
              <h4 className="text-xs font-extrabold text-[#0F172A] group-hover:text-[#583BE8] transition-colors truncate">
                {member.name}
              </h4>

              {member.phone ? (
                <a
                  href={`tel:${member.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-medium text-slate-500 hover:text-[#583BE8] flex items-center gap-1 transition-colors"
                >
                  <span className="truncate">{member.phone}</span>
                  <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
                </a>
              ) : (
                <p className="text-[11px] font-medium text-slate-400">{member.type}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamAssignment;
