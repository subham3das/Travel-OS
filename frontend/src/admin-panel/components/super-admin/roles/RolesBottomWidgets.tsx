import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Trash2,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Activity,
  Laptop,
  Users,
} from 'lucide-react';
import {
  PermissionAuditItem,
  RoleActivityItem,
  ActiveLoginSessionItem,
  AccessRequestItem,
} from '../../../types/rolesManagement';

interface RolesBottomWidgetsProps {
  auditSummary: PermissionAuditItem[];
  activity: RoleActivityItem[];
  sessions: ActiveLoginSessionItem[];
  accessRequests: AccessRequestItem[];
  onTerminateAllSessions: () => void;
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onViewAllAudit?: () => void;
  onViewAllActivity?: () => void;
  onViewAllSessions?: () => void;
  onViewAllRequests?: () => void;
}

export const RolesBottomWidgets: React.FC<RolesBottomWidgetsProps> = ({
  auditSummary,
  activity,
  sessions,
  accessRequests,
  onTerminateAllSessions,
  onApproveRequest,
  onRejectRequest,
  onViewAllAudit,
  onViewAllActivity,
  onViewAllSessions,
  onViewAllRequests,
}) => {
  const pendingRequestsCount = accessRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch select-none">
      {/* ── CARD 1: PERMISSION AUDIT SUMMARY ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Permission Audit Summary</h3>
          {auditSummary.length > 0 && (
            <button
              onClick={onViewAllAudit}
              className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-2 py-2">
          {auditSummary.length === 0 ? (
            <div className="py-6 text-center text-slate-400">
              <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-slate-300" />
              <p className="text-[11px] font-bold text-slate-500">No audit records</p>
            </div>
          ) : (
            auditSummary.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {item.type === 'added' || item.type === 'updated' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : item.type === 'removed' ? (
                    <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  ) : item.type === 'created' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6356E5] shrink-0" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span className="font-bold text-slate-700 text-[11px] truncate">{item.category}</span>
                </div>

                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="font-black text-slate-900 text-[11px]">{item.count}</span>
                  <span
                    className={`text-[9px] font-bold flex items-center ${
                      item.isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.isPositive ? (
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    ) : (
                      <ArrowDownRight className="w-2.5 h-2.5" />
                    )}
                    {item.growth}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Enterprise RBAC policy enforced across modules
        </div>
      </div>

      {/* ── CARD 2: ADMIN ACTIVITY ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Admin Activity</h3>
          {activity.length > 0 && (
            <button
              onClick={onViewAllActivity}
              className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-2 py-2">
          {activity.length === 0 ? (
            <div className="py-6 text-center text-slate-400">
              <Activity className="w-5 h-5 mx-auto mb-1 text-slate-300" />
              <p className="text-[11px] font-bold text-slate-500">No activity recorded</p>
            </div>
          ) : (
            activity.map((act) => (
              <div key={act.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={act.avatar}
                    alt={act.admin}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 text-[11px] block truncate">
                      {act.admin}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block truncate">
                      {act.action}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-mono text-slate-400 shrink-0">{act.timeAgo}</span>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Real-time admin security audit stream
        </div>
      </div>

      {/* ── CARD 3: ACTIVE LOGIN SESSIONS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-slate-900 text-xs">{sessions.length}</span>
            <h3 className="text-xs font-black text-[#0F172A]">Active Sessions</h3>
          </div>
          {sessions.length > 0 && (
            <button
              onClick={onTerminateAllSessions}
              className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Terminate All
            </button>
          )}
        </div>

        <div className="space-y-2 py-2">
          {sessions.length === 0 ? (
            <div className="py-6 text-center text-slate-400">
              <Laptop className="w-5 h-5 mx-auto mb-1 text-slate-300" />
              <p className="text-[11px] font-bold text-slate-500">No active sessions</p>
            </div>
          ) : (
            sessions.map((sess) => (
              <div key={sess.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm">{sess.flag}</span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 text-[11px] block truncate">
                      {sess.country} <span className="font-mono text-slate-400 font-normal">({sess.count})</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block truncate">
                      {sess.deviceBrowser}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-mono text-slate-400 shrink-0">{sess.timeAgo}</span>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Zero unauthorized access detected
        </div>
      </div>

      {/* ── CARD 4: ACCESS REQUESTS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Access Requests</h3>
          {accessRequests.length > 0 && (
            <button
              onClick={onViewAllRequests}
              className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-2 py-2">
          {accessRequests.length === 0 ? (
            <div className="py-6 text-center text-slate-400">
              <Users className="w-5 h-5 mx-auto mb-1 text-slate-300" />
              <p className="text-[11px] font-bold text-slate-500">No pending access requests</p>
            </div>
          ) : (
            accessRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={req.avatar}
                    alt={req.user}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 text-[11px] block truncate">
                      {req.user}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block truncate">
                      Role: {req.requestedRole}
                    </span>
                  </div>
                </div>

                {req.status === 'Pending' ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onApproveRequest(req.id)}
                      className="w-5 h-5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center cursor-pointer"
                      title="Approve"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                    <button
                      onClick={() => onRejectRequest(req.id)}
                      className="w-5 h-5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer"
                      title="Reject"
                    >
                      <X className="w-3 h-3 stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[9px] font-black shrink-0 ${
                      req.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          {pendingRequestsCount} pending privilege elevation request{pendingRequestsCount === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
};
