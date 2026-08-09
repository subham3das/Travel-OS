import React from 'react';
import { Users, User } from 'lucide-react';
import { ConversationCompanion } from '../../data/inbox';

interface TravelCompanionCardProps {
  companions: ConversationCompanion[];
}

export const TravelCompanionCard: React.FC<TravelCompanionCardProps> = ({ companions }) => {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#583BE8]" />
          Traveling With ({companions.length})
        </h4>
        <span className="text-[10px] font-extrabold text-slate-400">Group Booking</span>
      </div>

      <div className="space-y-2">
        {companions.map((comp) => (
          <div key={comp.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-100 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <img src={comp.avatar} alt={comp.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
              <span className="font-extrabold text-[#0F172A] truncate">{comp.name}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[#583BE8] border border-purple-100 shrink-0">
              {comp.relationship}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelCompanionCard;
