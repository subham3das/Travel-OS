import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Eye, UserCheck, FileText, PauseCircle, Trash2 } from 'lucide-react';
import { AgencyRequestItem } from '../../../types/agencyRequest';

interface AgencyRequestTableRowProps {
  request: AgencyRequestItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDrawer: (request: AgencyRequestItem) => void;
  onRowAction: (actionType: string, request: AgencyRequestItem) => void;
}

export const AgencyRequestTableRow: React.FC<AgencyRequestTableRowProps> = ({
  request,
  isSelected,
  onToggleSelect,
  onOpenDrawer,
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

  // Document ratio badge styling (6/6 = green, 4/6 or 5/6 = orange, 2/6 or 3/6 = red)
  const getDocBadgeStyle = () => {
    const ratio = request.documentsUploadedCount / request.documentsTotalCount;
    if (ratio === 1) return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
    if (ratio >= 0.6) return 'bg-amber-50 text-amber-600 border-amber-100 font-extrabold';
    return 'bg-rose-50 text-rose-600 border-rose-100 font-extrabold';
  };

  // Verification badge styling
  const getVerificationStyle = () => {
    switch (request.verificationStatus) {
      case 'Complete':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Under Review':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Missing Docs':
      default:
        return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  // Review Status badge styling
  const getReviewStatusStyle = () => {
    switch (request.reviewStatus) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Under Review':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Rejected':
      default:
        return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs font-semibold text-[#0F172A] group ${
        isSelected ? 'bg-[#EEF2FF]/40' : ''
      }`}
    >
      {/* Checkbox */}
      <td className="p-3.5 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(request.id)}
          className="w-4 h-4 rounded text-[#6356E5] border-slate-300 focus:ring-[#6356E5] cursor-pointer"
        />
      </td>

      {/* Agency Logo + Name + Application ID */}
      <td className="py-3 px-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onOpenDrawer(request)}
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
            <img
              src={request.logo}
              alt={request.agencyName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-[#0F172A] text-xs truncate group-hover:text-[#6356E5] transition-colors leading-tight">
              {request.agencyName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 leading-tight mt-0.5">
              {request.applicationId}
            </p>
          </div>
        </div>
      </td>

      {/* Owner Name */}
      <td className="py-3 px-3 text-slate-700 font-bold truncate">{request.ownerName}</td>

      {/* Email */}
      <td className="py-3 px-3 text-slate-500 font-medium truncate">{request.ownerEmail}</td>

      {/* Phone */}
      <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
        {request.ownerPhone}
      </td>

      {/* Business Type */}
      <td className="py-3 px-3 text-slate-600 font-bold whitespace-nowrap">
        {request.businessType}
      </td>

      {/* Submitted Date */}
      <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
        {request.submittedDate}
      </td>

      {/* Documents Progress Ratio */}
      <td className="py-3 px-3 text-center">
        <span
          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] border ${getDocBadgeStyle()}`}
        >
          {request.documentsUploadedCount}/{request.documentsTotalCount}
        </span>
      </td>

      {/* Verification Badge */}
      <td className="py-3 px-3 text-center">
        <span
          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${getVerificationStyle()}`}
        >
          {request.verificationStatus}
        </span>
      </td>

      {/* Review Status Badge */}
      <td className="py-3 px-3 text-center">
        <span
          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getReviewStatusStyle()}`}
        >
          {request.reviewStatus}
        </span>
      </td>

      {/* Actions: Review CTA + Three-dot Menu */}
      <td className="py-3 px-3 text-center relative">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => onOpenDrawer(request)}
            className="px-3 py-1.5 rounded-xl bg-[#EEF2FF] border border-[#6356E5]/20 hover:bg-[#6356E5] hover:text-white text-[#6356E5] text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
          >
            Review
          </button>

          <div ref={menuRef} className="inline-block">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 text-left space-y-0.5 select-none">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenDrawer(request);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('assign_reviewer', request);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assign Reviewer</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('download_docs', request);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download Docs</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('suspend_review', request);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-amber-50 text-amber-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Suspend Review</span>
                </button>

                <div className="border-t border-slate-100 pt-0.5">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRowAction('delete', request);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete Request</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </motion.tr>
  );
};
