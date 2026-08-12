import React from 'react';
import { Agency } from '../../../types/agency';

interface AgencyOverviewCardProps {
  agency: Agency;
}

export const AgencyOverviewCard: React.FC<AgencyOverviewCardProps> = ({ agency }) => {
  const detailsList = [
    { label: 'Agency Name', value: agency.name },
    { label: 'Owner Name', value: agency.owner.name },
    { label: 'Email', value: agency.email },
    { label: 'Phone', value: agency.phone },
    { label: 'Website', value: agency.website || 'www.wanderlustholidays.com' },
    { label: 'GST Number', value: agency.gstNumber },
    { label: 'Business Type', value: agency.businessType },
    { label: 'Join Date', value: agency.joinDate },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Agency Information
      </h4>

      <div className="space-y-2.5 text-xs font-semibold">
        {detailsList.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between gap-3">
            <span className="text-slate-400 font-bold shrink-0">{item.label}</span>
            <span className="text-[#0F172A] font-extrabold text-right truncate">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
