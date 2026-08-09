import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Bus, UserCheck, CheckCircle2, Clock } from 'lucide-react';
import { TripOperationsData } from '../../data/tripDetails';

interface TripOperationsSummaryCardProps {
  operations: TripOperationsData;
  travelerCount: number;
}

export const TripOperationsSummaryCard: React.FC<TripOperationsSummaryCardProps> = ({
  operations,
  travelerCount,
}) => {
  const { completionPercentage, status, teamAssignments, vehicleAssignments } = operations;
  const isPendingSetup = status === 'Pending Setup';
  const teamCount = teamAssignments?.length ?? 0;
  const vehicleCount = vehicleAssignments?.length ?? 0;

  const stats = [
    {
      icon: <Users className="w-4 h-4 text-[#583BE8]" />,
      label: 'Team Members',
      value: teamCount === 0 ? 'Not Assigned' : `${teamCount} Assigned`,
      valueColor: teamCount === 0 ? 'text-slate-400' : 'text-emerald-700',
    },
    {
      icon: <Bus className="w-4 h-4 text-[#583BE8]" />,
      label: 'Vehicles',
      value: vehicleCount === 0 ? 'Not Assigned' : `${vehicleCount} Vehicle${vehicleCount > 1 ? 's' : ''}`,
      valueColor: vehicleCount === 0 ? 'text-slate-400' : 'text-emerald-700',
    },
    {
      icon: <UserCheck className="w-4 h-4 text-[#583BE8]" />,
      label: 'Travelers',
      value: `${travelerCount} Enrolled`,
      valueColor: 'text-[#0F172A]',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 select-none"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#583BE8]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Trip Operations</h3>
            <p className="text-[11px] font-semibold text-slate-400">Complete all sections to activate trip</p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold ${
            isPendingSetup
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          {isPendingSetup ? (
            <Clock className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>{status}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Completion Progress</span>
          <span
            className={`font-extrabold ${
              completionPercentage === 100 ? 'text-emerald-600' : 'text-[#583BE8]'
            }`}
          >
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all duration-500 ${
              completionPercentage === 100 ? 'bg-emerald-500' : 'bg-[#583BE8]'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-xs">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-center"
          >
            {stat.icon}
            <span className={`font-extrabold text-[11px] leading-tight ${stat.valueColor}`}>
              {stat.value}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{stat.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TripOperationsSummaryCard;
