import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  UserX,
  Share2,
} from 'lucide-react';
import { CommunityFeedRowItem } from '../../../types/communityManagement';

interface RecentCommunityFeedTableProps {
  feedRows: CommunityFeedRowItem[];
  onViewPost: (post: CommunityFeedRowItem) => void;
  onApprovePost: (post: CommunityFeedRowItem) => void;
  onDeletePost: (post: CommunityFeedRowItem) => void;
  onWarnUser: (post: CommunityFeedRowItem) => void;
  onSuspendUser: (post: CommunityFeedRowItem) => void;
}

export const RecentCommunityFeedTable: React.FC<RecentCommunityFeedTableProps> = ({
  feedRows,
  onViewPost,
  onApprovePost,
  onDeletePost,
  onWarnUser,
  onSuspendUser,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId]);

  const getStatusBadge = (status: CommunityFeedRowItem['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Reported':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            Reported
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="p-4 border-b border-slate-100/80 flex items-center justify-between">
        <h3 className="text-xs font-black text-[#0F172A]">Recent Community Feed</h3>
        <span className="text-[10px] font-mono text-slate-400 font-bold">Real-Time Platform Feed</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60 border-b border-slate-100">
              <th className="py-3 px-3">Post ID</th>
              <th className="py-3 px-3">Creator</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-center">Views</th>
              <th className="py-3 px-3 text-center">Likes</th>
              <th className="py-3 px-3 text-center">Comments</th>
              <th className="py-3 px-3 text-center">Shares</th>
              <th className="py-3 px-3 text-center">Reports</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Created</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {feedRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors font-semibold">
                {/* 1. Post ID */}
                <td className="py-3 px-3">
                  <span className="font-mono font-bold text-xs text-[#6356E5]">
                    {row.id}
                  </span>
                </td>

                {/* 2. Creator */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={row.creator.avatar}
                      alt={row.creator.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="font-bold text-slate-800 text-xs truncate">
                      {row.creator.name}
                    </span>
                  </div>
                </td>

                {/* 3. Category */}
                <td className="py-3 px-3 text-xs text-slate-600 font-medium whitespace-nowrap">
                  {row.category}
                </td>

                {/* 4. Views */}
                <td className="py-3 px-3 text-center font-mono text-slate-700 text-xs font-bold">
                  {row.views}
                </td>

                {/* 5. Likes */}
                <td className="py-3 px-3 text-center font-mono text-slate-700 text-xs font-bold">
                  {row.likes}
                </td>

                {/* 6. Comments */}
                <td className="py-3 px-3 text-center font-mono text-slate-700 text-xs font-bold">
                  {row.comments}
                </td>

                {/* 7. Shares */}
                <td className="py-3 px-3 text-center font-mono text-slate-700 text-xs font-bold">
                  {row.shares}
                </td>

                {/* 8. Reports */}
                <td className="py-3 px-3 text-center font-mono text-xs font-bold">
                  <span className={row.reports > 0 ? 'text-rose-600' : 'text-slate-400'}>
                    {row.reports}
                  </span>
                </td>

                {/* 9. Status */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  {getStatusBadge(row.status)}
                </td>

                {/* 10. Created */}
                <td className="py-3 px-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                  {row.createdAt}
                </td>

                {/* 11. Actions */}
                <td className="py-3 px-3 text-right relative">
                  <div className="inline-block text-left">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                      className="w-7 h-7 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === row.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 text-xs font-bold text-slate-700 select-none"
                      >
                        <button
                          onClick={() => {
                            onViewPost(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View Post</span>
                        </button>

                        <button
                          onClick={() => {
                            onApprovePost(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-emerald-50 text-emerald-600 text-left transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Moderate / Approve</span>
                        </button>

                        <button
                          onClick={() => {
                            onWarnUser(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-amber-50 text-amber-600 text-left transition-colors cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Warn Creator</span>
                        </button>

                        <button
                          onClick={() => {
                            onSuspendUser(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 text-left transition-colors cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Suspend User</span>
                        </button>

                        <button
                          onClick={() => {
                            onDeletePost(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 text-left transition-colors cursor-pointer border-t border-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
