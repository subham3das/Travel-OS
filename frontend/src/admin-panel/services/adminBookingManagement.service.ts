import {
  AdminBookingItem,
  BookingKPIStats,
  BookingFilters,
  BookingSortConfig,
} from '../types/bookingManagement';
import { adminApiClient } from './adminApiClient';

export const initialBookingKPIStats: BookingKPIStats = {
  totalBookings: { count: 0, growth: '0%', isPositive: true },
  confirmedBookings: { count: 0, growth: '0%', isPositive: true },
  pendingBookings: { count: 0, growth: '0%', isPositive: true },
  cancelledBookings: { count: 0, growth: '0%', isPositive: false },
  totalRevenue: { value: '₹0', growth: '0%', isPositive: true },
  refundedAmount: { value: '₹0', growth: '0%', isPositive: false },
};

class AdminBookingManagementService {
  /**
   * 1. Live KPI Telemetry from MongoDB
   */
  public async getKPIStats(): Promise<BookingKPIStats> {
    try {
      const res = await adminApiClient.get<BookingKPIStats>('/admin/bookings/stats');
      return res.data || initialBookingKPIStats;
    } catch {
      return initialBookingKPIStats;
    }
  }

  /**
   * 2. Live Paginated Bookings from MongoDB
   */
  public async getBookings(
    filters?: Partial<BookingFilters>,
    sort?: BookingSortConfig,
    pagination?: { page: number; limit: number }
  ): Promise<AdminBookingItem[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 100,
      search: filters?.search || undefined,
      bookingStatus: filters?.bookingStatus && filters.bookingStatus !== 'All Status' && filters.bookingStatus !== 'All' ? filters.bookingStatus : undefined,
      paymentStatus: filters?.paymentStatus && filters.paymentStatus !== 'All Payment Status' && filters.paymentStatus !== 'All' ? filters.paymentStatus : undefined,
      package: filters?.package && filters.package !== 'All Packages' && filters.package !== 'All' ? filters.package : undefined,
      agency: filters?.agency && filters.agency !== 'All Agencies' && filters.agency !== 'All' ? filters.agency : undefined,
      destination: filters?.destination && filters.destination !== 'All Destinations' && filters.destination !== 'All' ? filters.destination : undefined,
      travelDate: filters?.travelDate && filters.travelDate !== 'All Travel Dates' ? filters.travelDate : undefined,
      bookingDate: filters?.bookingDate && filters.bookingDate !== 'All Booking Dates' ? filters.bookingDate : undefined,
      sortBy: sort?.key || 'createdAt',
      sortOrder: sort?.direction || 'desc',
    };

    const res = await adminApiClient.get<{ bookings: AdminBookingItem[]; pagination: any }>('/admin/bookings', {
      params,
    });

    return res.data?.bookings || [];
  }

  /**
   * 3. Single Booking with Full Manifest
   */
  public async getBookingById(id: string): Promise<AdminBookingItem | null> {
    const res = await adminApiClient.get<AdminBookingItem>(`/admin/bookings/${id}`);
    return res.data || null;
  }

  /**
   * 4. Update Booking in MongoDB
   */
  public async updateBooking(id: string, updates: Partial<AdminBookingItem>): Promise<AdminBookingItem | null> {
    const res = await adminApiClient.patch<AdminBookingItem>(`/admin/bookings/${id}`, updates);
    return res.data || null;
  }

  /**
   * 5. Confirm Booking
   */
  public async confirmBooking(id: string): Promise<boolean> {
    const res = await adminApiClient.patch(`/admin/bookings/${id}`, {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    });
    return res.success;
  }

  /**
   * 6. Cancel Booking
   */
  public async cancelBooking(id: string, reason?: string): Promise<boolean> {
    const res = await adminApiClient.post(`/admin/bookings/${id}/cancel`, {
      reason: reason || 'Cancelled by Super Admin',
    });
    return res.success;
  }

  /**
   * 7. Refund Booking
   */
  public async refundBooking(id: string): Promise<boolean> {
    const res = await adminApiClient.post(`/admin/bookings/${id}/cancel`, {
      reason: 'Refund requested by Super Admin',
    });
    return res.success;
  }

  /**
   * 8. Bulk Actions
   */
  public async bulkConfirm(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/bookings/bulk-action', {
      bookingIds: ids,
      action: 'confirm',
    });
    return res.success;
  }

  public async bulkCancel(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/bookings/bulk-action', {
      bookingIds: ids,
      action: 'cancel',
    });
    return res.success;
  }

  public async bulkRefund(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/bookings/bulk-action', {
      bookingIds: ids,
      action: 'cancel',
    });
    return res.success;
  }
}

export const adminBookingManagementService = new AdminBookingManagementService();
