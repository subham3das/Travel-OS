import React from 'react';
import { Gauge, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TripDifficulty } from '../../../types/packageWizard';

interface DifficultySummaryCardProps {
  difficulty: TripDifficulty | null;
}

export const DifficultySummaryCard: React.FC<DifficultySummaryCardProps> = ({ difficulty }) => {
  const navigate = useNavigate();

  const getDifficultyBadge = (diff: TripDifficulty | null) => {
    switch (diff) {
      case 'Easy':
        return <span className="text-xs font-black text-emerald-600">Easy</span>;
      case 'Moderate':
        return <span className="text-xs font-black text-amber-600">Moderate</span>;
      case 'Difficult':
        return <span className="text-xs font-black text-rose-600">Difficult</span>;
      default:
        return <span className="text-xs font-black text-slate-400">Not set</span>;
    }
  };

  return (
    <div className="bg-slate-50/70 rounded-3xl p-4 border border-slate-200/60 flex items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-purple-100/70 text-[#583BE8] flex items-center justify-center shrink-0">
          <Gauge className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400">Difficulty (from previous step)</p>
          <div className="flex items-center gap-1.5">{getDifficultyBadge(difficulty)}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/agency/packages/create')}
        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <Edit2 className="w-3.5 h-3.5 text-[#583BE8]" />
        <span>Edit Basic Info</span>
      </button>
    </div>
  );
};

export default DifficultySummaryCard;
