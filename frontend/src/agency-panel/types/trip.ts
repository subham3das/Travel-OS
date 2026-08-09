// ─── Trip Types ──────────────────────────────────────────────────────────────

export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface TripDocument {
  id: string;
  name: string;
  type: 'visa' | 'ticket' | 'hotel' | 'itinerary' | 'insurance' | 'other';
  url: string;
  uploadedAt: string;
}

export interface TripUpdate {
  id: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  createdAt: string;
}

export interface Trip {
  id: string;
  bookingId: string;
  agencyId: string;
  packageId: string;
  packageTitle: string;
  destination: string;
  coverImage?: string;
  status: TripStatus;
  startDate: string;
  endDate: string;
  travelers: { id: string; name: string; avatar?: string }[];
  documents: TripDocument[];
  updates: TripUpdate[];
  guideId?: string;
  guideName?: string;
  guidePhone?: string;
  vehicleInfo?: string;
  hotelInfo?: string;
  pickupLocation?: string;
  createdAt: string;
  updatedAt: string;
}
