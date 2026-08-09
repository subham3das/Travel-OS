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
  Copy,
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
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onHide?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  index,
  onView,
  onEdit,
  onDuplicate,
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
            Active
          </span>
        );
      case 'Draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
            Draft
          </span>
        );
      case 'Hidden':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
            Hidden
          </span>
        );
      case 'Archived':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500">
            Archived
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-4 select-none relative"
    >
      {/* Cover Image */}
      <div className="w-full sm:w-36 h-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 relative bg-slate-100">
        <img
          src={pkg.coverImage}
          alt={pkg.packageName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-extrabold text-white sm:hidden">
          {pkg.packageType}
        </span>
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title + Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-extrabold text-[#0F172A] truncate">{pkg.packageName}</h3>
          {getStatusBadge(pkg.status)}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#583BE8] shrink-0" />
          <span className="truncate">{pkg.destination}</span>
        </div>

        {/* Duration + Bookings */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{pkg.bookings} Bookings</span>
          </div>
        </div>

        {/* Price + Rating */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#583BE8]">
              ₹{pkg.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">/ person</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-extrabold">
            <Star
              className={`w-3.5 h-3.5 ${
                pkg.rating > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
              }`}
            />
            {pkg.rating > 0 ? (
              <span className="text-slate-700">
                {pkg.rating} <span className="text-slate-400 font-semibold">({pkg.reviewCount} reviews)</span>
              </span>
            ) : (
              <span className="text-slate-400 font-semibold">No reviews yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons (Right side on desktop, bottom-right on mobile) */}
      <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onView(pkg.id)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-[#583BE8] hover:text-white hover:border-[#583BE8] text-[#583BE8] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-[80px]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(pkg.id)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 bg-white hover:border-purple-200 hover:text-[#583BE8] text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-[80px]"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Overflow Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 sm:right-0 bottom-8 sm:bottom-auto sm:top-8 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate ? onDuplicate(pkg.id) : alert(`Duplicated package ${pkg.packageName}`);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duplicate Package</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onArchive ? onArchive(pkg.id) : alert(`Archived package ${pkg.packageName}`);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-400" />
                  <span>Archive</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onHide ? onHide(pkg.id) : alert(`Status changed for ${pkg.packageName}`);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pkg.status === 'Hidden' ? 'Show Package' : 'Hide'}</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete ? onDelete(pkg.id) : alert(`Deleted package ${pkg.packageName}`);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete</span>
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
