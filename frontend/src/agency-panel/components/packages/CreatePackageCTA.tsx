import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface CreatePackageCTAProps {
  onCreatePackage: () => void;
}

export const CreatePackageCTA: React.FC<CreatePackageCTAProps> = ({ onCreatePackage }) => {
  return (
    <div className="rounded-3xl p-5 border-2 border-dashed border-purple-200 bg-purple-50/20 flex flex-col sm:flex-row items-center justify-between gap-4 select-none mt-6">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-[#583BE8] flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 stroke-[1.8]" />
        </div>

        <div className="text-center sm:text-left">
          <h4 className="text-sm font-extrabold text-[#0F172A]">No more packages found</h4>
          <p className="text-xs font-semibold text-slate-400">Looks like you've reached the end.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreatePackage}
        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-[#583BE8] bg-white hover:bg-[#583BE8] hover:text-white text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Create New Package</span>
      </button>
    </div>
  );
};

export default CreatePackageCTA;
