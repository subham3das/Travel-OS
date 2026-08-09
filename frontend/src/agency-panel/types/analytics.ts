// ─── Analytics Types ─────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalRevenue: number;
  totalBookings: number;
  activeTrips: number;
  newTravelers: number;
  revenueGrowth: number;  // percentage vs previous period
  bookingGrowth: number;
}

export interface RevenueDataPoint {
  period: string;
  revenue: number;
  bookings: number;
}

export interface PackagePerformance {
  packageId: string;
  packageTitle: string;
  bookings: number;
  revenue: number;
  rating: number;
}

export interface AgencyAnalytics {
  summary: AnalyticsSummary;
  revenueTimeline: RevenueDataPoint[];
  topPackages: PackagePerformance[];
}
