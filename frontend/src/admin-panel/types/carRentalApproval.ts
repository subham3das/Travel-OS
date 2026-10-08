export interface CarRentalStats {
  pendingRequests: { count: number; growth: string; isPositive: boolean };
  approvedToday: { count: number; growth: string; isPositive: boolean };
  rejectedToday: { count: number; growth: string; isPositive: boolean };
  needsChanges: { count: number; growth: string; isPositive: boolean };
  totalVehicles: { count: number; growth: string; isPositive: boolean };
  avgApprovalTime: { value: string; growth: string; isPositive: boolean };
}

export interface CarRentalVehicleItem {
  id: string;
  name: string;
  brand: string;
  modelYear?: number;
  registrationNumber?: string;
  type: string;
  category: string;
  seats: number;
  fuel: string;
  transmission: string;
  dailyPrice: number;
  isAvailable: boolean;
  isActive: boolean;
  serviceType?: string;
  routePricing?: any;
  rentalPricing?: any;
  images: string[];
  thumbnail?: string;
  driver?: {
    name: string;
    phone?: string;
    experienceYears: number;
    rating: number;
    isVerified: boolean;
  };
}

export interface CarRentalDriverItem {
  name: string;
  phone: string;
  experienceYears: number;
  rating: number;
  licenseNumber?: string;
  isVerified: boolean;
  vehicleAssigned?: string;
}

export interface CarRentalDocumentItem {
  id: string;
  name: string;
  type: string;
  status: string;
  fileUrl: string;
  uploadedAt: string;
  rejectionReason?: string;
}

export interface CarRentalApprovalItem {
  id: string;
  applicationId: string;
  businessName: string;
  legalBusinessName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  logo: string;
  coverPhoto: string;
  verificationStatus: string;
  registeredDate: string;
  vehiclesCount: number;
  fleetType: string;
  commercialLicenseStatus: string;
  documentsUploadedCount: number;
  documentsTotalCount: number;
  city: string;
  state: string;
  country: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  businessLicenseNumber: string;
  fleetSize: number;
  operatingCities: string[];
  workingHours: string;
  emergencyContact: string;
  description: string;
  rejectionReason?: string;
  requestedChanges?: {
    issues: string[];
    message?: string;
    requestedAt?: string;
    requestedBy?: string;
  };
  reviewNotes?: string;
  lastUpdated: string;
  assignedReviewer?: string;
  complianceScore: number;
  timeline: Array<{
    id: string;
    title: string;
    timestamp: string;
    completed: boolean;
    color?: string;
    desc?: string;
  }>;
  activities: Array<{
    id: string;
    timestamp: string;
    adminName: string;
    action: string;
    notes?: string;
    status: string;
  }>;
  documents: CarRentalDocumentItem[];
  vehicles?: CarRentalVehicleItem[];
  drivers?: CarRentalDriverItem[];
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    status?: string;
    verified?: boolean;
  };
}

export interface CarRentalFilters {
  tab: 'Pending' | 'Approved' | 'Rejected' | 'Needs Changes' | 'All';
  status: string;
  state: string;
  city: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
