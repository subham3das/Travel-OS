import React from 'react';
import { DetailedPackage } from '../../../data/packageDetails';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Edit3,
  Copy,
  PauseCircle,
  Share2,
  Tag,
  Mountain,
} from 'lucide-react';

interface PackageHeroProps {
  pkg: DetailedPackage;
  onEdit: () => void;
  onDuplicate: () => void;
  onPause: () => void;
  onShare: () => void;
}

export const PackageHero: React.FC<PackageHeroProps> = ({
  pkg,
  onEdit,
  onDuplicate,
  onPause,
  onShare,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden select-none">
      {/* Cover Image Container */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={pkg.coverImage}
          alt={pkg.packageName}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              pkg.status === 'Active'
                ? 'bg-emerald-500 text-white'
                : pkg.status === 'Draft'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-white'
            }`}
          >
            {pkg.status}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onShare}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Share Package"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg">
              <Tag className="w-3.5 h-3.5 text-purple-300" />
              {pkg.packageType}
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg">
              <Mountain className="w-3.5 h-3.5 text-amber-300" />
              {pkg.tripDifficulty}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
            {pkg.packageName}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 truncate">
            <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{pkg.destination}</span>
          </div>
        </div>
      </div>

      {/* Hero Stats & Primary Actions Bar */}
      <div className="p-4 sm:p-6 space-y-4 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
            <span className="text-xs sm:text-sm font-black text-[#0F172A] flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#583BE8]" />
              {pkg.duration}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Starting Price</span>
            <span className="text-xs sm:text-sm font-black text-[#583BE8]">
              ₹{pkg.price.toLocaleString('en-IN')}{' '}
              <span className="text-[10px] font-normal text-slate-400 line-through">
                ₹{pkg.originalPrice.toLocaleString('en-IN')}
              </span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Rating</span>
            <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {pkg.rating} ({pkg.reviewCount} reviews)
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Bookings</span>
            <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1">
              <Users className="w-4 h-4 text-emerald-600" />
              {pkg.totalBookings} Travelers
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Package</span>
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={onPause}
            className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PauseCircle className="w-4 h-4 text-amber-600" />
            <span>{pkg.status === 'Active' ? 'Pause Booking' : 'Resume Booking'}</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageHero;
