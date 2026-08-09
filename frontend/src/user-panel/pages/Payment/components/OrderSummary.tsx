import React from 'react';
import { CheckCircle2, Calendar, Users, Tag, ShieldCheck } from 'lucide-react';
import { TourPackage } from '../../../types/package';

interface OrderSummaryProps {
  pkg: TourPackage;
  travelerCount?: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  pkg,
  travelerCount = 2,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-soft hover:shadow-soft-lg transition-all space-y-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Left Cover Image with Badge */}
        <div className="relative w-full sm:w-36 h-40 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0 group">
          <img
            src={pkg.coverImage}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-2 left-2 right-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-[#0F172A] shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#6356E5]" />
              Verified Package
            </span>
          </div>
        </div>

        {/* Right Info Details */}
        <div className="flex-1 space-y-3 w-full">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight leading-snug">
              {pkg.title}
            </h2>
            <div className="flex items-center gap-1.5 pt-1 text-xs font-extrabold text-slate-500">
              <span>by</span>
              <span className="text-[#0F172A] font-black hover:text-[#6356E5] transition-colors cursor-pointer">
                {pkg.agencyName}
              </span>
              {pkg.agencyVerified !== false && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
              )}
            </div>
          </div>

          {/* 3 Metric Pills Grid */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5 text-xs font-bold">
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-purple-50/50 hover:border-purple-100 transition-all">
              <div className="w-8 h-8 rounded-xl bg-purple-100/70 text-[#6356E5] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#0F172A] truncate">12 – 18 May, 2024</p>
                <p className="text-[10px] font-bold text-slate-400 truncate">{pkg.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-sky-50/50 hover:border-sky-100 transition-all">
              <div className="w-8 h-8 rounded-xl bg-sky-100/70 text-sky-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#0F172A] truncate">{travelerCount} Travelers</p>
                <p className="text-[10px] font-bold text-slate-400 truncate">1 Adult, 1 Child</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-amber-50/50 hover:border-amber-100 transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#0F172A] truncate">Package ID</p>
                <p className="text-[10px] font-bold text-slate-400 truncate">APTRIP-78291</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
