import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  Download,
  Check,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Filter,
} from 'lucide-react';
import { SettlementRecord } from '../../../types/financeManagement';

interface SettlementTableProps {
  settlements: SettlementRecord[];
  onViewDetails: (settlement: SettlementRecord) => void;
  onDownloadStatement: (settlement: SettlementRecord) => void;
  onApprove: (settlement: SettlementRecord) => void;
  onReject: (settlement: SettlementRecord) => void;
}

export const SettlementTable: React.FC<SettlementTableProps> = ({
  settlements,
  onViewDetails,
  onDownloadStatement,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Settled' | 'Failed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSettlements = settlements.filter((item) => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agencyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: SettlementRecord['status']) => {
    switch (status) {
      case 'Settled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Settled</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>Pending</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4 select-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#0F172A]">Agency Settlement Overview</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-[#6356E5]">
              {settlements.length} Settlements
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Approve payouts, generate tax invoices, and track bank disbursements
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab buttons */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl">
            {(['All', 'Pending', 'Settled', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settlement ID or agency..."
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200/80 focus:border-[#6356E5] focus:outline-none w-48 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 rounded-xl">
              <th className="py-2.5 px-3 rounded-l-xl">Settlement ID</th>
              <th className="py-2.5 px-3">Agency</th>
              <th className="py-2.5 px-3 text-right">Gross Amount</th>
              <th className="py-2.5 px-3 text-right">Commission</th>
              <th className="py-2.5 px-3 text-right">Tax (GST)</th>
              <th className="py-2.5 px-3 text-right">Net Payout</th>
              <th className="py-2.5 px-3">Settlement Date</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 text-xs font-semibold">
            {filteredSettlements.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-semibold">
                  No settlements found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredSettlements.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Settlement ID */}
                  <td className="py-3.5 px-3 font-mono font-bold text-[#6356E5]">
                    {item.id}
                  </td>

                  {/* Agency */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 min-w-[140px]">
                      {item.agencyLogo ? (
                        <img
                          src={item.agencyLogo}
                          alt={item.agencyName}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#6356E5] font-bold flex items-center justify-center text-xs shrink-0">
                          {item.agencyName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-[#0F172A] block truncate">
                          {item.agencyName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {item.agencyId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Gross Amount */}
                  <td className="py-3.5 px-3 text-right font-mono font-black text-[#0F172A]">
                    {item.settlementAmount}
                  </td>

                  {/* Commission */}
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-[#6356E5]">
                    {item.commission}
                  </td>

                  {/* Tax */}
                  <td className="py-3.5 px-3 text-right font-mono text-slate-500">
                    {item.tax}
                  </td>

                  {/* Net Amount */}
                  <td className="py-3.5 px-3 text-right font-mono font-black text-emerald-600">
                    {item.netAmount}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                    {item.settlementDate}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {/* View */}
                      <button
                        onClick={() => onViewDetails(item)}
                        title="View Statement Details"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#6356E5] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => onDownloadStatement(item)}
                        title="Download Settlement Invoice"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#6356E5] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Approve / Reject only for Pending */}
                      {item.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onApprove(item)}
                            title="Approve Settlement"
                            className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => onReject(item)}
                            title="Reject / Hold Settlement"
                            className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
