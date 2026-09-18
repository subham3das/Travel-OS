import { agencyApiClient } from './agencyApiClient';
import {
  KPIStatItem,
  RevenueOverviewData,
  RevenueSourceItem,
  RevenueExpenseDataPoint,
  BookingStatusBreakdown,
  BookingTrendDataPoint,
  TripPerformanceSummary,
  PackageAnalyticsItem,
  DestinationAnalyticsItem,
  TravelerInsightsData,
  FinancialSummaryData,
  AnalyticsInsightItem,
} from '../data/analytics';

export interface AgencyAnalyticsPayload {
  kpis: KPIStatItem[];
  revenueOverview: RevenueOverviewData;
  revenueSources: RevenueSourceItem[];
  revenueVsExpenses: RevenueExpenseDataPoint[];
  bookingOverview: BookingStatusBreakdown;
  bookingTrend: BookingTrendDataPoint[];
  tripPerformance: TripPerformanceSummary;
  packages: PackageAnalyticsItem[];
  destinations: DestinationAnalyticsItem[];
  travelers: TravelerInsightsData;
  financialSummary: FinancialSummaryData;
  insights: AnalyticsInsightItem[];
}

export const agencyAnalyticsService = {
  /**
   * Fetch complete business intelligence analytics data
   */
  async getAnalytics(range = '7D'): Promise<AgencyAnalyticsPayload> {
    const res = await agencyApiClient.get<AgencyAnalyticsPayload>('/agency/analytics', { params: { range } });
    if (!res.data) throw new Error(res.message || 'Failed to fetch analytics');
    return res.data;
  },
};
