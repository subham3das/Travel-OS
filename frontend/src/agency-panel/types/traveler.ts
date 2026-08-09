// ─── Traveler Types ──────────────────────────────────────────────────────────

export interface Traveler {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  city?: string;
  country?: string;
  totalBookings: number;
  totalTrips: number;
  totalSpend: number;
  lastBookingDate?: string;
  joinedAt: string;
}
