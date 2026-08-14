import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminPackageItem, PackageSortConfig } from '../../../types/packageManagement';
import { PackageTableHeader } from './PackageTableHeader';
import { PackageTableRow } from './PackageTableRow';
import { RefreshCw, PackageX } from 'lucide-react';

interface PackagesTableProps {
  packages: AdminPackageItem[];
  selectedIds: string[];
  selectedPackage: AdminPackageItem | null;
  sortConfig?: PackageSortConfig;
  onSort?: (key: PackageSortConfig['key']) => void;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onSelectPackage: (pkg: AdminPackageItem) => void;
  onRowAction: (actionType: string, pkg: AdminPackageItem) => void;
  onRefresh?: () => void;
}

export const PackagesTable: React.FC<PackagesTableProps> = ({
  packages,
  selectedIds,
  selectedPackage,
  sortConfig,
  onSort,
  onToggleSelectAll,
  onToggleSelect,
  onSelectPackage,
  onRowAction,
  onRefresh,
}) => {
  const isAllSelected = packages.length > 0 && selectedIds.length === packages.length;

  if (packages.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100/90 shadow-2xs space-y-4 select-none">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto text-xl font-black shadow-2xs">
          <PackageX className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#0F172A]">No Packages Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No travel packages match your current filters or search criteria.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Packages</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <PackageTableHeader
            isAllSelected={isAllSelected}
            onToggleSelectAll={onToggleSelectAll}
            sortConfig={sortConfig}
            onSort={onSort}
          />
          <tbody>
            <AnimatePresence initial={false}>
              {packages.map((pkg) => (
                <PackageTableRow
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={selectedIds.includes(pkg.id)}
                  isDrawerSelected={selectedPackage?.id === pkg.id}
                  onToggleSelect={onToggleSelect}
                  onSelectPackage={onSelectPackage}
                  onRowAction={onRowAction}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
