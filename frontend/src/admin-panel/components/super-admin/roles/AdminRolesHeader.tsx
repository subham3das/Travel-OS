import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Users,
  Plus,
  ChevronDown,
} from 'lucide-react';

interface AdminRolesHeaderProps {
  onPermissionTemplates: () => void;
  onAccessRequests: () => void;
  onCreateRole: () => void;
  pendingRequestsCount?: number;
}

export const AdminRolesHeader: React.FC<AdminRolesHeaderProps> = ({
  onPermissionTemplates,
  onAccessRequests,
  onCreateRole,
  pendingRequestsCount = 3,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none">
      {/* Left: Back Button + Title + Subtitle */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate('/admin')}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Roles & Permissions
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Manage admin roles, permissions and access control across the Travel OS platform.
          </p>
        </div>
      </div>

      {/* Right Controls: Permission Templates, Access Requests (3), Create Role */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Permission Templates */}
        <button
          onClick={onPermissionTemplates}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Permission Templates</span>
        </button>

        {/* Access Requests */}
        <button
          onClick={onAccessRequests}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer relative"
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Access Requests</span>
          {pendingRequestsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center -ml-0.5">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        {/* Create Role (Primary Purple CTA) */}
        <button
          onClick={onCreateRole}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Role</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>
      </div>
    </div>
  );
};
