import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ManageTeamHeaderProps {
  tripId: string;
}

export const ManageTeamHeader: React.FC<ManageTeamHeaderProps> = ({ tripId }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
      <button
        type="button"
        onClick={() => navigate(`/agency/trips/${tripId}`)}
        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Trip Details</span>
      </button>

      <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Manage Team</h2>

      {/* Spacer for title centering */}
      <div className="w-16 sm:w-24" />
    </div>
  );
};

export default ManageTeamHeader;
