// ─── Super Admin Review Management Types ──────────────────────────────────────

export type ReviewStatus = 'Approved' | 'Pending' | 'Reported' | 'Removed';

export interface ReviewTraveler {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location: string;
  verified: boolean;
  memberSince: string;
  totalReviews: number;
}

export interface ReviewAgency {
  id: string;
  name: string;
  logo: string;
  rating: number;
  verified: boolean;
}

export interface ReviewPackage {
  id: string;
  name: string;
  destination: string;
  thumbnail?: string;
}

export interface ReviewBooking {
  id: string;
  travelDates: string;
  travelerCount: string;
  bookingAmount: string;
}

export interface ReviewAIAnalysis {
  spamScore: number; // 0 - 100
  authenticity: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  riskLevel: 'Very Low Risk' | 'Low Risk' | 'Medium Risk' | 'High Risk';
}

export interface ReviewReportHistoryItem {
  id: string;
  reporterName: string;
  reason: string;
  date: string;
  status: 'Open' | 'Reviewed' | 'Dismissed';
}

export interface ReviewActionHistoryItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface AdminReviewItem {
  id: string; // e.g. REV-12842
  traveler: ReviewTraveler;
  agency: ReviewAgency;
  package: ReviewPackage;
  booking: ReviewBooking;
  rating: number; // 1 - 5
  reviewText: string;
  images: string[];
  status: ReviewStatus;
  reportsCount: number;
  createdAt: string; // e.g. Jun 12, 2024 10:30 AM
  aiAnalysis: ReviewAIAnalysis;
  moderatorNotes: string;
  isVerifiedBooking: boolean;
  reportsHistory?: ReviewReportHistoryItem[];
  actionHistory?: ReviewActionHistoryItem[];
}

export interface ReviewKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'total' | 'pending' | 'reported' | 'removed' | 'rating' | 'today';
  sparklineColor: string;
}

export interface ReviewKPIStats {
  totalReviews: ReviewKPICardItem;
  pendingModeration: ReviewKPICardItem;
  reportedReviews: ReviewKPICardItem;
  removedReviews: ReviewKPICardItem;
  avgRating: ReviewKPICardItem;
  reviewsToday: ReviewKPICardItem;
}

export interface RatingStarDistribution {
  star: number;
  count: number;
  percentage: number;
  color: string;
}

export interface RatingDistributionData {
  avgRating: number;
  totalCount: number;
  stars: RatingStarDistribution[];
}

export interface ReviewTrendDataPoint {
  date: string;
  label: string;
  reviews: number;
  approved: number;
}

export interface SentimentBreakdownItem {
  name: 'Positive' | 'Neutral' | 'Negative';
  count: number;
  percentage: number;
  color: string;
}

export interface RecentModerationActivityItem {
  id: string;
  type: 'approved' | 'removed' | 'warned_user' | 'warned_agency' | 'reported';
  title: string;
  targetId: string;
  actor: string;
  timeAgo: string;
}

export interface ReportedAgencyItem {
  id: string;
  agencyName: string;
  reportsCount: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface ReportedTravelerItem {
  id: string;
  travelerName: string;
  avatar: string;
  reportsCount: number;
  warningBadge: string;
}

export interface ReviewFilters {
  quickStatus: 'All' | 'Pending' | 'Approved' | 'Reported' | 'Removed';
  agency: string;
  destination: string;
  rating: string;
  status: string;
  reported: string;
  verifiedBooking: string;
  dateRange: string;
  search: string;
}
