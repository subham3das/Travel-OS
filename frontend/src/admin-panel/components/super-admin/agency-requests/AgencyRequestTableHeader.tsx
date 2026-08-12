import React from 'react';

interface AgencyRequestTableHeaderProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

export const AgencyRequestTableHeader: React.FC<AgencyRequestTableHeaderProps> = ({
  isAllSelected,
  onToggleSelectAll,
}) => {
  return (
    <thead className="bg-slate-50/90 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200/80 select-none">
      <tr>
        <th scope="col" className="p-3.5 text-center w-10">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            className="w-4 h-4 rounded text-[#6356E5] border-slate-300 focus:ring-[#6356E5] cursor-pointer"
          />
        </th>
        <th scope="col" className="py-3.5 px-3 text-left min-w-[200px]">
          Agency
        </th>
        <th scope="col" className="py-3.5 px-3 text-left min-w-[120px]">
          Owner
        </th>
        <th scope="col" className="py-3.5 px-3 text-left min-w-[160px]">
          Email
        </th>
        <th scope="col" className="py-3.5 px-3 text-left min-w-[120px]">
          Phone
        </th>
        <th scope="col" className="py-3.5 px-3 text-left min-w-[110px]">
          Business Type
        </th>
        <th scope="col" className="py-3.5 px-3 text-left min-w-[140px]">
          Submitted Date
        </th>
        <th scope="col" className="py-3.5 px-3 text-center min-w-[90px]">
          Documents
        </th>
        <th scope="col" className="py-3.5 px-3 text-center min-w-[120px]">
          Verification
        </th>
        <th scope="col" className="py-3.5 px-3 text-center min-w-[110px]">
          Review Status
        </th>
        <th scope="col" className="py-3.5 px-3 text-center min-w-[100px]">
          Actions
        </th>
      </tr>
    </thead>
  );
};
