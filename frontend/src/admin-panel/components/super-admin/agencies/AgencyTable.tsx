import React from 'react';
import { Agency } from '../../../types/agency';
import { AgencyTableHeader } from './AgencyTableHeader';
import { AgencyTableRow } from './AgencyTableRow';

interface AgencyTableProps {
  agencies: Agency[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onViewDetails: (agency: Agency) => void;
  onAction: (actionType: string, agency: Agency) => void;
}

export const AgencyTable: React.FC<AgencyTableProps> = ({
  agencies,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onViewDetails,
  onAction,
}) => {
  const isAllSelected = agencies.length > 0 && selectedIds.length === agencies.length;

  if (agencies.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100/90 shadow-2xs space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-lg font-black">
          🔍
        </div>
        <h3 className="text-base font-extrabold text-[#0F172A]">No agencies found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try adjusting your search criteria or clearing filters to view registered travel agencies.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <AgencyTableHeader
            isAllSelected={isAllSelected}
            onToggleSelectAll={onToggleSelectAll}
          />
          <tbody>
            {agencies.map((agency) => (
              <AgencyTableRow
                key={agency.id}
                agency={agency}
                isSelected={selectedIds.includes(agency.id)}
                onToggleSelect={onToggleSelect}
                onViewDetails={onViewDetails}
                onAction={onAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
