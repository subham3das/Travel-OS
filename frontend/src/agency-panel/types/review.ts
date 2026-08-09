// ─── Review Types ────────────────────────────────────────────────────────────

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'replied';

export interface Review {
  id: string;
  agencyId: string;
  packageId: string;
  packageTitle: string;
  bookingId: string;
  userId: string;
  travelerName: string;
  travelerAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  agencyReply?: string;
  agencyRepliedAt?: string;
  status: ReviewStatus;
  isVerified: boolean;
  createdAt: string;
}
