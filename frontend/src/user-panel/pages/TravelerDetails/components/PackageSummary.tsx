import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Edit3, Calendar, Users, Tag } from 'lucide-react';
import { TourPackage } from '../../../types/package';

interface PackageSummaryProps {
  pkg: TourPackage;
  travelerCount?: number;
  totalPrice?: number;
}

export const PackageSummary: React.FC<PackageSummaryProps> = ({
  pkg,
  travelerCount = 2,
  totalPrice = 24999,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Left Cover Image */}
        <div className="relative w-full sm:w-32 h-36 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={pkg.coverImage}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Info */}
        <div className="flex-1 space-y-2.5 w-full">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-snug">
                {pkg.title}
              </h2>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <span>by</span>
                <span className="text-[#0F172A] font-extrabold">{pkg.agencyName}</span>
                {pkg.agencyVerified !== false && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
                )}
              </p>
            </div>

            <button
              onClick={() => navigate(`/package/${pkg.id}`)}
              className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5 pt-1 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-100">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{pkg.duration}</p>
                <p className="text-xs font-extrabold text-[#0F172A]">12 – 18 May, 2024</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-100">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{travelerCount} Travelers</p>
                <p className="text-xs font-extrabold text-[#0F172A]">1 Adult, 1 Child</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-100">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Total Price</p>
                <p className="text-xs font-black text-[#0F172A]">₹{totalPrice.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
