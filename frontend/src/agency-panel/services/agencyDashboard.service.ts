import { agencyApiClient, AgencyApiResponse } from './agencyApiClient';
import { AgencyDashboardDataPayload, DashboardRecentBooking, DashboardUpcomingDeparture } from '../data/dashboardInsights';

export class AgencyDashboardService {
  /**
   * Fetch Unified Dashboard Data for the Authenticated Agency
   */
  public async getDashboard(range: string = 'This Month'): Promise<AgencyDashboardDataPayload> {
    try {
      const response = await agencyApiClient.get<AgencyDashboardDataPayload>(
        '/agencies/dashboard',
        {
          params: { range },
          requiresAuth: true,
        }
      );

      if (response.data) {
        return response.data;
      }

      if ((response as any).revenue) {
        return response as unknown as AgencyDashboardDataPayload;
      }

      throw new Error(response.message || 'Failed to load agency dashboard data.');
    } catch (error: any) {
      console.error('AgencyDashboardService.getDashboard error:', error);
      throw error;
    }
  }

  /**
   * Fetch Recent Bookings for Authenticated Agency
   */
  public async getRecentBookings(): Promise<DashboardRecentBooking[]> {
    try {
      const response = await agencyApiClient.get<DashboardRecentBooking[]>(
        '/agencies/dashboard/recent-bookings',
        { requiresAuth: true }
      );
      return response.data || [];
    } catch (error: any) {
      console.error('AgencyDashboardService.getRecentBookings error:', error);
      return [];
    }
  }

  /**
   * Fetch Upcoming Departures for Authenticated Agency
   */
  public async getUpcomingDepartures(): Promise<DashboardUpcomingDeparture[]> {
    try {
      const response = await agencyApiClient.get<DashboardUpcomingDeparture[]>(
        '/agencies/dashboard/upcoming-departures',
        { requiresAuth: true }
      );
      return response.data || [];
    } catch (error: any) {
      console.error('AgencyDashboardService.getUpcomingDepartures error:', error);
      return [];
    }
  }
}

export const agencyDashboardService = new AgencyDashboardService();
