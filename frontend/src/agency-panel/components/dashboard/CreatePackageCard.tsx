import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreatePackageCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/agency/packages/create')}
      className="bg-gradient-to-r from-[#583BE8] to-[#7A5FF3] text-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-[#583BE8]/25 hover:shadow-xl hover:scale-[1.005] active:scale-[0.99] transition-all cursor-pointer select-none flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-white text-[#583BE8] flex items-center justify-center shrink-0 shadow-md">
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
            Create New Package
          </h3>
          <p className="text-xs text-purple-100 font-medium">Add a new tour package</p>
        </div>
      </div>

      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
        <ChevronRight className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

export default CreatePackageCard;
