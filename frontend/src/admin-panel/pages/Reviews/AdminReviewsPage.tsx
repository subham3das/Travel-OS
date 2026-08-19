import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AdminReviewItem,
  ReviewKPIStats,
  RatingDistributionData,
  ReviewTrendDataPoint,
  SentimentBreakdownItem,
  RecentModerationActivityItem,
  ReportedAgencyItem,
  ReportedTravelerItem,
  ReviewFilters,
} from '../../types/reviewManagement';
import { adminReviewManagementService } from '../../services/adminReviewManagement.service';
import {
  initialReviewKPIStats,
  initialRatingDistribution,
  initialReviewTrendDaily,
  initialSentimentBreakdown,
  initialRecentModeration,
  initialReportedAgencies,
  initialReportedTravelers,
} from '../../data/reviewsData';
import { AdminReviewsHeader } from '../../components/super-admin/reviews/AdminReviewsHeader';
import { ReviewKPIStatsCards } from '../../components/super-admin/reviews/ReviewKPIStats';
import { ReviewAnalyticsSection } from '../../components/super-admin/reviews/ReviewAnalyticsSection';
import { ReviewFilterSection } from '../../components/super-admin/reviews/ReviewFilterSection';
import { ReviewTable } from '../../components/super-admin/reviews/ReviewTable';
import { ReviewPagination } from '../../components/super-admin/reviews/ReviewPagination';
import { ReviewBottomAnalytics } from '../../components/super-admin/reviews/ReviewBottomAnalytics';
import { ReviewDetailsDrawer } from '../../components/super-admin/reviews/ReviewDetailsDrawer';
import { ImagePreviewModal } from '../../components/super-admin/reviews/ImagePreviewModal';

export const AdminReviewsPage: React.FC = () => {
  // ── 1. STATE ──
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AdminReviewItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [trendInterval, setTrendInterval] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filters State
  const initialFilters: ReviewFilters = {
    quickStatus: 'All',
    agency: 'All Agencies',
    destination: 'All Destinations',
    rating: 'All Ratings',
    status: 'All Status',
    reported: 'All',
    verifiedBooking: 'All',
    dateRange: '',
    search: '',
  };
  const [filters, setFilters] = useState<ReviewFilters>(initialFilters);

  // Data States
  const [kpiStats, setKpiStats] = useState<ReviewKPIStats>(initialReviewKPIStats);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistributionData>(initialRatingDistribution);
  const [reviewTrend, setReviewTrend] = useState<ReviewTrendDataPoint[]>(initialReviewTrendDaily);
  const [sentimentBreakdown, setSentimentBreakdown] = useState<SentimentBreakdownItem[]>(initialSentimentBreakdown);
  const [recentActivity, setRecentActivity] = useState<RecentModerationActivityItem[]>(initialRecentModeration);
  const [reportedAgencies, setReportedAgencies] = useState<ReportedAgencyItem[]>(initialReportedAgencies);
  const [reportedTravelers, setReportedTravelers] = useState<ReportedTravelerItem[]>(initialReportedTravelers);
  const [allReviews, setAllReviews] = useState<AdminReviewItem[]>([]);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadReviewsData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        stats,
        dist,
        trend,
        sentiment,
        activity,
        agencies,
        travelers,
        reviews,
      ] = await Promise.all([
        adminReviewManagementService.getKPIStats(),
        adminReviewManagementService.getRatingDistribution(),
        adminReviewManagementService.getReviewTrends(trendInterval),
        adminReviewManagementService.getSentimentBreakdown(),
        adminReviewManagementService.getRecentModeration(),
        adminReviewManagementService.getReportedAgencies(),
        adminReviewManagementService.getReportedTravelers(),
        adminReviewManagementService.getReviews(filters),
      ]);

      setKpiStats(stats);
      setRatingDistribution(dist);
      setReviewTrend(trend);
      setSentimentBreakdown(sentiment);
      setRecentActivity(activity);
      setReportedAgencies(agencies);
      setReportedTravelers(travelers);
      setAllReviews(reviews);
    } catch (err) {
      console.error(err);
      showToast('Failed to load reviews data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [filters, trendInterval]);

  useEffect(() => {
    loadReviewsData();
  }, [loadReviewsData]);

  // ── 3. PAGINATION & COUNTS ──
  const quickCounts = useMemo(() => {
    return {
      all: 12842,
      pending: 238,
      approved: 10256,
      reported: 156,
      removed: 92,
    };
  }, []);

  const totalPages = Math.ceil(allReviews.length / itemsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return allReviews.slice(start, start + itemsPerPage);
  }, [allReviews, currentPage, itemsPerPage]);

  // ── 4. FILTER ACTIONS ──
  const handleQuickStatusChange = (status: ReviewFilters['quickStatus']) => {
    setFilters((prev) => ({ ...prev, quickStatus: status }));
    setCurrentPage(1);
    showToast(`Filtered by ${status}`, 'info');
  };

  const handleFilterChange = (key: keyof ReviewFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    loadReviewsData();
    showToast('Filters applied successfully', 'success');
  };

  // ── 5. SELECTION & ACTIONS ──
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedReviews.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApproveReview = async (review: AdminReviewItem) => {
    await adminReviewManagementService.approveReview(review.id);
    loadReviewsData();
    if (selectedReview?.id === review.id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    }
    showToast(`Review ${review.id} has been Approved`, 'success');
  };

  const handleHideReview = async (review: AdminReviewItem) => {
    await adminReviewManagementService.hideReview(review.id);
    loadReviewsData();
    if (selectedReview?.id === review.id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: 'Pending' } : null));
    }
    showToast(`Review ${review.id} status set to Pending/Hidden`, 'info');
  };

  const handleRemoveReview = async (review: AdminReviewItem) => {
    await adminReviewManagementService.removeReview(review.id);
    loadReviewsData();
    if (selectedReview?.id === review.id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: 'Removed' } : null));
    }
    showToast(`Review ${review.id} has been Removed`, 'error');
  };

  const handleWarnUser = async (review: AdminReviewItem) => {
    await adminReviewManagementService.warnUser(review.traveler.name, review.id);
    loadReviewsData();
    showToast(`Formal policy warning sent to user ${review.traveler.name}`, 'info');
  };

  const handleWarnAgency = async (review: AdminReviewItem) => {
    await adminReviewManagementService.warnAgency(review.agency.name, review.id);
    loadReviewsData();
    showToast(`Compliance notice issued to agency ${review.agency.name}`, 'info');
  };

  const handleCopyLink = (review: AdminReviewItem) => {
    navigator.clipboard.writeText(`https://travelos.com/reviews/${review.id}`);
    showToast(`Direct review link copied to clipboard`, 'success');
  };

  const handleSaveNotes = async (reviewId: string, notes: string) => {
    await adminReviewManagementService.updateModeratorNotes(reviewId, notes);
  };

  // ── 6. EXPORT ──
  const handleExportReviews = () => {
    const headers = ['Review ID', 'Traveler', 'Agency', 'Package', 'Rating', 'Review', 'Status', 'Reports', 'Created'];
    const rows = allReviews.map((r) => [
      r.id,
      `"${r.traveler.name}"`,
      `"${r.agency.name}"`,
      `"${r.package.name}"`,
      r.rating,
      `"${r.reviewText.replace(/"/g, '""')}"`,
      r.status,
      r.reportsCount,
      `"${r.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travelos_reviews_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Reviews exported to CSV successfully', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATIONS ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 shadow-xl"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. PAGE HEADER ── */}
      <AdminReviewsHeader
        onExport={handleExportReviews}
        onDownloadReport={handleExportReviews}
        onRefresh={loadReviewsData}
        isRefreshing={isRefreshing}
      />

      {/* ── 2. KPI STATS (6 COMPACT CARDS) ── */}
      <ReviewKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'pendingModeration') handleQuickStatusChange('Pending');
          else if (id === 'reportedReviews') handleQuickStatusChange('Reported');
          else if (id === 'removedReviews') handleQuickStatusChange('Removed');
          else if (id === 'totalReviews') handleQuickStatusChange('All');
        }}
      />

      {/* ── 3. ANALYTICS SECTION (RAINBOW GAUGE + TREND + SENTIMENT) ── */}
      <ReviewAnalyticsSection
        ratingDistribution={ratingDistribution}
        reviewTrend={reviewTrend}
        sentimentBreakdown={sentimentBreakdown}
        trendInterval={trendInterval}
        onTrendIntervalChange={setTrendInterval}
      />

      {/* ── 4. QUICK STATUS PILLS + ADVANCED FILTERS ── */}
      <ReviewFilterSection
        filters={filters}
        quickCounts={quickCounts}
        onQuickStatusChange={handleQuickStatusChange}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      {/* ── 5. REVIEWS TABLE ── */}
      <ReviewTable
        reviews={paginatedReviews}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelect={handleToggleSelect}
        onViewDetails={(review) => setSelectedReview(review)}
        onApprove={handleApproveReview}
        onHide={handleHideReview}
        onRemove={handleRemoveReview}
        onWarnUser={handleWarnUser}
        onWarnAgency={handleWarnAgency}
        onCopyLink={handleCopyLink}
        onImageClick={(img) => setPreviewImage(img)}
      />

      {/* ── 6. PAGINATION FOOTER ── */}
      <ReviewPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={allReviews.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />

      {/* ── 7. BOTTOM ANALYTICS ROW (4 CARDS) ── */}
      <ReviewBottomAnalytics
        recentActivity={recentActivity}
        reportedAgencies={reportedAgencies}
        reportedTravelers={reportedTravelers}
        onViewAllActivity={() => showToast('Displaying full moderation activity ledger', 'info')}
        onViewAllAgencies={() => showToast('Filtered to reported agencies', 'info')}
        onViewAllTravelers={() => showToast('Filtered to reported travelers', 'info')}
      />

      {/* ── 8. RIGHT STICKY / SLIDE-IN REVIEW DRAWER ── */}
      <ReviewDetailsDrawer
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onApprove={handleApproveReview}
        onHide={handleHideReview}
        onRemove={handleRemoveReview}
        onWarnUser={handleWarnUser}
        onWarnAgency={handleWarnAgency}
        onSaveNotes={handleSaveNotes}
        onImageClick={(img) => setPreviewImage(img)}
      />

      {/* ── 9. IMAGE PREVIEW MODAL LIGHTBOX ── */}
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </motion.div>
  );
};

export default AdminReviewsPage;
