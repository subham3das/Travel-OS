import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MoreVertical,
  Eye,
  CheckCircle2,
  EyeOff,
  Trash2,
  AlertTriangle,
  Copy,
  Star,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { AdminReviewItem } from '../../../types/reviewManagement';

interface ReviewTableRowProps {
  review: AdminReviewItem;
  isSelected: boolean;
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

export const ReviewTableRow: React.FC<ReviewTableRowProps> = ({
  review,
  isSelected,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; openUpwards: boolean }>({
    top: 0,
    left: 0,
    openUpwards: false,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpwards = spaceBelow < 280 && rect.top > 280;
      const menuWidth = 176; // w-44 = 176px
      const left = Math.max(10, rect.right - menuWidth);
      const top = openUpwards ? rect.top - 6 : rect.bottom + 6;
      setMenuCoords({ top, left, openUpwards });
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    const handleScrollOrResize = () => {
      setIsMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const getStatusBadge = (status: AdminReviewItem['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.8 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-0.8 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Reported':
        return (
          <span className="px-2.5 py-0.8 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            Reported
          </span>
        );
      case 'Removed':
      default:
        return (
          <span className="px-2.5 py-0.8 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
            Removed
          </span>
        );
    }
  };

  const getStarColor = (rating: number) => {
    if (rating >= 4) return 'text-emerald-600 fill-emerald-600';
    if (rating === 3) return 'text-amber-500 fill-amber-500';
    return 'text-rose-500 fill-rose-500';
  };

  return (
    <tr
      className={`transition-colors font-semibold group ${
        isSelected ? 'bg-purple-50/70' : 'hover:bg-slate-50/80'
      }`}
    >
      {/* 1. Checkbox */}
      <td className="py-3 px-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(review.id)}
          className="w-4 h-4 rounded-md border-slate-300 text-[#6356E5] focus:ring-[#6356E5] cursor-pointer"
        />
      </td>

      {/* 2. Review ID */}
      <td className="py-3 px-3">
        <button
          onClick={() => onViewDetails(review)}
          className="font-mono font-bold text-xs text-[#6356E5] hover:underline cursor-pointer text-left"
        >
          {review.id}
        </button>
      </td>

      {/* 3. Traveler */}
      <td className="py-3 px-3">
        <div
          onClick={() => onViewDetails(review)}
          className="flex items-center gap-2.5 min-w-[150px] cursor-pointer"
        >
          <img
            src={
              review.traveler?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
            }
            alt={review.traveler?.name || 'Traveler'}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <span className="font-bold text-xs text-[#0F172A] group-hover:text-[#6356E5] transition-colors block truncate">
              {review.traveler?.name || 'Verified Traveler'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block truncate">
              {review.traveler?.location || 'India'}
            </span>
          </div>
        </div>
      </td>

      {/* 4. Agency */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2 min-w-[130px]">
          <img
            src={
              review.agency?.logo ||
              'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop'
            }
            alt={review.agency?.name || 'Agency'}
            className="w-5 h-5 rounded-md object-cover border border-slate-200 shrink-0"
          />
          <span className="text-xs text-slate-800 font-bold truncate">
            {review.agency?.name || 'Partner Agency'}
          </span>
        </div>
      </td>

      {/* 5. Package */}
      <td className="py-3 px-3 text-xs text-slate-700 font-bold whitespace-nowrap">
        {review.package?.name || 'Trip Package'}
      </td>

      {/* 6. Rating */}
      <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-xs font-black">
        <div className="inline-flex items-center gap-1">
          <span>{review.rating}</span>
          <Star className={`w-3.5 h-3.5 ${getStarColor(review.rating)}`} />
        </div>
      </td>

      {/* 7. Review Preview */}
      <td className="py-3 px-3 min-w-[200px] max-w-[280px]">
        <p
          onClick={() => onViewDetails(review)}
          className="text-xs text-slate-600 line-clamp-2 cursor-pointer hover:text-slate-900 leading-snug"
        >
          {review.reviewText}
        </p>
      </td>

      {/* 8. Images */}
      <td className="py-3 px-3 whitespace-nowrap">
        {review.images && review.images.length > 0 ? (
          <div className="flex items-center gap-1">
            {review.images.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Review upload"
                onClick={() => onImageClick(img)}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200 cursor-pointer hover:scale-110 transition-transform shadow-2xs"
              />
            ))}
            {review.images.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-black border border-slate-200">
                +{review.images.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-300 text-xs">-</span>
        )}
      </td>

      {/* 9. Status */}
      <td className="py-3 px-3 text-center whitespace-nowrap">
        {getStatusBadge(review.status)}
      </td>

      {/* 10. Reports */}
      <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-xs font-black">
        <span
          className={
            review.reportsCount > 0 ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full' : 'text-slate-500'
          }
        >
          {review.reportsCount}
        </span>
      </td>

      {/* 11. Created */}
      <td className="py-3 px-3 text-xs text-slate-500 font-medium whitespace-nowrap font-mono">
        {review.createdAt}
      </td>

      {/* 12. Actions Dropdown */}
      <td className="py-3 px-3 text-right">
        <button
          ref={buttonRef}
          onClick={handleToggleMenu}
          className="w-7 h-7 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Review Actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Context Dropdown */}
        {isMenuOpen &&
          createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                left: `${menuCoords.left}px`,
                ...(menuCoords.openUpwards
                  ? { bottom: `${window.innerHeight - menuCoords.top}px` }
                  : { top: `${menuCoords.top}px` }),
                zIndex: 9999,
              }}
              className="w-44 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 text-xs font-bold text-slate-700 select-none space-y-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onViewDetails(review);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Details</span>
              </button>

              {review.status !== 'Approved' && (
                <button
                  onClick={() => {
                    onApprove(review);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-emerald-50 text-emerald-600 text-left transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Review</span>
                </button>
              )}

              {review.status !== 'Pending' && (
                <button
                  onClick={() => {
                    onHide(review);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-amber-50 text-amber-600 text-left transition-colors cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Review</span>
                </button>
              )}

              {review.status !== 'Removed' && (
                <button
                  onClick={() => {
                    onRemove(review);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 text-left transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Review</span>
                </button>
              )}

              <button
                onClick={() => {
                  onWarnUser(review);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors cursor-pointer border-t border-slate-100"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Warn User</span>
              </button>

              <button
                onClick={() => {
                  onWarnAgency(review);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                <span>Warn Agency</span>
              </button>

              <button
                onClick={() => {
                  onCopyLink(review);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 hover:text-[#6356E5] text-left transition-colors cursor-pointer border-t border-slate-100"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Link</span>
              </button>
            </div>,
            document.body
          )}
      </td>
    </tr>
  );
};
