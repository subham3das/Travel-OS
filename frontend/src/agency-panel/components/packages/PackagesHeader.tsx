import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PackagesHeaderProps {
  onCreatePackage?: () => void;
  hasActiveDraft?: boolean;
  onResumeDraft?: () => void;
}

export const PackagesHeader: React.FC<PackagesHeaderProps> = ({
  onCreatePackage,
  hasActiveDraft = false,
  onResumeDraft,
}) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    if (onCreatePackage) {
      onCreatePackage();
    } else {
      navigate('/agency/packages/create');
    }
  };

  const handleResume = () => {
    if (onResumeDraft) {
      onResumeDraft();
    } else {
      navigate('/agency/packages/create');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">Packages</h2>
        <p className="text-xs font-semibold text-slate-400">Manage all your travel packages</p>
      </div>

      <div className="flex items-center gap-2">
        {hasActiveDraft && (
          <button
            type="button"
            onClick={handleResume}
            className="px-3.5 py-2.5 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Resume Draft</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#583BE8]/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Package</span>
        </button>
      </div>
    </div>
  );
};

export default PackagesHeader;
