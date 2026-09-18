import mongoose, { Document, Schema } from 'mongoose';

export type TripStatusCategory = 'Pending Setup' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
export type DayLiveStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Delayed' | 'Skipped';
export type TripLiveStatus = 'Pending Setup' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Archived';
export type IncidentCategory = 'Medical Emergency' | 'Vehicle Breakdown' | 'Weather Issue' | 'Lost Luggage' | 'Late Arrival' | 'Other';
export type PhotoCategory = 'Departure' | 'Hotel Check-in' | 'Sightseeing' | 'Group Photos' | 'Other';
export type AnnouncementType = 'General' | 'Schedule Change' | 'Meeting Point' | 'Hotel Update' | 'Transport' | 'Meal Update' | 'Emergency';
export type AnnouncementStatus = 'Sent' | 'Scheduled' | 'Draft';

export interface IAssignedTeamMember {
  id: string;
  name: string;
  role: 'Trip Manager' | 'Trip Host' | 'Guide' | 'Driver' | 'Support Staff' | 'Photographer' | 'Medical Staff' | 'Tour Guide' | 'Assistant Guide' | 'Coordinator';
  phone?: string;
  avatar: string;
  experienceText?: string;
  isOnline?: boolean;
  isAssigned?: boolean;
}

export interface IAssignedVehicle {
  id: string;
  name: string;
  registrationNumber: string;
  type: string;
  capacity: number;
  assignedDriver: string;
  status: 'Available' | 'Assigned' | 'Maintenance';
  image: string;
}

export interface IHotelInfo {
  hotelName: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
  roomAllocationNotes: string;
}

export interface IEmergencyInfo {
  contactPerson: string;
  contactPhone: string;
  nearestHospital: string;
  nearestPoliceStation: string;
  backupVehicleContact: string;
  additionalNotes: string;
}

export interface IOperationsChecklistItem {
  id: 'team' | 'vehicle' | 'hotel' | 'emergency';
  label: string;
  isCompleted: boolean;
}

export interface ITimelineActivity {
  id: string;
  time: string;
  title: string;
  status: DayLiveStatus;
  location?: string;
}

export interface IDailyChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface ITimelineDay {
  dayNumber: number;
  dateText: string;
  title: string;
  status: DayLiveStatus;
  guideName: string;
  hotelName: string;
  vehicleName: string;
  pickupTime: string;
  departureTime: string;
  arrivalTime: string;
  meals: string;
  notes: string;
  activities: ITimelineActivity[];
  checklist: IDailyChecklistItem[];
}

export interface ITripIncident {
  id: string;
  timestampText: string;
  category: IncidentCategory;
  description: string;
  isResolved: boolean;
  reportedBy: string;
}

export interface ITripNote {
  id: string;
  timestampText: string;
  author: string;
  authorRole: string;
  content: string;
}

export interface ITripPhoto {
  id: string;
  url: string;
  caption: string;
  category: PhotoCategory;
  timestampText: string;
}

export interface ITripAnnouncement {
  id: string;
  tripId: string;
  title: string;
  message: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  author: string;
  createdAt: string;
  scheduledAt?: string;
  deliveryOptions: {
    notifyAllTravelers: boolean;
    pushNotification: boolean;
    saveToTimeline: boolean;
  };
}

export interface ITripTravelerRecord {
  id: string;
  bookingId: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  phone: string;
  email?: string;
  avatar: string;
  travelerCount: number;
  seatNumbers: string[];
  roleInBooking?: 'Primary Traveler' | 'Travel Partner';
  primaryTravelerName?: string;
  paymentStatus: 'Payment Complete' | 'Payment Pending' | 'Partial' | 'Paid' | 'Pending';
  checkInStatus: 'Checked In' | 'Not Checked In' | 'Pending' | 'Not Arrived';
  verificationStatus: 'Verified' | 'Unverified';
  hasMedicalNotes: boolean;
  medicalNotesText?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface ITripTravelGroup {
  groupId: string;
  bookingId: string;
  groupName: string;
  groupCategory: 'Family' | 'Friends' | 'Solo' | 'Group';
  paymentStatus: 'Payment Complete' | 'Payment Pending';
  primaryTraveler: ITripTravelerRecord;
  companions: ITripTravelerRecord[];
  totalTravelersCount: number;
}

export interface ITripQuickContact {
  id: string;
  label: string;
  sublabel: string;
  phone: string;
  iconType: 'phone' | 'person' | 'hotel';
}

export interface ITripInternalNote {
  id: string;
  noteText: string;
  author: string;
  timestampText: string;
  theme?: 'purple' | 'amber' | 'blue';
}

export interface ITrip extends Document {
  tripId: string;
  agencyId: mongoose.Types.ObjectId;
  packageId?: mongoose.Types.ObjectId;
  packageName: string;
  dayBadge?: string;
  departureDate: Date;
  returnDate: Date;
  dateRangeText: string;
  durationText?: string;
  destinationRoute: string;
  guideName?: string;
  travelerCount: number;
  capacity: number;
  vehicleAssigned?: string;
  statusCategory: TripStatusCategory;
  statusBadgeText: string;
  badgeColor: 'purple' | 'amber' | 'blue' | 'emerald' | 'rose' | 'slate';
  coverImage: string;
  totalRevenue?: string;

  bookingIds: string[];
  teamAssignments: IAssignedTeamMember[];
  vehicleAssignments: IAssignedVehicle[];
  hotelInformation?: IHotelInfo;
  emergencyInformation?: IEmergencyInfo;

  timelineDays: ITimelineDay[];
  incidents: ITripIncident[];
  notes: ITripNote[];
  photos: ITripPhoto[];
  announcements: ITripAnnouncement[];
  internalNotes: ITripInternalNote[];
  travelerGroups: ITripTravelGroup[];
  quickContacts: ITripQuickContact[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    tripId: { type: String, required: true, unique: true, index: true },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, index: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', index: true },
    packageName: { type: String, required: true },
    dayBadge: { type: String, default: '' },
    departureDate: { type: Date, required: true, index: true },
    returnDate: { type: Date, required: true },
    dateRangeText: { type: String, required: true },
    durationText: { type: String, default: '' },
    destinationRoute: { type: String, required: true },
    guideName: { type: String, default: 'Unassigned (Pending Setup)' },
    travelerCount: { type: Number, default: 0 },
    capacity: { type: Number, default: 18 },
    vehicleAssigned: { type: String, default: 'Pending Vehicle Assignment' },
    statusCategory: {
      type: String,
      enum: ['Pending Setup', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Pending Setup',
      index: true,
    },
    statusBadgeText: { type: String, default: 'Pending Team Assignment' },
    badgeColor: {
      type: String,
      enum: ['purple', 'amber', 'blue', 'emerald', 'rose', 'slate'],
      default: 'amber',
    },
    coverImage: { type: String, default: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800' },
    totalRevenue: { type: String, default: '₹0' },

    bookingIds: [{ type: String }],
    teamAssignments: [{ type: Schema.Types.Mixed }],
    vehicleAssignments: [{ type: Schema.Types.Mixed }],
    hotelInformation: { type: Schema.Types.Mixed, default: null },
    emergencyInformation: { type: Schema.Types.Mixed, default: null },

    timelineDays: [{ type: Schema.Types.Mixed }],
    incidents: [{ type: Schema.Types.Mixed }],
    notes: [{ type: Schema.Types.Mixed }],
    photos: [{ type: Schema.Types.Mixed }],
    announcements: [{ type: Schema.Types.Mixed }],
    internalNotes: [{ type: Schema.Types.Mixed }],
    travelerGroups: [{ type: Schema.Types.Mixed }],
    quickContacts: [{ type: Schema.Types.Mixed }],

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

TripSchema.index({ agencyId: 1, statusCategory: 1, isDeleted: 1 });
TripSchema.index({ agencyId: 1, isDeleted: 1, departureDate: 1 });
TripSchema.index({ departureDate: 1 });
TripSchema.index({ createdAt: -1 });

export const TripModel = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema, 'trips');

