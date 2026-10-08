import { agencyApiClient } from './agencyApiClient';

export type DepartureStatus =
  | 'OPEN'
  | 'UPCOMING'
  | 'SOLDOUT'
  | 'BOOKING_CLOSED'
  | 'ONGOING'
  | 'COMPLETED';

export interface DepartureItem {
  id: string;
  departureId: string;
  packageId: string;
  packageName: string;
  destination: string;
  coverImage: string;
  departureDate: string;
  endDate: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  status: DepartureStatus;
  isManualClosed: boolean;
  bookingOpens: string;
  bookingCloses: string;
  price: number;
}

export interface DepartureTravelerItem {
  bookingId: string;
  bookingMongoId: string;
  travelerTitle: string;
  primaryName: string;
  bookingType: 'Solo' | 'Couple' | 'Group';
  phone: string;
  email: string;
  seats: number;
  bookingStatus: string;
  pickupPreference?: string;
  address?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  medicalNotes?: string;
  documents?: Array<{
    id?: string;
    title: string;
    url: string;
    status?: string;
  }>;
  travelers: Array<{
    name: string;
    age: number;
    gender: string;
    phone?: string;
    email?: string;
    isPrimary?: boolean;
    governmentId?: {
      type: 'Aadhaar' | 'Voter ID' | 'None';
      status: string;
      number?: string;
      frontUrl?: string;
      backUrl?: string;
    };
    drivingLicence?: {
      status: 'Uploaded' | 'Not Uploaded';
      number?: string;
      frontUrl?: string;
      backUrl?: string;
    };
    passport?: {
      status: 'Uploaded' | 'Not Uploaded';
      number?: string;
      documentUrl?: string;
    };
  }>;
  bookedAt: string;
}

export interface DepartureTravelersResponse {
  departure: DepartureItem;
  travelers: DepartureTravelerItem[];
}

export interface ScheduleDeparturePayload {
  packageId: string;
  departureDate: string;
  capacity: number;
  bookingOpens?: string;
  bookingCloses?: string;
  priceOverride?: number;
  notes?: string;
}

class AgencyDepartureService {
  public async getDepartures(): Promise<DepartureItem[]> {
    const res = await agencyApiClient.get<DepartureItem[]>('/agency/departures', {
      requiresAuth: true,
    });
    return res.data || [];
  }

  public async scheduleDeparture(payload: ScheduleDeparturePayload): Promise<DepartureItem> {
    const res = await agencyApiClient.post<DepartureItem>('/agency/departures', payload, {
      requiresAuth: true,
    });
    return res.data!;
  }

  public async getDepartureTravelers(departureId: string): Promise<DepartureTravelersResponse> {
    const res = await agencyApiClient.get<DepartureTravelersResponse>(
      `/agency/departures/${departureId}/travelers`,
      { requiresAuth: true }
    );
    return res.data!;
  }

  public async startTrip(departureId: string): Promise<{ status: DepartureStatus; tripId?: string }> {
    const res = await agencyApiClient.patch<{ status: DepartureStatus; tripId?: string }>(
      `/agency/departures/${departureId}/start`,
      {},
      { requiresAuth: true }
    );
    return res.data || { status: 'ONGOING' };
  }

  public async rescheduleDeparture(departureId: string, newDepartureDate: string): Promise<DepartureItem> {
    const res = await agencyApiClient.patch<DepartureItem>(
      `/agency/departures/${departureId}/reschedule`,
      { newDepartureDate },
      { requiresAuth: true }
    );
    return res.data!;
  }

  public async closeBooking(departureId: string): Promise<DepartureStatus> {
    const res = await agencyApiClient.patch<{ status: DepartureStatus }>(
      `/agency/departures/${departureId}/close`,
      {},
      { requiresAuth: true }
    );
    return res.data?.status || 'BOOKING_CLOSED';
  }

  public async endTrip(departureId: string): Promise<DepartureStatus> {
    const res = await agencyApiClient.patch<{ status: DepartureStatus }>(
      `/agency/departures/${departureId}/end`,
      {},
      { requiresAuth: true }
    );
    return res.data?.status || 'COMPLETED';
  }

  public async cancelDeparture(departureId: string): Promise<void> {
    await agencyApiClient.patch(
      `/agency/departures/${departureId}/cancel`,
      {},
      { requiresAuth: true }
    );
  }

  public async downloadExcel(departureId: string, filename?: string): Promise<void> {
    const token = agencyApiClient.getAccessToken();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_BASE_URL}/agency/departures/${departureId}/export/excel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export Excel manifest');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `Departure_${departureId}_Travelers.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  public async downloadPdf(departureId: string): Promise<void> {
    const token = agencyApiClient.getAccessToken();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_BASE_URL}/agency/departures/${departureId}/export/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export PDF manifest');
    }

    const html = await response.text();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }
}

export const agencyDepartureService = new AgencyDepartureService();
