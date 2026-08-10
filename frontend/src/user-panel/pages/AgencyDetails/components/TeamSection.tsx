import React from 'react';
import { Linkedin } from 'lucide-react';
import { TeamMember } from '../../../types/agency';
import { useToast } from '../../../context/ToastContext';

interface TeamSectionProps {
  team: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const { showToast } = useToast();
  if (!team || team.length === 0) return null;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Meet Our Team
        </h3>
        <button
          onClick={() => showToast('Agency verified team roster active', 'info')}
          className="text-xs sm:text-sm font-bold text-[#6356E5] hover:underline focus:outline-none cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs text-center space-y-2 hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto border-2 border-slate-100 bg-slate-100">
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{member.name}</h4>
              <p className="text-[11px] font-semibold text-slate-500">{member.role}</p>
              <p className="text-[10px] font-medium text-slate-400">{member.experience}</p>
            </div>

            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-xs"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
