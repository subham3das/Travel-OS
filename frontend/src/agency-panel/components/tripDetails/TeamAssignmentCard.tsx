import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, CheckCircle2, ChevronRight, Phone, Shield, Truck, Star, Camera, HeartPulse } from 'lucide-react';
import { AssignedTeamMember } from '../../data/tripDetails';

const ROLE_ICON: Record<string, React.ReactNode> = {
  'Trip Manager': <Shield className="w-3.5 h-3.5 text-[#583BE8]" />,
  'Trip Host': <Star className="w-3.5 h-3.5 text-amber-500" />,
  'Guide': <Users className="w-3.5 h-3.5 text-emerald-600" />,
  'Driver': <Truck className="w-3.5 h-3.5 text-sky-600" />,
  'Support Staff': <Users className="w-3.5 h-3.5 text-slate-500" />,
  'Photographer': <Camera className="w-3.5 h-3.5 text-purple-500" />,
  'Medical Staff': <HeartPulse className="w-3.5 h-3.5 text-rose-500" />,
};

interface TeamAssignmentCardProps {
  tripId: string;
  assignedTeam: AssignedTeamMember[] | null;
  onNavigateToTeam: () => void;
}

export const TeamAssignmentCard: React.FC<TeamAssignmentCardProps> = ({
  tripId,
  assignedTeam,
  onNavigateToTeam,
}) => {
  const hasTeam = assignedTeam && assignedTeam.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#583BE8]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0F172A]">Assigned Team</h3>
            <p className="text-[11px] font-semibold text-slate-400">
              {hasTeam ? `${assignedTeam!.length} member${assignedTeam!.length > 1 ? 's' : ''} assigned` : 'No team assigned yet'}
            </p>
          </div>
        </div>

        {/* Status badge */}
        {hasTeam ? (
          <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        ) : (
          <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Pending
          </span>
        )}
      </div>

      {/* Empty State */}
      {!hasTeam && (
        <div className="py-6 flex flex-col items-center justify-center gap-3 border border-dashed border-slate-200 rounded-2xl bg-slate-50/60">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-[#583BE8]" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-extrabold text-[#0F172A]">No team assigned yet</p>
            <p className="text-[11px] font-medium text-slate-400">Assign Trip Manager, Host, Guide & Driver</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToTeam}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Assign Team</span>
          </button>
        </div>
      )}

      {/* Populated State — shows assigned team members */}
      {hasTeam && (
        <div className="space-y-2.5">
          {/* Success Banner */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-900">Assigned Successfully</p>
          </div>

          {/* Team Member Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignedTeam!.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {ROLE_ICON[member.role]}
                    <span className="text-[10px] font-bold text-slate-500">{member.role}</span>
                  </div>
                  <p className="text-xs font-extrabold text-[#0F172A] truncate">{member.name}</p>
                  {member.phone && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-medium">{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Edit button */}
          <button
            type="button"
            onClick={onNavigateToTeam}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-600 hover:text-[#583BE8] text-xs font-extrabold transition-all cursor-pointer"
          >
            <span>Manage Team</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TeamAssignmentCard;
