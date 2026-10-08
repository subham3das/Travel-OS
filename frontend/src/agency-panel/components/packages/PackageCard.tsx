import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Eye,
  Edit2,
  MoreVertical,
  Play,
  Pause,
  Archive,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { AgencyPackage, PackageStatus } from '../../data/packages';

interface PackageCardProps {
  pkg: AgencyPackage;
  index: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onArchive?: (id: string) => void;
  onHide?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  index,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onReschedule,
  onArchive,
  onHide,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: PackageStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Active
          </span>
        );
      case 'Inactive':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/50 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            Inactive
          </span>
        );
      case 'Draft':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/50 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            Draft
          </span>
        );
      case 'Hidden':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/50 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            Hidden
          </span>
        );
      case 'Archived':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/50 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  const isActive = pkg.status === 'Active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-slate-100/90 shadow-2xs hover:shadow-md hover:border-purple-200/60 transition-all select-none relative group flex items-start gap-2.5 sm:gap-3.5 min-w-0"
    >
      {/* 1. Left Column: Image Thumbnail */}
      <div
        onClick={() => onView(pkg.id)}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative cursor-pointer group-hover:opacity-95 transition-opacity"
      >
        <img
          src={pkg.coverImage}
          alt={pkg.packageName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* 2. Middle Column: Package Information */}
      <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch gap-1">
        {/* Title */}
        <div className="min-w-0">
          <h3
            onClick={() => onView(pkg.id)}
            className="font-extrabold text-xs sm:text-[13px] text-[#0F172A] truncate hover:text-[#583BE8] transition-colors cursor-pointer leading-snug"
            title={pkg.packageName}
          >
            {pkg.packageName}
          </h3>

          {/* Status & Readiness Badges */}
          <div className="pt-0.5 flex items-center gap-1.5 flex-wrap">
            {getStatusBadge(pkg.status)}
            {pkg.readiness && (
              pkg.readiness.isBookable ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300/60 inline-flex items-center gap-1">
                  Ready to Sell ✅
                </span>
              ) : (
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300/60 inline-flex items-center gap-1"
                  title={pkg.readiness.missingRequirements?.join(', ')}
                >
                  Needs Setup ⚠
                </span>
              )
            )}
          </div>

          {/* Missing setup warning pill & direct action CTA */}
          {pkg.readiness && !pkg.readiness.isBookable && pkg.readiness.missingRequirements && pkg.readiness.missingRequirements.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-1.5 py-0.5 max-w-fit">
                <span>⚠</span>
                <span className="truncate max-w-[190px]">{pkg.readiness.missingRequirements[0]}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (pkg.status === 'Draft') {
                    onEdit(pkg.id);
                  } else {
                    window.location.href = `/agency/departures?packageId=${pkg.id}`;
                  }
                }}
                className="text-[9px] font-extrabold text-[#583BE8] bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 transition-colors cursor-pointer"
              >
                {pkg.status === 'Draft' ? 'Publish Package →' : 'Schedule Departure →'}
              </button>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-500 truncate">
          <MapPin className="w-3 h-3 text-[#583BE8] shrink-0" />
          <span className="truncate">{pkg.destination}</span>
        </div>

        {/* Duration & Bookings */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-[9px] sm:text-[10px] font-semibold text-slate-500 truncate">
          <div className="flex items-center gap-1 truncate">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#583BE8] shrink-0" />
            <span className="truncate">{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1 truncate text-slate-400">
            <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
            <span className="truncate">{pkg.bookings} Bookings</span>
          </div>
        </div>

        {/* Price & Rating */}
        <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
          <span className="text-xs sm:text-sm font-black text-[#583BE8]">
            ₹{pkg.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400">
            / person
          </span>
          {pkg.rating > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 ml-auto sm:ml-1.5 shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
              <span>{pkg.rating}</span>
              <span className="text-slate-400 font-normal">({pkg.reviewCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Column: Action Buttons & 3-Dot Overflow Menu */}
      <div className="shrink-0 flex flex-col items-end justify-between self-stretch gap-1.5">
        {/* View Action Pill */}
        <button
          type="button"
          onClick={() => onView(pkg.id)}
          className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-purple-200 bg-white hover:bg-[#583BE8] hover:text-white hover:border-[#583BE8] text-[#583BE8] text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>View</span>
        </button>

        {/* Edit Action Pill */}
        <button
          type="button"
          onClick={() => onEdit(pkg.id)}
          className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-200 bg-white hover:border-purple-200 hover:text-[#583BE8] text-slate-700 text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>Edit</span>
        </button>

        {/* 3-Dot Overflow Menu */}
        <div className="relative mt-auto self-end" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="More Options"
          >
            <MoreVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 bottom-full mb-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 overflow-hidden"
              >
                {/* 1. Dynamic Activate / Deactivate Action */}
                {isActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDeactivate?.(pkg.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Deactivate Package</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onActivate?.(pkg.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                    <span>Activate Package</span>
                  </button>
                )}

                {/* 2. Edit Package */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(pkg.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Edit Package</span>
                </button>

                {/* 3. Schedule Departure */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onReschedule?.(pkg.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
                  <span>Schedule Departure</span>
                </button>

                {/* 4. Archive Package */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onArchive?.(pkg.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Archive Package</span>
                </button>

                {/* 5. Hide Package */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onHide?.(pkg.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{pkg.status === 'Hidden' ? 'Unhide Package' : 'Hide Package'}</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                {/* 6. Delete Package */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(pkg.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Delete Package</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
