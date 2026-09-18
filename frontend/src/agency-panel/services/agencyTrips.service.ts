import { agencyApiClient } from './agencyApiClient';
import {
  TripStatusCategory,
  AgencyTrip,
  TripsQuickStatsData,
} from '../data/trips';
import {
  DetailedTripInfo,
  AssignedTeamMember,
  AssignedVehicle,
  HotelInfo,
  EmergencyInfo,
  TripOperationsData,
} from '../data/tripDetails';
import {
  TripLiveStatus,
  DayLiveStatus,
  TripIncident,
  TripNote,
  TripPhoto,
  TimelineDay,
} from '../data/tripTimeline';
import { TripAnnouncement } from '../data/announcements';
import { TripTravelGroup, QuickContact } from '../data/travelers';

export interface GetAgencyTripsParams {
  page?: number;
  limit?: number;
  search?: string;
  statusCategory?: TripStatusCategory;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AgencyTripsResponse {
  trips: AgencyTrip[];
  tabCounts: Record<TripStatusCategory, number>;
  stats: TripsQuickStatsData;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TripDetailResponse extends DetailedTripInfo {
  teamAssignments: AssignedTeamMember[];
  vehicleAssignments: AssignedVehicle[];
  hotelInformation: HotelInfo | null;
  emergencyInformation: EmergencyInfo | null;
  timelineDays: TimelineDay[];
  incidents: TripIncident[];
  notes: TripNote[];
  internalNotes?: any[];
  photos: TripPhoto[];
  announcements: TripAnnouncement[];
  travelerGroups: TripTravelGroup[];
  quickContacts: QuickContact[];
}

export class AgencyTripsService {
  /**
   * Fetch all operational trips with filters and stats
   */
  static async getTrips(params: GetAgencyTripsParams = {}): Promise<AgencyTripsResponse> {
    const queryParams: Record<string, any> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.search) queryParams.search = params.search;
    if (params.statusCategory) queryParams.statusCategory = params.statusCategory;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;

    const response = await agencyApiClient.get<AgencyTripsResponse>('/agency/trips', { params: queryParams });
    if (!response.data) throw new Error(response.message || 'Failed to fetch trips');
    return response.data;
  }

  /**
   * Fetch single trip details
   */
  static async getTripById(tripId: string): Promise<TripDetailResponse> {
    const response = await agencyApiClient.get<TripDetailResponse>(`/agency/trips/${tripId}`);
    if (!response.data) throw new Error(response.message || 'Failed to fetch trip details');
    return response.data;
  }

  /**
   * Update Team Assignments
   */
  static async updateTripTeam(tripId: string, teamAssignments: AssignedTeamMember[]): Promise<any> {
    const response = await agencyApiClient.patch(`/agency/trips/${tripId}/team`, { teamAssignments });
    return response.data;
  }

  /**
   * Update Vehicle Assignments
   */
  static async updateTripVehicle(tripId: string, vehicleAssignments: AssignedVehicle[]): Promise<any> {
    const response = await agencyApiClient.patch(`/agency/trips/${tripId}/vehicle`, { vehicleAssignments });
    return response.data;
  }

  /**
   * Update Hotel Information
   */
  static async updateTripHotel(tripId: string, hotelInformation: HotelInfo): Promise<any> {
    const response = await agencyApiClient.patch(`/agency/trips/${tripId}/hotel`, { hotelInformation });
    return response.data;
  }

  /**
   * Update Emergency Information
   */
  static async updateTripEmergency(tripId: string, emergencyInformation: EmergencyInfo): Promise<any> {
    const response = await agencyApiClient.patch(`/agency/trips/${tripId}/emergency`, { emergencyInformation });
    return response.data;
  }

  /**
   * Update Trip Status
   */
  static async updateTripStatus(tripId: string, status: TripLiveStatus | TripStatusCategory): Promise<any> {
    const response = await agencyApiClient.patch(`/agency/trips/${tripId}/status`, { status });
    return response.data;
  }

  /**
   * Update Traveler Attendance / Check-in
   */
  static async updateTravelerAttendance(tripId: string, travelerId: string, checkInStatus: string): Promise<any> {
    const response = await agencyApiClient.patch(`/agency/trips/${tripId}/travelers/${travelerId}/attendance`, { checkInStatus });
    return response.data;
  }

  /**
   * Check in all travelers
   */
  static async checkInAllTravelers(tripId: string): Promise<any> {
    const response = await agencyApiClient.post(`/agency/trips/${tripId}/travelers/check-in-all`);
    return response.data;
  }

  /**
   * Create Announcement
   */
  static async createAnnouncement(tripId: string, data: Omit<TripAnnouncement, 'id' | 'createdAt'>): Promise<TripAnnouncement> {
    const response = await agencyApiClient.post<TripAnnouncement>(`/agency/trips/${tripId}/announcements`, data);
    if (!response.data) throw new Error(response.message || 'Failed to create announcement');
    return response.data;
  }

  /**
   * Add Incident
   */
  static async addIncident(tripId: string, incident: Omit<TripIncident, 'id'>): Promise<TripIncident> {
    const response = await agencyApiClient.post<TripIncident>(`/agency/trips/${tripId}/incidents`, incident);
    if (!response.data) throw new Error(response.message || 'Failed to add incident');
    return response.data;
  }

  /**
   * Toggle Incident Resolved
   */
  static async toggleResolveIncident(tripId: string, incidentId: string): Promise<TripIncident[]> {
    const response = await agencyApiClient.patch<TripIncident[]>(`/agency/trips/${tripId}/incidents/${incidentId}/toggle`);
    if (!response.data) throw new Error(response.message || 'Failed to update incident');
    return response.data;
  }

  /**
   * Add Note
   */
  static async addNote(tripId: string, note: Omit<TripNote, 'id'>): Promise<TripNote> {
    const response = await agencyApiClient.post<TripNote>(`/agency/trips/${tripId}/notes`, note);
    if (!response.data) throw new Error(response.message || 'Failed to add note');
    return response.data;
  }

  /**
   * Add Photo
   */
  static async addPhoto(tripId: string, photo: Omit<TripPhoto, 'id'>): Promise<TripPhoto> {
    const response = await agencyApiClient.post<TripPhoto>(`/agency/trips/${tripId}/photos`, photo);
    if (!response.data) throw new Error(response.message || 'Failed to add photo');
    return response.data;
  }

  /**
   * Update Timeline Day Status
   */
  static async updateTimelineDayStatus(tripId: string, dayNumber: number, status: DayLiveStatus): Promise<TimelineDay[]> {
    const response = await agencyApiClient.patch<TimelineDay[]>(`/agency/trips/${tripId}/days/${dayNumber}/status`, { status });
    if (!response.data) throw new Error(response.message || 'Failed to update timeline day status');
    return response.data;
  }
}

export const agencyTripsService = AgencyTripsService;
