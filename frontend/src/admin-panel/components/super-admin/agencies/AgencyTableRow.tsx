import React, { useState, useRef, useEffect } from 'react';
import { Star, MoreVertical, Eye, Edit, ShieldCheck, PauseCircle, PlayCircle, XCircle, Trash2 } from 'lucide-react';
import { Agency } from '../../../types/agency';
import { AgencyStatusBadge } from './AgencyStatusBadge';
import { VerificationBadge } from './VerificationBadge';

interface AgencyTableRowProps {
  agency: Agency;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (agency: Agency) => void;
  onAction: (actionType: string, agency: Agency) => void;
}

export const AgencyTableRow: React.FC<AgencyTableRowProps> = ({
  agency,
  isSelected,
  onToggleSelect,
  onViewDetails,
  onAction,
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

  return (
    <tr
      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs font-semibold text-[#0F172A] group ${
        isSelected ? 'bg-[#EEF2FF]/40' : ''
      }`}
    >
      {/* Checkbox */}
      <td className="p-3.5 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(agency.id)}
          className="w-4 h-4 rounded text-[#6356E5] border-slate-300 focus:ring-[#6356E5] cursor-pointer"
        />
      </td>

      {/* Agency Logo + Name + GST */}
      <td className="py-3 px-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onViewDetails(agency)}
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
            <img
              src={agency.logo}
              alt={agency.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-[#0F172A] text-xs truncate group-hover:text-[#6356E5] transition-colors leading-tight">
              {agency.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 leading-tight mt-0.5">
              GST: {agency.gstNumber}
            </p>
          </div>
        </div>
      </td>

      {/* Owner */}
      <td className="py-3 px-3 text-slate-700 font-bold truncate">{agency.owner.name}</td>

      {/* Email */}
      <td className="py-3 px-3 text-slate-500 font-medium truncate">{agency.email}</td>

      {/* Phone */}
      <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">{agency.phone}</td>

      {/* Business Type */}
      <td className="py-3 px-3 text-slate-600 font-bold whitespace-nowrap">
        {agency.businessType}
      </td>

      {/* City */}
      <td className="py-3 px-3 text-slate-600 font-bold whitespace-nowrap">{agency.city}</td>

      {/* Rating */}
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-[#0F172A]">{agency.rating}</span>
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-400">({agency.reviewCount})</span>
        </div>
      </td>

      {/* Packages */}
      <td className="py-3 px-3 text-center font-black text-[#0F172A]">{agency.packages}</td>

      {/* Bookings */}
      <td className="py-3 px-3 text-center font-black text-[#0F172A]">
        {agency.bookings.toLocaleString()}
      </td>

      {/* Revenue */}
      <td className="py-3 px-3 text-right font-black text-[#0F172A] whitespace-nowrap">
        {agency.revenue}
      </td>

      {/* Verification */}
      <td className="py-3 px-3 text-center">
        <VerificationBadge status={agency.verification} />
      </td>

      {/* Status */}
      <td className="py-3 px-3 text-center">
        <AgencyStatusBadge status={agency.status} />
      </td>

      {/* Join Date */}
      <td className="py-3 px-3 text-slate-400 font-bold whitespace-nowrap">{agency.joinDate}</td>

      {/* Actions Dropdown */}
      <td className="py-3 px-3 text-center relative">
        <div ref={menuRef} className="inline-block">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 text-left space-y-0.5">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onViewDetails(agency);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onAction('edit', agency);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Agency</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onAction('verify', agency);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verify Agency</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onAction('activate', agency);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Activate</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onAction('suspend', agency);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-amber-50 text-amber-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Suspend</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onAction('reject', agency);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Reject</span>
              </button>

              <div className="border-t border-slate-100 pt-0.5">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onAction('delete', agency);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
