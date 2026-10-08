import { adminApiClient } from './adminApiClient';
import {
  AdminDepartureItem,
  DepartureKPIStats,
  DepartureFilters,
  DepartureDetailsResponse,
} from '../types/departureManagement';

export const initialDepartureKPIStats: DepartureKPIStats = {
  totalDepartures: { id: 'totalDepartures', title: 'Total Departures', value: '0', iconType: 'total', sparklineColor: '#6356E5' },
  upcomingDepartures: { id: 'upcomingDepartures', title: 'Upcoming Departures', value: '0', iconType: 'upcoming', sparklineColor: '#3B82F6' },
  todayDepartures: { id: 'todayDepartures', title: "Today's Departures", value: '0', iconType: 'today', sparklineColor: '#F59E0B' },
  ongoingDepartures: { id: 'ongoingDepartures', title: 'Ongoing Trips', value: '0', iconType: 'ongoing', sparklineColor: '#10B981' },
  completedDepartures: { id: 'completedDepartures', title: 'Completed Departures', value: '0', iconType: 'completed', sparklineColor: '#6B7280' },
  soldOutDepartures: { id: 'soldOutDepartures', title: 'Sold Out', value: '0', iconType: 'soldOut', sparklineColor: '#EF4444' },
  occupancyRate: { id: 'occupancyRate', title: 'Platform Occupancy', value: '0%', iconType: 'occupancy', sparklineColor: '#8B5CF6' },
};

export interface GetDeparturesResponse {
  departures: AdminDepartureItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class AdminDepartureService {
  /**
   * 1. Get Departures KPI Statistics
   */
  public async getKPIStats(): Promise<DepartureKPIStats> {
    try {
      const res = await adminApiClient.get<DepartureKPIStats>('/admin/departures/stats');
      return res.data || initialDepartureKPIStats;
    } catch {
      return initialDepartureKPIStats;
    }
  }

  /**
   * 2. Get Departures with filters and pagination
   */
  public async getDepartures(filters?: Partial<DepartureFilters>): Promise<GetDeparturesResponse> {
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        search: filters?.search || undefined,
        status: filters?.status && filters.status !== 'All' ? filters.status : undefined,
        agency: filters?.agency && filters.agency !== 'All' ? filters.agency : undefined,
        destination: filters?.destination && filters.destination !== 'All' ? filters.destination : undefined,
        departureDate: filters?.departureDate || undefined,
        startDate: filters?.startDate || undefined,
        endDate: filters?.endDate || undefined,
        page: filters?.page || 1,
        limit: filters?.limit || 15,
        sortBy: filters?.sortBy || 'departureDate',
        sortOrder: filters?.sortOrder || 'asc',
      };

      const res = await adminApiClient.get<GetDeparturesResponse>('/admin/departures', { params });
      return res.data || { departures: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0 } };
    } catch {
      return { departures: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0 } };
    }
  }

  /**
   * 3. Get Departure Details by ID
   */
  public async getDepartureById(departureId: string): Promise<DepartureDetailsResponse> {
    const res = await adminApiClient.get<DepartureDetailsResponse>(`/admin/departures/${departureId}`);
    if (!res.data) {
      throw new Error(res.message || 'Failed to fetch departure details');
    }
    return res.data;
  }
}

export const adminDepartureService = new AdminDepartureService();
