import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAgencyRequestService } from '../../services/adminAgencyRequest.service';
import { AgencyRequestItem } from '../../types/agencyRequest';

export const RecentApplicationsTable: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AgencyRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAgencyRequestService
      .getAgencyRequests({}, 1, 5)
      .then((res) => {
        setApplications(res.items || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#583BE8] text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#583BE8]" />
            Pending
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Under Review
          </span>
        );
      case 'Approved':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-extrabold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 text-[11px] font-extrabold">
            {status}
          </span>
        );
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
          onClick={() => navigate('/admin/verification-pending')}
          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          View All Applications
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading recent applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-semibold">No recent agency applications found.</div>
        ) : (
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
              {applications.map((app: AgencyRequestItem) => (
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
                  <td className="py-3.5 text-slate-600 font-medium">
                    {app.city}, {app.state}
                  </td>

                  {/* Submitted On */}
                  <td className="py-3.5 text-slate-500 font-medium">{app.submittedDate}</td>

                  {/* Status */}
                  <td className="py-3.5">{getStatusBadge(app.reviewStatus)}</td>

                  {/* Action */}
                  <td className="py-3.5 text-right pr-2">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/verification-pending')}
                      className="p-2 rounded-xl text-slate-400 hover:text-[#583BE8] hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Review Application"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default RecentApplicationsTable;
