import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Building2,
  Calendar,
  Users,
  CreditCard,
  Star,
  ExternalLink,
  Bot,
  AlertTriangle,
  EyeOff,
  Trash2,
  UserCheck,
  MoreHorizontal,
  Clock,
  FileText,
} from 'lucide-react';
import { AdminReviewItem } from '../../../types/reviewManagement';

interface ReviewDetailsDrawerProps {
  review: AdminReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (review: AdminReviewItem) => void;
  onHide: (review: AdminReviewItem) => void;
  onRemove: (review: AdminReviewItem) => void;
  onWarnUser: (review: AdminReviewItem) => void;
  onWarnAgency: (review: AdminReviewItem) => void;
  onSaveNotes: (reviewId: string, notes: string) => void;
  onImageClick: (image: string) => void;
}

export const ReviewDetailsDrawer: React.FC<ReviewDetailsDrawerProps> = ({
  review,
  isOpen,
  onClose,
  onApprove,
  onHide,
  onRemove,
  onWarnUser,
  onWarnAgency,
  onSaveNotes,
  onImageClick,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Reports' | 'History' | 'AI Analysis'>('Overview');
  const [notes, setNotes] = useState('');
  const [notesSavedStatus, setNotesSavedStatus] = useState<'saved' | 'saving' | ''>('');

  useEffect(() => {
    if (review) {
      setNotes(review.moderatorNotes || '');
      setActiveTab('Overview');
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    setNotesSavedStatus('saving');
    onSaveNotes(review.id, val);
    setTimeout(() => setNotesSavedStatus('saved'), 600);
  };

  const getStatusBadge = (status: AdminReviewItem['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Reported':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
            Reported
          </span>
        );
      case 'Removed':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
            Removed
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[500px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* ── 1. Header ── */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#0F172A]">Review Details</span>
                <span className="font-mono text-xs font-bold text-slate-500">{review.id}</span>
                {getStatusBadge(review.status)}
                {review.isVerifiedBooking && (
                  <span title="Verified Review">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── 2. Navigation Tabs ── */}
            <div className="flex items-center gap-1 px-4 pt-2 pb-1 bg-white border-b border-slate-100 text-xs font-bold text-slate-500 shrink-0">
              {(['Overview', 'Reports', 'History', 'AI Analysis'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#EEF2FF] text-[#6356E5] font-black'
                      : 'hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {tab === 'Reports' ? `Reports (${review.reportsCount})` : tab}
                </button>
              ))}
            </div>

            {/* ── 3. Scrollable Content Area ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'Overview' && (
                <>
                  {/* Reviewer Information Card */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Reviewer Information
                    </span>

                    <div className="flex items-center gap-3">
                      <img
                        src={review.traveler.avatar}
                        alt={review.traveler.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-[#0F172A]">{review.traveler.name}</h4>
                          {review.traveler.verified && (
                            <span className="px-2 py-0.2 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">
                              Verified Traveler
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{review.traveler.email}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{review.traveler.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Member since {review.traveler.memberSince}</span>
                      <span>Total Reviews: {review.traveler.totalReviews}</span>
                    </div>
                  </div>

                  {/* Booking Information Card */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Booking Information
                    </span>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-400 font-bold">Booking ID</span>
                        <span className="font-mono font-bold text-slate-800">{review.booking.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-400 font-bold">Travel Date</span>
                        <span className="font-bold text-slate-800">{review.booking.travelDates}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-400 font-bold">Travelers</span>
                        <span className="font-bold text-slate-800">{review.booking.travelerCount}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-400 font-bold">Booking Amount</span>
                        <span className="font-mono font-black text-slate-900">
                          {review.booking.bookingAmount}
                        </span>
                      </div>
                    </div>

                    <button className="w-full py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer">
                      View Booking
                    </button>
                  </div>

                  {/* Review Content Card */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Review Content
                    </span>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-black text-xs">
                        <span className="font-mono text-sm">{review.rating}</span>
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{review.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                      {review.reviewText}
                    </p>

                    {/* Image Gallery */}
                    {review.images && review.images.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 block">Uploaded Photos</span>
                        <div className="grid grid-cols-4 gap-2">
                          {review.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Upload preview"
                              onClick={() => onImageClick(img)}
                              className="w-full h-16 rounded-xl object-cover border border-slate-200 cursor-pointer hover:scale-105 transition-transform shadow-2xs"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Analysis Quick Card */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-[#6356E5]" />
                        <span className="text-xs font-black text-[#0F172A]">AI Analysis</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
                        {review.aiAnalysis.riskLevel}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500">AI Spam Score</span>
                        <span className="font-mono text-[#6356E5]">{review.aiAnalysis.spamScore}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${review.aiAnalysis.spamScore}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium leading-tight">
                      Very Low Risk - This review appears to be genuine and contains no detected spam patterns.
                    </p>
                  </div>

                  {/* Moderator Notes */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Moderator Notes
                      </span>
                      {notesSavedStatus && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {notesSavedStatus === 'saving' ? 'Saving...' : 'Saved'}
                        </span>
                      )}
                    </div>

                    <textarea
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Add notes about this review..."
                      rows={3}
                      className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6356E5] focus:bg-white resize-none shadow-2xs"
                    />
                  </div>
                </>
              )}

              {/* TAB 2: REPORTS */}
              {activeTab === 'Reports' && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-3">
                    <span className="text-xs font-black text-[#0F172A]">User Reports History</span>
                    {review.reportsHistory && review.reportsHistory.length > 0 ? (
                      <div className="space-y-2.5 divide-y divide-slate-100">
                        {review.reportsHistory.map((rep) => (
                          <div key={rep.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">{rep.reporterName}</span>
                              <span className="text-[10px] font-mono text-slate-400">{rep.date}</span>
                            </div>
                            <p className="text-slate-600 bg-slate-50 p-2 rounded-xl text-[11px]">
                              {rep.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        No reports submitted against this review.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: HISTORY */}
              {activeTab === 'History' && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-3">
                    <span className="text-xs font-black text-[#0F172A]">Action Audit Trail</span>
                    <div className="space-y-3 relative pl-4">
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
                      {(review.actionHistory || [
                        { action: 'Review Created', actor: review.traveler.name, timestamp: review.createdAt },
                        { action: 'Status Verified', actor: 'Automated Bot', timestamp: review.createdAt },
                      ]).map((hist, i) => (
                        <div key={i} className="relative flex items-start justify-between gap-2 text-xs">
                          <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-white absolute -left-[14px] top-0.5 shadow-2xs" />
                          <div>
                            <p className="font-bold text-slate-800">{hist.action}</p>
                            <p className="text-[10px] text-slate-400">by {hist.actor}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{hist.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AI ANALYSIS */}
              {activeTab === 'AI Analysis' && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-3xl border border-slate-100/90 shadow-2xs space-y-3 text-xs">
                    <span className="font-black text-[#0F172A]">Deep NLP Sentiment Matrix</span>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Sentiment Classification</span>
                        <span className="font-black text-emerald-600">{review.aiAnalysis.sentiment}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Authenticity Score</span>
                        <span className="font-black text-slate-800">{review.aiAnalysis.authenticity}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Confidence Metric</span>
                        <span className="font-mono font-black text-[#6356E5]">
                          {review.aiAnalysis.confidence}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Risk Assessment</span>
                        <span className="font-black text-emerald-600">{review.aiAnalysis.riskLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── 4. Quick Actions Footer (6 Buttons) ── */}
            <div className="p-4 bg-white border-t border-slate-100 space-y-2 shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Quick Actions
              </span>

              {/* Row 1: Approve + Hide */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onApprove(review)}
                  className="py-2 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center gap-1.5 border border-emerald-200 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Review</span>
                </button>

                <button
                  onClick={() => onHide(review)}
                  className="py-2 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center gap-1.5 border border-amber-200 transition-all cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Review</span>
                </button>
              </div>

              {/* Row 2: Remove + Warn User */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onRemove(review)}
                  className="py-2 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Review</span>
                </button>

                <button
                  onClick={() => onWarnUser(review)}
                  className="py-2 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center gap-1.5 border border-blue-200 transition-all cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Warn User</span>
                </button>
              </div>

              {/* Row 3: Warn Agency + More Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onWarnAgency(review)}
                  className="py-2 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-black flex items-center justify-center gap-1.5 border border-purple-200 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Warn Agency</span>
                </button>

                <button className="py-2 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <MoreHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>More Actions</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
