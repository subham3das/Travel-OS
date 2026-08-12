import React from 'react';
import { AgencyRequestItem } from '../../../types/agencyRequest';
import { AgencyRequestTableHeader } from './AgencyRequestTableHeader';
import { AgencyRequestTableRow } from './AgencyRequestTableRow';
import { RefreshCw } from 'lucide-react';

interface AgencyRequestsTableProps {
  requests: AgencyRequestItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onOpenDrawer: (request: AgencyRequestItem) => void;
  onRowAction: (actionType: string, request: AgencyRequestItem) => void;
  onRefresh?: () => void;
}

export const AgencyRequestsTable: React.FC<AgencyRequestsTableProps> = ({
  requests,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onOpenDrawer,
  onRowAction,
  onRefresh,
}) => {
  const isAllSelected = requests.length > 0 && selectedIds.length === requests.length;

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100/90 shadow-2xs space-y-4 select-none">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto text-xl font-black shadow-2xs">
          📑
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#0F172A]">No Agency Requests Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            New agency registration requests will appear here when submitted.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <AgencyRequestTableHeader
            isAllSelected={isAllSelected}
            onToggleSelectAll={onToggleSelectAll}
          />
          <tbody>
            {requests.map((req) => (
              <AgencyRequestTableRow
                key={req.id}
                request={req}
                isSelected={selectedIds.includes(req.id)}
                onToggleSelect={onToggleSelect}
                onOpenDrawer={onOpenDrawer}
                onRowAction={onRowAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
