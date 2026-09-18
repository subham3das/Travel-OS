import { apiClient } from '../../services/apiClient';
import { Trip, UserBooking, TravelStats } from '../data/trips';
import { TravelDocument } from '../data/documents';

export interface MyTripsResponse {
  trips: Trip[];
  bookings: UserBooking[];
  stats: TravelStats;
}

class TripService {
  /**
   * Fetch all trips, bookings, and travel stats for current user
   */
  public async getMyTrips(): Promise<MyTripsResponse> {
    const res = await apiClient.get<MyTripsResponse>('/trips/my');
    return res.data || {
      trips: [],
      bookings: [],
      stats: {
        totalTrips: 0,
        upcomingTrips: 0,
        completedTrips: 0,
        countriesVisited: 0,
        lifetimeSpend: '₹0',
        avgRatingGiven: 5.0,
        badges: [],
      },
    };
  }

  /**
   * Fetch details of a single trip or booking
   */
  public async getTripById(id: string): Promise<Trip> {
    const res = await apiClient.get<{ trip: Trip }>(`/trips/${encodeURIComponent(id)}`);
    if (!res.data?.trip) {
      throw new Error(res.message || 'Trip not found');
    }
    return res.data.trip;
  }

  /**
   * Fetch official travel documents for a trip
   */
  public async getTripDocuments(tripId: string): Promise<TravelDocument[]> {
    const res = await apiClient.get<{ documents: TravelDocument[] }>(`/trips/${encodeURIComponent(tripId)}/documents`);
    return res.data?.documents || [];
  }

  /**
   * Fetch user travel stats
   */
  public async getTravelStats(): Promise<TravelStats> {
    const res = await apiClient.get<{ stats: TravelStats }>('/trips/stats');
    return res.data?.stats || {
      totalTrips: 0,
      upcomingTrips: 0,
      completedTrips: 0,
      countriesVisited: 0,
      lifetimeSpend: '₹0',
      avgRatingGiven: 5.0,
      badges: [],
    };
  }
}

export const tripService = new TripService();
