import apiClient from '../../services/apiClient';

export interface AadhaarDocument {
  number?: string;
  frontUrl?: string;
  backUrl?: string;
}

export interface VoterIdDocument {
  number?: string;
  frontUrl?: string;
}

export interface DrivingLicenceDocument {
  number?: string;
  frontUrl?: string;
  backUrl?: string;
}

export interface PassportDocument {
  number?: string;
  expiryDate?: string;
  documentUrl?: string;
}

export interface TravelProfileEmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export function hasValidGovId(traveler?: {
  aadhaar?: AadhaarDocument;
  voterId?: VoterIdDocument;
}): { isValid: boolean; type?: 'Aadhaar' | 'Voter ID'; label: string; reason?: string } {
  if (!traveler) return { isValid: false, label: 'Missing', reason: 'Traveler data missing' };
  if (traveler.aadhaar?.frontUrl && traveler.aadhaar?.backUrl) {
    return { isValid: true, type: 'Aadhaar', label: '✓ Aadhaar Verified' };
  }
  if (traveler.voterId?.frontUrl) {
    return { isValid: true, type: 'Voter ID', label: '✓ Voter ID Verified' };
  }
  if (traveler.aadhaar?.frontUrl && !traveler.aadhaar?.backUrl) {
    return { isValid: false, label: 'Incomplete Aadhaar', reason: 'Aadhaar back side is required' };
  }
  return { isValid: false, label: 'Missing Gov ID', reason: 'Upload Aadhaar (Front & Back) or Voter ID Card' };
}

export interface TravelProfileData {
  id?: string;
  fullName: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  pin?: string;
  emergencyContact?: TravelProfileEmergencyContact;
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
  aadhaar?: AadhaarDocument;
  voterId?: VoterIdDocument;
  drivingLicence?: DrivingLicenceDocument;
  passport?: PassportDocument;
  travelPreferences?: {
    seatPreference?: string;
    mealPreference?: string;
    specialAssistance?: string;
  };
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  completionPercentage: number;
  missingFields: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedTravelerItem {
  id: string;
  fullName: string;
  dob?: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'friend' | 'other';
  nationality: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: TravelProfileEmergencyContact;
  medicalNotes?: string;
  bloodGroup?: string;
  aadhaar?: AadhaarDocument;
  voterId?: VoterIdDocument;
  drivingLicence?: DrivingLicenceDocument;
  passport?: PassportDocument;
  photoUrl?: string;
  isArchived: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelProfileStats {
  completionPercentage: number;
  missingFields: string[];
  savedTravelersCount: number;
  isVerified: boolean;
}

export interface TravelProfileResponse {
  profile: TravelProfileData;
  stats: TravelProfileStats;
}

export const travelProfileService = {
  /**
   * Get user travel profile & stats
   */
  async getProfile(): Promise<TravelProfileResponse> {
    const res = await apiClient.get<TravelProfileResponse>('/profile/travel-profile');
    if (!res.data) throw new Error(res.message || 'Failed to load travel profile');
    return res.data;
  },

  async updateProfile(data: Partial<TravelProfileData>): Promise<TravelProfileResponse> {
    const res = await apiClient.put<TravelProfileResponse>('/profile/travel-profile', data);
    if (!res.data) throw new Error(res.message || 'Failed to update travel profile');
    return res.data;
  },

  async listSavedTravelers(includeArchived: boolean = false): Promise<SavedTravelerItem[]> {
    const res = await apiClient.get<{ travelers: SavedTravelerItem[] }>(
      `/travelers${includeArchived ? '?includeArchived=true' : ''}`
    );
    return res.data?.travelers || [];
  },

  async addSavedTraveler(data: Partial<SavedTravelerItem>): Promise<SavedTravelerItem> {
    const res = await apiClient.post<{ traveler: SavedTravelerItem }>('/travelers', data);
    if (!res.data?.traveler) throw new Error(res.message || 'Failed to add saved traveler');
    return res.data.traveler;
  },

  async updateSavedTraveler(
    id: string,
    data: Partial<SavedTravelerItem>
  ): Promise<SavedTravelerItem> {
    const res = await apiClient.patch<{ traveler: SavedTravelerItem }>(`/travelers/${id}`, data);
    if (!res.data?.traveler) throw new Error(res.message || 'Failed to update saved traveler');
    return res.data.traveler;
  },

  /**
   * Archive / unarchive traveler
   */
  async archiveSavedTraveler(id: string, isArchived: boolean = true): Promise<void> {
    await apiClient.patch(`/travelers/${id}/archive`, { isArchived });
  },

  /**
   * Soft delete traveler
   */
  async deleteSavedTraveler(id: string): Promise<void> {
    await apiClient.delete(`/travelers/${id}`);
  },
};
