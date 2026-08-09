import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones } from 'lucide-react';

interface SupportCardProps {
  agencyId?: string;
}

export const SupportCard: React.FC<SupportCardProps> = ({ agencyId = 'agency-001' }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm font-extrabold text-[#0F172A] tracking-tight">
            Need Help?
          </h3>
          <p className="text-xs font-semibold text-slate-500 leading-snug">
            Contact your travel agency for any assistance related to your booking.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/agency/${agencyId}`)}
        className="px-4 py-2 rounded-2xl border border-[#6356E5] text-[#6356E5] hover:bg-purple-50 text-xs font-black transition-all cursor-pointer shrink-0 focus:outline-none text-center"
      >
        Contact Agency
      </button>
    </div>
  );
};
