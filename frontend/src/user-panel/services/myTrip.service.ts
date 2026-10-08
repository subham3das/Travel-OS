import { apiClient } from '../../services/apiClient';
import { GetCurrentTripResponse } from '../types/currentTrip';

class MyTripService {
  /**
   * Fetch the user's single ongoing trip.
   * GET /api/my/current-trip
   *
   * Returns { hasTrip: true, trip: {...} } or { hasTrip: false }.
   * Never returns mock data or dummy trips.
   */
  public async getCurrentTrip(): Promise<GetCurrentTripResponse> {
    const res = await apiClient.get<GetCurrentTripResponse>('/my/current-trip');
    // Unwrap the standard { success, data } envelope from apiClient
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? res;
    if (payload && typeof payload.hasTrip === 'boolean') {
      return payload as GetCurrentTripResponse;
    }
    return { hasTrip: false };
  }

  /**
   * Fetch customer package bookings.
   * GET /api/my/bookings/packages
   */
  public async getMyPackageBookings(): Promise<any[]> {
    try {
      const res = await apiClient.get<any>('/my/bookings/packages');
      return (res as any)?.data?.data?.bookings ?? (res as any)?.data?.bookings ?? [];
    } catch (err) {
      console.warn('MyTripService: Failed to fetch package bookings:', err);
      return [];
    }
  }

  /**
   * Fetch customer car rental bookings.
   * GET /api/my/bookings/car-rentals
   */
  public async getMyCarRentalBookings(): Promise<any[]> {
    try {
      const res = await apiClient.get<any>('/my/bookings/car-rentals');
      return (res as any)?.data?.data?.bookings ?? (res as any)?.data?.bookings ?? [];
    } catch (err) {
      console.warn('MyTripService: Failed to fetch car rental bookings:', err);
      return [];
    }
  }
}

export const myTripService = new MyTripService();
