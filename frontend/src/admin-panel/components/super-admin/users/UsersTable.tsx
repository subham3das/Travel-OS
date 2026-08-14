import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TravelerUser, UserSortConfig } from '../../../types/userManagement';
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { RefreshCw, UserX } from 'lucide-react';

interface UsersTableProps {
  users: TravelerUser[];
  selectedIds: string[];
  selectedUser: TravelerUser | null;
  sortConfig?: UserSortConfig;
  onSort?: (key: UserSortConfig['key']) => void;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onSelectUser: (user: TravelerUser) => void;
  onRowAction: (actionType: string, user: TravelerUser) => void;
  onRefresh?: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  selectedIds,
  selectedUser,
  sortConfig,
  onSort,
  onToggleSelectAll,
  onToggleSelect,
  onSelectUser,
  onRowAction,
  onRefresh,
}) => {
  const isAllSelected = users.length > 0 && selectedIds.length === users.length;

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100/90 shadow-2xs space-y-4 select-none">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto text-xl font-black shadow-2xs">
          <UserX className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#0F172A]">No Users Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No registered users match your current filters or search query.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Users</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <UserTableHeader
            isAllSelected={isAllSelected}
            onToggleSelectAll={onToggleSelectAll}
            sortConfig={sortConfig}
            onSort={onSort}
          />
          <tbody>
            <AnimatePresence initial={false}>
              {users.map((u) => (
                <UserTableRow
                  key={u.id}
                  user={u}
                  isSelected={selectedIds.includes(u.id)}
                  isDrawerSelected={selectedUser?.id === u.id}
                  onToggleSelect={onToggleSelect}
                  onSelectUser={onSelectUser}
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
