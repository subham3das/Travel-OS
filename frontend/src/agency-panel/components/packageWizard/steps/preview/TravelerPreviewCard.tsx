import React, { useState } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import { TravelerPreviewModal } from './TravelerPreviewModal';

export const TravelerPreviewCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-4 sm:p-5 rounded-3xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white border border-purple-100 text-[#583BE8] flex items-center justify-center shrink-0 shadow-xs">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">Traveler Preview</h4>
            <p className="text-[11px] font-semibold text-slate-400">See exactly what travelers will see</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <span>Preview as Traveler</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <TravelerPreviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default TravelerPreviewCard;
