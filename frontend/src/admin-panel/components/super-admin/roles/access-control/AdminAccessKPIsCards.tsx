import React from 'react';
import { ShieldCheck, UserCheck, MailQuestion, Ban } from 'lucide-react';
import { AdminAccessKPIs } from '../../../../types/adminAccessControl';

interface AdminAccessKPIsCardsProps {
  kpis: AdminAccessKPIs;
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

export const AdminAccessKPIsCards: React.FC<AdminAccessKPIsCardsProps> = ({
  kpis,
  activeFilter,
  onFilterChange,
}) => {
  const cards = [
    {
      id: 'All',
      title: 'Authorized Admins',
      value: kpis.totalAuthorized,
      subtitle: 'Total Authorized Emails',
      icon: <ShieldCheck className="w-5 h-5" />,
      colorClasses: 'bg-purple-50 text-[#6356E5] border-purple-100',
    },
    {
      id: 'Active',
      title: 'Active Admin Accounts',
      value: kpis.activeAccounts,
      subtitle: 'Currently Active & Verified',
      icon: <UserCheck className="w-5 h-5" />,
      colorClasses: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'Pending Invitation',
      title: 'Pending Invitations',
      value: kpis.pendingInvitations,
      subtitle: 'Invitations Awaiting Acceptance',
      icon: <MailQuestion className="w-5 h-5" />,
      colorClasses: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      id: 'Suspended',
      title: 'Blocked / Suspended Accounts',
      value: kpis.blockedAccounts,
      subtitle: 'Denied Admin Portal Access',
      icon: <Ban className="w-5 h-5" />,
      colorClasses: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {cards.map((c) => {
        const isSelected = activeFilter.toLowerCase() === c.id.toLowerCase();
        return (
          <div
            key={c.id}
            onClick={() => onFilterChange(c.id)}
            className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-4 hover:shadow-md ${
              isSelected ? 'ring-2 ring-[#6356E5] border-purple-300 bg-purple-50/20' : 'border-slate-100/90'
            }`}
          >
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                {c.title}
              </span>
              <span className="text-2xl font-black text-[#0F172A] tracking-tight block">
                {c.value}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block truncate">
                {c.subtitle}
              </span>
            </div>

            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-2xs ${c.colorClasses}`}
            >
              {c.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};
