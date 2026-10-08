import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Search,
  Car,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Filter,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalReviewsPage: React.FC = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<{ totalReviews: number; averageRating: number; distribution: Record<number, number> }>({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getReviews();
      setReviews(data.reviews || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Failed to load reviews:', err);
      showToast(err.message || 'Failed to load fleet reviews', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((rev) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const carName = rev.carId?.name?.toLowerCase() || '';
    const carMake = rev.carId?.make?.toLowerCase() || '';
    const userName = rev.userId?.name?.toLowerCase() || '';
    const comment = rev.comment?.toLowerCase() || '';
    return carName.includes(q) || carMake.includes(q) || userName.includes(q) || comment.includes(q);
  });

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Traveler Reviews & Fleet Ratings
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Authentic feedback from verified renters, driver performance ratings, and vehicle cleanliness scores.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-1.5 text-xs font-black text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>
                  {stats.totalReviews > 0 ? `${stats.averageRating.toFixed(1)} / 5.0 Global Rating (${stats.totalReviews})` : 'No ratings yet'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Filter Bar */}
          {reviews.length > 0 && (
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews by vehicle, renter, or comment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#583BE8] transition-colors"
              />
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
                <span className="text-xs font-bold text-slate-400">Loading reviews...</span>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-2">
                <Star className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-sm font-black text-[#0F172A]">
                  {reviews.length === 0 ? 'No reviews yet' : 'No matching reviews found'}
                </h3>
                <p className="text-xs text-slate-400">
                  {reviews.length === 0
                    ? 'Reviews will show up here after renters complete trips.'
                    : 'Try modifying your search query.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReviews.map((rev, idx) => (
                  <motion.div
                    key={rev._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center">
                          <Car className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#0F172A] block">
                            {rev.carId?.make || ''} {rev.carId?.name || rev.carId?.model || 'Fleet Vehicle'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {rev.carId?.registrationNumber || 'Commercial Fleet'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{(rev.rating || 5).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                      "{rev.comment || 'Great experience with this vehicle and host agency.'}"
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>{rev.userId?.name || 'Verified Trip Renter'}</span>
                      <span className="font-medium text-emerald-600">
                        ★ Cleanliness {rev.cleanlinessRating || rev.rating || 5}.0 • Punctuality {rev.punctualityRating || rev.rating || 5}.0
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalReviewsPage;
