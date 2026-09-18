import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  Flag,
  CornerDownRight,
  Send,
  X,
} from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import {
  agencyReviewsService,
  AgencyReviewItem,
  ReviewStatsResponse,
} from '../../services/agencyReviews.service';

/**
 * Agency Reviews & Customer Reputation Command Center
 * Route: /agency/reviews (Protected: APPROVED agencies only)
 */
export const AgencyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<AgencyReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStatsResponse>({
    averageRating: 4.8,
    totalReviews: 4,
    replyRate: '75%',
    positiveSentimentPercent: '95%',
    distribution: [
      { star: 5, count: 3, percent: 75 },
      { star: 4, count: 1, percent: 25 },
      { star: 3, count: 0, percent: 0 },
      { star: 2, count: 0, percent: 0 },
      { star: 1, count: 0, percent: 0 },
    ],
  });
  const [activeTab, setActiveTab] = useState<'All' | 'Pending Reply' | 'Replied'>('All');
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Reply Modal State
  const [replyModalReview, setReplyModalReview] = useState<AgencyReviewItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadReviewsAndStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        agencyReviewsService.getReviews({
          status: activeTab,
          rating: selectedStar || undefined,
          search: searchTerm,
        }),
        agencyReviewsService.getStats(),
      ]);
      setReviews(reviewsData.reviews);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load agency reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedStar, searchTerm]);

  useEffect(() => {
    loadReviewsAndStats();
  }, [loadReviewsAndStats]);

  const handleOpenReplyModal = (review: AgencyReviewItem) => {
    setReplyModalReview(review);
    setReplyText(review.agencyReply?.text || '');
  };

  const handleSubmitReply = async () => {
    if (!replyModalReview || !replyText.trim()) return;
    try {
      setIsSubmittingReply(true);
      await agencyReviewsService.replyToReview(replyModalReview.id || replyModalReview.reviewId, replyText);
      showToast('Official response published to traveler review!');
      setReplyModalReview(null);
      setReplyText('');
      loadReviewsAndStats();
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleFlagReview = async (review: AgencyReviewItem) => {
    try {
      await agencyReviewsService.flagReview(review.id || review.reviewId);
      showToast('Review reported to trust & safety moderation team.');
      loadReviewsAndStats();
    } catch (err) {
      console.error('Failed to flag review:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-12">
        <DashboardHeader />

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#0F172A] text-white text-xs font-black shadow-2xl flex items-center gap-3 border border-slate-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A]">Reputation & Reviews</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-[#583BE8]">
                  Verified Feedback
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400">
                Track client sentiment, publish agency responses, and maintain your partner trust score.
              </p>
            </div>
          </div>

          {/* 1. KPIs & Ratings Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Rating Score Card */}
            <div className="bg-gradient-to-br from-[#583BE8] to-purple-800 text-white rounded-3xl p-6 shadow-lg shadow-purple-500/15 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-200">Overall Rating</span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">{stats.averageRating}</span>
                  <span className="text-purple-200 text-sm font-extrabold">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(stats.averageRating) ? 'fill-amber-300' : 'text-purple-400'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-purple-200 font-semibold">
                Based on {stats.totalReviews} verified traveler ratings across your departures.
              </p>
            </div>

            {/* Rating Star Distribution Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-2.5">
              <span className="text-xs font-black text-[#0F172A]">Ratings Distribution</span>
              <div className="space-y-1.5">
                {stats.distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="w-7 flex items-center gap-1">
                      {d.star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] text-slate-400">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Quality KPI Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-3">
              <span className="text-xs font-black text-[#0F172A]">Agency Response & Trust</span>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Positive Sentiment</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">{stats.positiveSentimentPercent}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-100">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#583BE8]">
                    <MessageSquare className="w-4 h-4 text-[#583BE8]" />
                    <span>Response Rate</span>
                  </div>
                  <span className="text-sm font-black text-[#583BE8]">{stats.replyRate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Filter Tabs & Search */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Segmented Status Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                {(['All', 'Pending Reply', 'Replied'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-[#583BE8] shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews or travelers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-[#0F172A] focus:outline-hidden focus:border-[#583BE8] transition-all"
                />
              </div>
            </div>

            {/* Star Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedStar(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedStar === null
                    ? 'bg-[#583BE8] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Stars
              </button>
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStar(selectedStar === s ? null : s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                    selectedStar === s
                      ? 'bg-[#583BE8] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{s}</span>
                  <Star className={`w-3 h-3 ${selectedStar === s ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* 3. Review Cards List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-3">
                    <div className="h-5 bg-slate-100 rounded w-1/4" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div
                  key={review.id || review.reviewId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4"
                >
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-[#0F172A]">{review.userName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#583BE8]">
                            {review.packageName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                          <span className="text-[11px] font-semibold text-slate-400 ml-1">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFlagReview(review)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Flag for review"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    "{review.reviewText}"
                  </p>

                  {/* Photos */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Traveler upload"
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  {/* Agency Reply Box */}
                  {review.agencyReply ? (
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100/80 space-y-1.5 ml-4 sm:ml-6">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#583BE8]">
                        <div className="flex items-center gap-1.5">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Response from {review.agencyReply.authorName}</span>
                        </div>
                        <span className="text-slate-400 font-medium">
                          {new Date(review.agencyReply.repliedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">
                        {review.agencyReply.text}
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenReplyModal(review)}
                        className="px-4 py-2 rounded-xl bg-purple-50 text-[#583BE8] hover:bg-[#583BE8] hover:text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply to Review</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 space-y-2">
                <Star className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-sm font-black text-[#0F172A]">No reviews found</h4>
                <p className="text-xs text-slate-400 font-medium">Try changing filters or search terms.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyModalReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#0F172A]">Reply to {replyModalReview.userName}</h3>
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-600 font-medium italic border border-slate-100">
                "{replyModalReview.reviewText}"
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Official Agency Response</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the traveler, address any feedback, and reinforce your quality service..."
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-hidden focus:border-[#583BE8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReply}
                  disabled={isSubmittingReply || !replyText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#583BE8] hover:bg-purple-700 text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReply ? 'Publishing...' : 'Publish Response'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </div>
  );
};

export default AgencyReviewsPage;
