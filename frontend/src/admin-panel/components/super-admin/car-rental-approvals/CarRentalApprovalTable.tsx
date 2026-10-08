import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Car,
  FileText,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { CarRentalApprovalItem } from '../../../types/carRentalApproval';

interface CarRentalApprovalTableProps {
  requests: CarRentalApprovalItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onOpenDrawer: (request: CarRentalApprovalItem) => void;
  onApprove: (request: CarRentalApprovalItem) => void;
  onReject: (request: CarRentalApprovalItem) => void;
  onRequestChanges: (request: CarRentalApprovalItem) => void;
  onRowAction?: (action: string, request: CarRentalApprovalItem) => void;
}

export const CarRentalApprovalTable: React.FC<CarRentalApprovalTableProps> = ({
  requests,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onOpenDrawer,
  onApprove,
  onReject,
  onRequestChanges,
  onRowAction,
}) => {
  const [activeActionMenu, setActiveActionMenu] = useState<{
    id: string;
    coords: { top: number; left: number; openUpwards: boolean };
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = (e: React.MouseEvent, reqId: string) => {
    e.stopPropagation();
    if (activeActionMenu?.id === reqId) {
      setActiveActionMenu(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpwards = spaceBelow < 220 && rect.top > 220;
      const menuWidth = 176; // w-44 = 176px
      const left = Math.max(10, Math.min(window.innerWidth - menuWidth - 10, rect.right - menuWidth));
      const top = openUpwards ? rect.top - 6 : rect.bottom + 6;
      setActiveActionMenu({
        id: reqId,
        coords: { top, left, openUpwards },
      });
    }
  };

  useEffect(() => {
    if (!activeActionMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveActionMenu(null);
      }
    };
    const handleScrollOrResize = () => {
      setActiveActionMenu(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveActionMenu(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeActionMenu]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-600 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-violet-50 text-violet-600 border border-violet-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Needs Changes
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Suspended
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-600 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Under Review
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-600 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending Review
          </span>
        );
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center select-none shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[#6356E5]/10 text-[#6356E5] flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-[#0F172A]">No Applications Found</h3>
        <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto mt-1">
          No commercial car rental applications match your current queue tab or active filter parameters.
        </p>
      </div>
    );
  }

  const allSelected = requests.length > 0 && selectedIds.length === requests.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase text-slate-400 tracking-wider">
              <th className="py-3.5 pl-4 pr-2 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-[#6356E5] focus:ring-[#6356E5]/30 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">Provider & Owner</th>
              <th className="py-3.5 px-3">Application ID</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3 text-center">Vehicles</th>
              <th className="py-3.5 px-3">Commercial Permit</th>
              <th className="py-3.5 px-3 text-center">Documents</th>
              <th className="py-3.5 px-3">Registration Date</th>
              <th className="py-3.5 px-3 text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
            {requests.map((req) => {
              const isChecked = selectedIds.includes(req.id);

              return (
                <tr
                  key={req.id}
                  className={`hover:bg-[#F8F9FC] transition-colors group ${
                    isChecked ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-4 pl-4 pr-2 text-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelect(req.id)}
                      className="rounded border-slate-300 text-[#6356E5] focus:ring-[#6356E5]/30 cursor-pointer"
                    />
                  </td>

                  {/* Provider & Owner Info */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.logo}
                        alt={req.businessName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200&auto=format&fit=crop';
                        }}
                      />
                      <div className="min-w-0">
                        <button
                          onClick={() => onOpenDrawer(req)}
                          className="text-xs font-black text-[#0F172A] hover:text-[#6356E5] transition-colors truncate block text-left cursor-pointer"
                        >
                          {req.businessName}
                        </button>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                          <span>{req.ownerName}</span>
                          <span>•</span>
                          <span>{req.city}, {req.state}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Application ID */}
                  <td className="py-4 px-3">
                    <div className="font-mono text-xs font-bold text-slate-700">
                      {req.applicationId}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Fleet: {req.fleetType}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-3">
                    {getStatusBadge(req.verificationStatus)}
                  </td>

                  {/* Number of Vehicles */}
                  <td className="py-4 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 text-[#0F172A] font-black text-xs">
                      <Car className="w-3.5 h-3.5 text-[#6356E5]" />
                      <span>{req.vehiclesCount}</span>
                    </div>
                  </td>

                  {/* Commercial License */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className={`w-4 h-4 ${
                          req.businessLicenseNumber !== '—'
                            ? 'text-emerald-500'
                            : 'text-slate-300'
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">
                        {req.commercialLicenseStatus}
                      </span>
                    </div>
                  </td>

                  {/* Documents Uploaded */}
                  <td className="py-4 px-3 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>
                        {req.documentsUploadedCount}/{req.documentsTotalCount}
                      </span>
                    </div>
                  </td>

                  {/* Registration Date */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.registeredDate}</span>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-3 text-right pr-5">
                    <div className="flex items-center justify-end gap-1.5 relative">
                      {/* Inspect / Open Drawer Button */}
                      <button
                        onClick={() => onOpenDrawer(req)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Inspect Full Application"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Quick Approve (if not approved) */}
                      {req.verificationStatus !== 'APPROVED' && (
                        <button
                          onClick={() => onApprove(req)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer"
                          title="Approve Car Rental"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Quick Request Changes (if pending or under review) */}
                      {req.verificationStatus !== 'APPROVED' &&
                        req.verificationStatus !== 'CHANGES_REQUESTED' && (
                          <button
                            onClick={() => onRequestChanges(req)}
                            className="p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-600 transition-colors cursor-pointer"
                            title="Request Changes"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}

                      {/* Quick Reject (if not rejected) */}
                      {req.verificationStatus !== 'REJECTED' && (
                        <button
                          onClick={() => onReject(req)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Reject Application"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* More Menu Trigger */}
                      <button
                        onClick={(e) => handleToggleMenu(e, req.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeActionMenu?.id === req.id
                            ? 'bg-slate-200/80 text-slate-700'
                            : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Portal Dropdown Menu - Never clipped by table/card overflow */}
      {activeActionMenu && (() => {
        const activeReq = requests.find((r) => r.id === activeActionMenu.id);
        if (!activeReq) return null;

        return createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              left: `${activeActionMenu.coords.left}px`,
              ...(activeActionMenu.coords.openUpwards
                ? { bottom: `${window.innerHeight - activeActionMenu.coords.top}px` }
                : { top: `${activeActionMenu.coords.top}px` }),
              zIndex: 9999,
            }}
            className="w-44 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 text-left space-y-0.5 select-none animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setActiveActionMenu(null);
                onOpenDrawer(activeReq);
              }}
              className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Inspect Full Fleet</span>
            </button>
            <button
              onClick={() => {
                setActiveActionMenu(null);
                onRequestChanges(activeReq);
              }}
              className="w-full px-2.5 py-1.5 text-xs font-bold text-violet-600 hover:bg-violet-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-violet-500" />
              <span>Request Changes</span>
            </button>
            {onRowAction && (
              <>
                <button
                  onClick={() => {
                    setActiveActionMenu(null);
                    onRowAction('suspend', activeReq);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Suspend Provider</span>
                </button>
                <button
                  onClick={() => {
                    setActiveActionMenu(null);
                    onRowAction('reopen', activeReq);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Reopen Review</span>
                </button>
              </>
            )}
          </div>,
          document.body
        );
      })()}
    </div>
  );
};
