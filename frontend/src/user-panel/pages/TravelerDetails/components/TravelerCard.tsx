import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export interface AdditionalTraveler {
  id: string;
  name: string;
  age: string;
  gender: string;
  type: 'Adult' | 'Child';
}

interface TravelerCardProps {
  index: number;
  traveler: AdditionalTraveler;
  onEdit: (traveler: AdditionalTraveler) => void;
  onDelete: (id: string) => void;
}

export const TravelerCard: React.FC<TravelerCardProps> = ({
  index,
  traveler,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-full bg-[#F5F3FF] text-[#6356E5] font-black flex items-center justify-center text-xs shrink-0">
          {index + 2}
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-[#0F172A]">{traveler.name}</h3>
          <p className="text-xs font-semibold text-slate-400">
            {traveler.age} Years, {traveler.gender} ({traveler.type})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(traveler)}
          className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Edit traveler"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(traveler.id)}
          className="p-2 rounded-xl hover:bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
          title="Delete traveler"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
