import React from 'react';
import { Eye, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { AgencySettlementRow } from '../../../types/financeManagement';

interface SettlementTableProps {
  settlements: AgencySettlementRow[];
  onViewDetails: (settlement: AgencySettlementRow) => void;
  onDownload: (settlement: AgencySettlementRow) => void;
  onApprove: (settlement: AgencySettlementRow) => void;
  onViewAllSettlements?: () => void;
}

export const SettlementTable: React.FC<SettlementTableProps> = ({
  settlements,
  onViewDetails,
  onDownload,
  onApprove,
  onViewAllSettlements,
}) => {
  const getStatusBadge = (status: AgencySettlementRow['status']) => {
    switch (status) {
      case 'Settled':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200 font-extrabold';
      case 'Failed':
      default:
        return 'bg-rose-50 text-rose-600 border border-rose-100 font-extrabold';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3.5 select-none flex flex-col justify-between h-full">
      <h3 className="text-sm font-black text-[#0F172A]">Agency Settlement Overview</h3>

      <div className="overflow-x-auto scrollbar-none flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
              <th className="py-2.5 px-2">Settlement ID</th>
              <th className="py-2.5 px-2">Agency</th>
              <th className="py-2.5 px-2">Settlement Amount</th>
              <th className="py-2.5 px-2">Commission</th>
              <th className="py-2.5 px-2">Tax</th>
              <th className="py-2.5 px-2">Net Amount</th>
              <th className="py-2.5 px-2">Settlement Date</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 pl-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settlements.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                {/* Settlement ID */}
                <td className="py-3 px-2 font-mono text-[11px] font-bold text-[#6356E5] group-hover:underline whitespace-nowrap">
                  {s.settlementId}
                </td>

                {/* Agency */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5 min-w-[130px]">
                    <img
                      src={s.agencyLogo}
                      alt={s.agencyName}
                      className="w-4 h-4 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <span className="font-extrabold text-[#0F172A] truncate">
                      {s.agencyName}
                    </span>
                  </div>
                </td>

                {/* Settlement Amount */}
                <td className="py-3 px-2 font-black text-[#0F172A] whitespace-nowrap">
                  {s.settlementAmount}
                </td>

                {/* Commission */}
                <td className="py-3 px-2 font-bold text-slate-600 whitespace-nowrap text-[11px]">
                  {s.commission}
                </td>

                {/* Tax */}
                <td className="py-3 px-2 font-bold text-slate-600 whitespace-nowrap text-[11px]">
                  {s.tax}
                </td>

                {/* Net Amount */}
                <td className="py-3 px-2 font-black text-emerald-600 whitespace-nowrap">
                  {s.netAmount}
                </td>

                {/* Settlement Date */}
                <td className="py-3 px-2 font-bold text-slate-600 whitespace-nowrap text-[11px]">
                  {s.settlementDate}
                </td>

                {/* Status */}
                <td className="py-3 px-2 whitespace-nowrap">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] ${getStatusBadge(s.status)}`}>
                    {s.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 pl-2 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => onViewDetails(s)}
                      className="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="View Settlement Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDownload(s)}
                      className="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="Download Statement"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {s.status === 'Pending' && (
                      <button
                        onClick={() => onApprove(s)}
                        className="w-6 h-6 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Approve Settlement"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={onViewAllSettlements}
          className="inline-flex items-center gap-1 text-xs font-black text-[#6356E5] hover:text-[#5244e0] transition-colors cursor-pointer"
        >
          <span>View All Settlements</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
