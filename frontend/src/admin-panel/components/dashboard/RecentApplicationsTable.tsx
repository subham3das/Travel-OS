import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AgencyVerificationStatus } from '../../../agency-panel/types/agency';
import { MOCK_RECENT_APPLICATIONS, AgencyApplicationRecord } from '../../data/agencyApplications';

export const RecentApplicationsTable: React.FC = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status: AgencyVerificationStatus) => {
    switch (status) {
      case AgencyVerificationStatus.PENDING:
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#583BE8] text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#583BE8]" />
            Pending
          </span>
        );
      case AgencyVerificationStatus.UNDER_REVIEW:
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            Under Review
          </span>
        );
      case AgencyVerificationStatus.APPROVED:
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Approved
          </span>
        );
      case AgencyVerificationStatus.REJECTED:
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Recent Applications</h3>
        <button
          type="button"
          onClick={() => navigate('/admin/agencies')}
          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          View All Applications
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Agency</th>
              <th className="pb-3">Owner</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Submitted On</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 text-xs font-semibold text-[#0F172A]">
            {MOCK_RECENT_APPLICATIONS.map((app: AgencyApplicationRecord) => (
              <tr key={app.id} className="hover:bg-slate-50/70 transition-colors group">
                {/* Agency Logo & Name */}
                <td className="py-3.5 pl-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.logo}
                      alt={app.agencyName}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <span className="font-extrabold text-[#0F172A] group-hover:text-[#583BE8] transition-colors">
                      {app.agencyName}
                    </span>
                  </div>
                </td>

                {/* Owner */}
                <td className="py-3.5 text-slate-700 font-medium">{app.ownerName}</td>

                {/* Location */}
                <td className="py-3.5 text-slate-600 font-medium">{app.location}</td>

                {/* Submitted On */}
                <td className="py-3.5 text-slate-500 font-medium">{app.submittedOn}</td>

                {/* Status Badge */}
                <td className="py-3.5">{getStatusBadge(app.status)}</td>

                {/* Action Buttons */}
                <td className="py-3.5 text-right pr-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/agencies/${app.agencyId}`)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-[#583BE8] text-slate-600 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/agencies/${app.agencyId}`)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-[#583BE8] hover:text-white text-slate-600 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer Pagination */}
      <div className="flex items-center justify-between pt-2 text-xs font-medium text-slate-400 border-t border-slate-100">
        <span>Showing 1 to 5 of 20 applications</span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-7 h-7 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed opacity-60"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="w-7 h-7 rounded-xl bg-[#583BE8] text-white font-bold flex items-center justify-center text-xs">
            1
          </span>
          <button
            type="button"
            onClick={() => navigate('/admin/agencies')}
            className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/agencies')}
            className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs cursor-pointer"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/agencies')}
            className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs cursor-pointer"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/agencies')}
            className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentApplicationsTable;
