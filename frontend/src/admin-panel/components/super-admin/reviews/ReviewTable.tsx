import React from 'react';
import { AdminReviewItem } from '../../../types/reviewManagement';
import { ReviewTableRow } from './ReviewTableRow';

interface ReviewTableProps {
  reviews: AdminReviewItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onViewDetails: (review: AdminReviewItem) => void;
  onApprove: (review: AdminReviewItem) => void;
  onHide: (review: AdminReviewItem) => void;
  onRemove: (review: AdminReviewItem) => void;
  onWarnUser: (review: AdminReviewItem) => void;
  onWarnAgency: (review: AdminReviewItem) => void;
  onCopyLink: (review: AdminReviewItem) => void;
  onImageClick: (image: string) => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onViewDetails,
  onApprove,
  onHide,
  onRemove,
  onWarnUser,
  onWarnAgency,
  onCopyLink,
  onImageClick,
}) => {
  const isAllSelected = reviews.length > 0 && selectedIds.length === reviews.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60 border-b border-slate-100">
              {/* 1. Select All Checkbox */}
              <th className="py-3 px-3 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded-md border-slate-300 text-[#6356E5] focus:ring-[#6356E5] cursor-pointer"
                />
              </th>

              {/* Columns */}
              <th className="py-3 px-3">Review ID</th>
              <th className="py-3 px-3">Traveler</th>
              <th className="py-3 px-3">Agency</th>
              <th className="py-3 px-3">Package</th>
              <th className="py-3 px-3 text-center">Rating</th>
              <th className="py-3 px-3">Review</th>
              <th className="py-3 px-3">Images</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center">Reports</th>
              <th className="py-3 px-3">Created</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400 font-semibold">
                  No reviews found matching the selected filters.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <ReviewTableRow
                  key={review.id}
                  review={review}
                  isSelected={selectedIds.includes(review.id)}
                  onToggleSelect={onToggleSelect}
                  onViewDetails={onViewDetails}
                  onApprove={onApprove}
                  onHide={onHide}
                  onRemove={onRemove}
                  onWarnUser={onWarnUser}
                  onWarnAgency={onWarnAgency}
                  onCopyLink={onCopyLink}
                  onImageClick={onImageClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
