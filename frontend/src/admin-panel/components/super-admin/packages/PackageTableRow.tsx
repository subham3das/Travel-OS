import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Eye,
  Edit,
  CheckCircle2,
  Star,
  EyeOff,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { AdminPackageItem } from '../../../types/packageManagement';

interface PackageTableRowProps {
  pkg: AdminPackageItem;
  isSelected: boolean;
  isDrawerSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSelectPackage: (pkg: AdminPackageItem) => void;
  onRowAction: (actionType: string, pkg: AdminPackageItem) => void;
}

export const PackageTableRow: React.FC<PackageTableRowProps> = ({
  pkg,
  isSelected,
  isDrawerSelected,
  onToggleSelect,
  onSelectPackage,
  onRowAction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSeatsBadgeStyle = () => {
    if (pkg.availableSeats === 0) {
      return 'bg-rose-50 text-rose-600 border-rose-200/80 font-black';
    }
    if (pkg.availableSeats <= 5) {
      return 'bg-amber-50 text-amber-700 border-amber-200/80 font-black';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-extrabold';
  };

  const getStatusStyle = () => {
    switch (pkg.status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100 font-extrabold';
      case 'Sold Out':
        return 'bg-rose-50 text-rose-600 border-rose-100 font-black';
      case 'Draft':
        return 'bg-blue-50 text-blue-600 border-blue-100 font-bold';
      case 'Hidden':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 font-bold';
    }
  };

  const getApprovalStyle = () => {
    switch (pkg.approvalStatus) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100 font-extrabold';
      case 'Rejected':
        return 'bg-rose-50 text-rose-600 border-rose-100 font-extrabold';
      case '—':
      default:
        return 'text-slate-400 font-bold';
    }
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelectPackage(pkg)}
      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs font-semibold text-[#0F172A] cursor-pointer group select-none ${
        isDrawerSelected ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF]/80' : isSelected ? 'bg-[#EEF2FF]/40' : ''
      }`}
    >
      {/* Checkbox */}
      <td
        className="py-3 pl-4 pr-2 w-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(pkg.id);
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(pkg.id)}
          className="w-4 h-4 rounded text-[#6356E5] focus:ring-0 cursor-pointer"
        />
      </td>

      {/* Package (Thumbnail + Name + Subtitle) */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-3 min-w-[210px]">
          <img
            src={pkg.coverImage}
            alt={pkg.title}
            className="w-12 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate">
                {pkg.title}
              </span>
              {pkg.isFeatured && (
                <span className="text-[10px] text-amber-500 font-black">★</span>
              )}
            </div>
            <p className="text-[10px] font-semibold text-slate-400 truncate max-w-[170px]">
              {pkg.subtitle}
            </p>
          </div>
        </div>
      </td>

      {/* Package ID */}
      <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-600 whitespace-nowrap">
        {pkg.packageId}
      </td>

      {/* Agency */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2 min-w-[140px]">
          <img
            src={pkg.agencyLogo}
            alt={pkg.agencyName}
            className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <span className="font-bold text-slate-700 truncate">{pkg.agencyName}</span>
        </div>
      </td>

      {/* Destination */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-sm">{pkg.destinationFlag}</span>
          <div>
            <p className="font-extrabold text-[#0F172A] text-[11px]">{pkg.destinationCountry}</p>
            <p className="text-[10px] font-semibold text-slate-400">{pkg.destinationRegion}</p>
          </div>
        </div>
      </td>

      {/* Duration */}
      <td className="py-3 px-3 font-bold text-slate-600 whitespace-nowrap">
        {pkg.durationText}
      </td>

      {/* Price */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span className="font-black text-[#0F172A] block">{pkg.currentPrice}</span>
        <span className="text-[10px] font-bold text-slate-400 line-through">
          {pkg.originalPrice}
        </span>
      </td>

      {/* Seats */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getSeatsBadgeStyle()}`}
        >
          {pkg.availableSeats} / {pkg.totalSeats}
        </span>
      </td>

      {/* Bookings */}
      <td className="py-3 px-3 font-bold text-[#0F172A] text-center">
        {pkg.bookingsCount}
      </td>

      {/* Rating */}
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex items-center gap-1 font-extrabold text-[#0F172A]">
          <span>{pkg.rating}</span>
          <span className="text-amber-500">★</span>
          <span className="text-[10px] font-semibold text-slate-400">({pkg.reviewCount})</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getStatusStyle()}`}
        >
          {pkg.status}
        </span>
      </td>

      {/* Approval Status */}
      <td className="py-3 px-3 whitespace-nowrap">
        {pkg.approvalStatus === '—' ? (
          <span className="text-slate-400 font-bold pl-2">—</span>
        ) : (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getApprovalStyle()}`}
          >
            {pkg.approvalStatus}
          </span>
        )}
      </td>

      {/* Last Updated */}
      <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
        {pkg.lastUpdated}
      </td>

      {/* Actions */}
      <td
        className="py-3 pr-4 pl-2 text-right relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 text-left select-none">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('view', pkg);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('edit', pkg);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Package</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('approve', pkg);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Approve Package</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('feature', pkg);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 text-[#6356E5] text-xs font-bold transition-colors cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-[#6356E5]" />
                <span>{pkg.isFeatured ? 'Unfeature Package' : 'Feature Package'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('hide', pkg);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-amber-50 text-amber-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                <span>{pkg.status === 'Hidden' ? 'Unhide Package' : 'Hide Package'}</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('delete', pkg);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete Package</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};
