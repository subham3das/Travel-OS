/**
 * Simplified "current ongoing trip" types.
 *
 * All fields are backend-calculated. The frontend never does date math
 * or progress computation — it just renders what the API returns.
 */

export interface OngoingTripDTO {
  id: string;
  bookingId: string;
  packageId: string;
  packageName: string;
  coverImage: string;
  agencyName: string;
  destination: string;
  startDate: string;          // ISO string
  endDate: string;            // ISO string
  currentDay: number;
  totalDays: number;
  progressPercentage: number; // 0–100, server-calculated
  status: 'ONGOING';
  // Button routes
  viewRoute: string;
  chatRoute: string;
  documentsRoute: string;
  emergencyPhone: string;
}

export type GetCurrentTripResponse =
  | { hasTrip: true; trip: OngoingTripDTO }
  | { hasTrip: false };
