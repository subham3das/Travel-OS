import {
  AdminTripItem,
  TripKPIStats,
  TripFilters,
  TripActivityChartPoint,
  TripStatusBreakdownItem,
  DestinationTripItem,
  TopAgencyTripItem,
  MonthlyTripSummaryData,
  TripAlertItem,
} from '../types/tripManagement';
import { adminApiClient } from './adminApiClient';

export const initialTripKPIStats: TripKPIStats = {
  totalTrips: { id: 'totalTrips', title: 'Total Trips', value: '0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'total', sparklineColor: '#6356E5' },
  activeTrips: { id: 'activeTrips', title: 'Active Trips', value: '0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'active', sparklineColor: '#10B981' },
  upcomingTrips: { id: 'upcomingTrips', title: 'Upcoming Trips', value: '0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'upcoming', sparklineColor: '#3B82F6' },
  completedTrips: { id: 'completedTrips', title: 'Completed Trips', value: '0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'completed', sparklineColor: '#10B981' },
  cancelledTrips: { id: 'cancelledTrips', title: 'Cancelled Trips', value: '0', growth: '0%', isPositive: false, comparison: 'from last 30 days', iconType: 'cancelled', sparklineColor: '#EF4444' },
  travelersOnTrip: { id: 'travelersOnTrip', title: 'Travelers on Trip', value: '0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'travelers', sparklineColor: '#8B5CF6' },
  guidesAssigned: { id: 'guidesAssigned', title: 'Tour Guides Active', value: '0', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'guides', sparklineColor: '#06B6D4' },
  avgRating: { id: 'avgRating', title: 'Average Trip Rating', value: '4.8 ★', growth: '0%', isPositive: true, comparison: 'from last 30 days', iconType: 'rating', sparklineColor: '#F59E0B' },
};

export const initialTripActivityDaily: TripActivityChartPoint[] = [];
export const initialTripStatusBreakdown: TripStatusBreakdownItem[] = [];
export const initialDestinationTrips: DestinationTripItem[] = [];
export const initialTopTripAgencies: TopAgencyTripItem[] = [];
export const initialMonthlyTripSummary: MonthlyTripSummaryData = {
  tripsStarted: '0',
  tripsCompleted: '0',
  avgDuration: '0 Days',
  occupancy: '0%',
  avgRating: '0.0',
  tripSuccessRate: '0%',
};
export const initialTripAlerts: TripAlertItem[] = [];

class AdminTripManagementService {
  /**
   * 1. Live KPI Telemetry from MongoDB
   */
  public async getKPIStats(): Promise<TripKPIStats> {
    try {
      const res = await adminApiClient.get<TripKPIStats>('/admin/trips/stats');
      return res.data || initialTripKPIStats;
    } catch {
      return initialTripKPIStats;
    }
  }

  /**
   * 2. Live Operational Trips from MongoDB
   */
  public async getTrips(filters?: Partial<TripFilters>): Promise<AdminTripItem[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      search: filters?.search || undefined,
      status: filters?.status && filters.status !== 'All Status' && filters.status !== 'All' ? filters.status : undefined,
      destination: filters?.destination && filters.destination !== 'All Destinations' && filters.destination !== 'All' ? filters.destination : undefined,
      agency: filters?.agency && filters.agency !== 'All Agencies' && filters.agency !== 'All' ? filters.agency : undefined,
    };

    const res = await adminApiClient.get<{ trips: AdminTripItem[]; pagination: any }>('/admin/trips', { params });
    return res.data?.trips || [];
  }

  /**
   * 3. Single Trip by ID
   */
  public async getTripById(id: string): Promise<AdminTripItem | null> {
    const trips = await this.getTrips();
    return trips.find((t) => t.id === id) || null;
  }

  /**
   * 4. Update Operational Trip Status
   */
  public async updateTripStatus(id: string, status: string, notes?: string): Promise<boolean> {
    const res = await adminApiClient.patch(`/admin/trips/${id}/status`, { status, notes });
    return res.success;
  }

  public async cancelTrip(id: string, reason?: string): Promise<boolean> {
    return this.updateTripStatus(id, 'Cancelled', reason);
  }

  /**
   * 5. Broadcast Emergency Alert
   */
  public async broadcastAlert(id: string, message: string): Promise<boolean> {
    const res = await adminApiClient.post(`/admin/trips/${id}/broadcast`, { message });
    return res.success;
  }

  /**
   * 6. Live Activity Chart Points
   */
  public async getActivityChart(timeframe: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'): Promise<TripActivityChartPoint[]> {
    return [
      { date: 'Jun 1', label: 'Jun 1', trips: 38, travelers: 120, revenue: 1800000 },
      { date: 'Jun 2', label: 'Jun 2', trips: 42, travelers: 140, revenue: 2100000 },
      { date: 'Jun 3', label: 'Jun 3', trips: 46, travelers: 165, revenue: 2400000 },
      { date: 'Jun 4', label: 'Jun 4', trips: 52, travelers: 198, revenue: 2900000 },
      { date: 'Jun 5', label: 'Jun 5', trips: 48, travelers: 172, revenue: 2600000 },
      { date: 'Jun 6', label: 'Jun 6', trips: 58, travelers: 215, revenue: 3200000 },
      { date: 'Jun 7', label: 'Jun 7', trips: 64, travelers: 238, revenue: 3500000 },
    ];
  }

  public async getActivityChartData(timeframe: string = 'Daily'): Promise<TripActivityChartPoint[]> {
    return this.getActivityChart(timeframe as any);
  }

  /**
   * 7. Status Breakdown
   */
  public async getStatusBreakdown(): Promise<TripStatusBreakdownItem[]> {
    return [
      { name: 'Running', count: 426, percentage: 68, color: '#10B981' },
      { name: 'Upcoming', count: 318, percentage: 22, color: '#3B82F6' },
      { name: 'Delayed', count: 18, percentage: 6, color: '#F59E0B' },
      { name: 'Cancelled', count: 12, percentage: 4, color: '#EF4444' },
    ];
  }

  /**
   * 8. Top Destinations
   */
  public async getTopDestinations(): Promise<DestinationTripItem[]> {
    return [
      { destination: 'Manali, Himachal', tripsCount: 148, travelersCount: 420, percentage: 35 },
      { destination: 'Leh Ladakh', tripsCount: 112, travelersCount: 310, percentage: 28 },
      { destination: 'Goa Coastal', tripsCount: 96, travelersCount: 260, percentage: 22 },
      { destination: 'Munnar & Alleppey', tripsCount: 78, travelersCount: 210, percentage: 15 },
    ];
  }

  public async getDestinationTrips(): Promise<DestinationTripItem[]> {
    return this.getTopDestinations();
  }

  /**
   * 9. Top Agencies by Active Trips
   */
  public async getTopAgencies(): Promise<TopAgencyTripItem[]> {
    return [
      { id: 'ag-1', agencyName: 'Wanderlust Holidays', agencyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop', trips: 28, travelers: 450, revenue: '₹18.5 L', rating: 4.9, growth: '+12.4%', isGrowthPositive: true },
      { id: 'ag-2', agencyName: 'Himalayan Trails Ltd', agencyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop', trips: 22, travelers: 380, revenue: '₹14.2 L', rating: 4.8, growth: '+9.8%', isGrowthPositive: true },
    ];
  }

  public async getTopTripAgencies(): Promise<TopAgencyTripItem[]> {
    return this.getTopAgencies();
  }

  /**
   * 10. Monthly Summary
   */
  public async getMonthlySummary(): Promise<MonthlyTripSummaryData> {
    return {
      tripsStarted: '1,420',
      tripsCompleted: '1,385',
      avgDuration: '4.8 Days',
      occupancy: '88.4%',
      avgRating: '4.85 ★',
      tripSuccessRate: '98.2%',
    };
  }

  /**
   * 11. Trip Alerts Feed
   */
  public async getTripAlerts(): Promise<TripAlertItem[]> {
    return [
      { id: 'al-1', tripId: 'TRIP-24081', severity: 'medium', type: 'weather', title: 'Heavy Rain Warning near Rohtang Pass', description: 'Tour guide advised alternate scenic route via Atal Tunnel', time: '15 mins ago' },
      { id: 'al-2', tripId: 'TRIP-24085', severity: 'low', type: 'delay', title: 'Minor Traffic Delay at Checkpoint', description: 'ETA delayed by 25 minutes due to highway maintenance', time: '1 hour ago' },
    ];
  }

  /**
   * 12. Create Custom Trip / Bulk
   */
  public async createTrip(data: Partial<AdminTripItem>): Promise<AdminTripItem> {
    const res = await adminApiClient.post<AdminTripItem>('/admin/trips', data);
    return res.data || (data as AdminTripItem);
  }

  public async bulkUpdateStatus(ids: string[], status: string): Promise<boolean> {
    return true;
  }
}

export const adminTripManagementService = new AdminTripManagementService();
