import mongoose from 'mongoose';
import {
  TripModel,
  ITrip,
  TripStatusCategory,
  IAssignedTeamMember,
  IAssignedVehicle,
  IHotelInfo,
  IEmergencyInfo,
  ITripAnnouncement,
  ITripIncident,
  ITripNote,
  ITripPhoto,
  DayLiveStatus,
  TripLiveStatus,
} from '../models/trip.model.js';
import { BookingModel } from '../models/booking.model.js';
import { PackageModel } from '../models/package.model.js';

export interface GetTripsQuery {
  page?: number;
  limit?: number;
  search?: string;
  statusCategory?: TripStatusCategory;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AgencyTripService {
  /**
   * Automatically seeds initial demo trips for an agency if no trips exist
   */
  private static async ensureInitialTrips(agencyId: string): Promise<void> {
    const existingCount = await TripModel.countDocuments({
      agencyId: new mongoose.Types.ObjectId(agencyId),
      isDeleted: false,
    });

    if (existingCount > 0) return;

    // Check if there are packages/bookings for this agency to base trips on
    const agencyPackages = await PackageModel.find({
      agencyId: new mongoose.Types.ObjectId(agencyId),
      isDeleted: false,
    }).limit(5);

    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const futureDate2 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const initialTrips = [
      {
        tripId: 'LD-1505-2024',
        agencyId: new mongoose.Types.ObjectId(agencyId),
        packageId: agencyPackages[0]?._id,
        packageName: agencyPackages[0]?.title || 'Ladakh Expedition & High Pass Trail',
        dayBadge: '15 May',
        departureDate: futureDate1,
        returnDate: new Date(futureDate1.getTime() + 7 * 24 * 60 * 60 * 1000),
        dateRangeText: '15 May – 22 May 2024 (7D / 6N)',
        durationText: '7 Days / 6 Nights',
        destinationRoute: 'Leh, Nubra, Pangong, Tso Moriri',
        guideName: 'Rohit Sharma (Tour Guide)',
        travelerCount: 18,
        capacity: 24,
        vehicleAssigned: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
        statusCategory: 'Upcoming' as TripStatusCategory,
        statusBadgeText: 'Starts Tomorrow',
        badgeColor: 'purple' as const,
        coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
        totalRevenue: '₹2,16,000',
        teamAssignments: [
          {
            id: 'at-1',
            name: 'John Smith',
            role: 'Trip Manager',
            phone: '+91 98765 43210',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            isAssigned: true,
          },
          {
            id: 'at-2',
            name: 'Rahul Das',
            role: 'Trip Host',
            phone: '+91 87654 32109',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
            isAssigned: true,
          },
          {
            id: 'at-3',
            name: 'Aman Sharma',
            role: 'Guide',
            phone: '+91 76543 21098',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
            isAssigned: true,
          },
          {
            id: 'at-4',
            name: 'Rakesh Kumar',
            role: 'Driver',
            phone: '+91 65432 10987',
            avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
            isAssigned: true,
          },
        ],
        vehicleAssignments: [
          {
            id: 'v-1',
            name: 'Tempo Traveller Deluxe',
            registrationNumber: 'UK 07 PA 1234',
            type: '17+1 Seater AC Bus',
            capacity: 18,
            assignedDriver: 'Rakesh Kumar',
            status: 'Assigned',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
          },
        ],
        hotelInformation: {
          hotelName: 'The Grand Himalayan Resort',
          address: 'Leh, Ladakh 194101',
          checkInTime: '02:00 PM',
          checkOutTime: '11:00 AM',
          roomAllocationNotes: '8 double rooms reserved for guests.',
        },
        emergencyInformation: {
          contactPerson: 'Ramesh Kumar (Operations Desk)',
          contactPhone: '+91 98765 00000',
          nearestHospital: 'SNM Hospital, Leh',
          nearestPoliceStation: 'Leh Police Station',
          backupVehicleContact: '+91 87654 32109',
          additionalNotes: 'Oxygen cylinders kept in vehicle UK 07 PA 1234.',
        },
        timelineDays: [
          {
            dayNumber: 1,
            dateText: '15 May 2024',
            title: 'Arrival in Leh & Acclimatization',
            status: 'Completed' as DayLiveStatus,
            guideName: 'John Smith',
            hotelName: 'The Grand Himalayan Resort',
            vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
            pickupTime: '08:00 AM',
            departureTime: '09:00 AM',
            arrivalTime: '11:30 AM',
            meals: 'Breakfast, Lunch, Dinner Included',
            notes: 'Rest essential for high altitude acclimatization. Hydration recommended.',
            activities: [
              { id: 'a1-1', time: '08:00 AM', title: 'Leh Kushok Bakula Rimpoche Airport Pickup', status: 'Completed' as DayLiveStatus, location: 'Leh Airport' },
              { id: 'a1-2', time: '10:30 AM', title: 'Hotel Check-in & Briefing Session', status: 'Completed' as DayLiveStatus, location: 'Grand Himalayan Resort' },
              { id: 'a1-3', time: '01:00 PM', title: 'Acclimatization Lunch & Orientation', status: 'Completed' as DayLiveStatus, location: 'Hotel Dining Hall' },
            ],
            checklist: [
              { id: 'c1-1', label: 'Breakfast Completed', isCompleted: true },
              { id: 'c1-2', label: 'Hotel Checkout', isCompleted: false },
              { id: 'c1-3', label: 'Attendance Verified', isCompleted: true },
              { id: 'c1-4', label: 'Transportation Ready', isCompleted: true },
            ],
          },
          {
            dayNumber: 2,
            dateText: '16 May 2024',
            title: 'Leh Local Sightseeing & Hall of Fame',
            status: 'In Progress' as DayLiveStatus,
            guideName: 'Aman Sharma',
            hotelName: 'The Grand Himalayan Resort',
            vehicleName: 'Tempo Traveller Deluxe (UK 07 PA 1234)',
            pickupTime: '08:30 AM',
            departureTime: '09:00 AM',
            arrivalTime: '06:00 PM',
            meals: 'Breakfast, Packaged Lunch, Dinner',
            notes: 'Carry warm layer for Sangam Point windy afternoon.',
            activities: [
              { id: 'a2-1', time: '08:30 AM', title: 'Hotel Pickup & Assembly', status: 'Completed' as DayLiveStatus, location: 'Hotel Lobby' },
              { id: 'a2-2', time: '09:30 AM', title: 'Hall of Fame Museum Visit', status: 'Completed' as DayLiveStatus, location: 'Leh-Kargil Road' },
              { id: 'a2-3', time: '12:00 PM', title: 'Magnetic Hill Demonstration', status: 'In Progress' as DayLiveStatus, location: 'Magnetic Hill' },
            ],
            checklist: [
              { id: 'c2-1', label: 'Breakfast Completed', isCompleted: true },
              { id: 'c2-2', label: 'Hotel Checkout', isCompleted: false },
              { id: 'c2-3', label: 'Attendance Verified', isCompleted: true },
            ],
          },
        ],
        incidents: [
          {
            id: 'inc-1',
            timestampText: '16 May, 11:15 AM',
            category: 'Weather Issue' as const,
            description: 'Brief dust gust near Magnetic Hill caused 15 min halt. All travelers safe in vehicle.',
            isResolved: true,
            reportedBy: 'Aman Sharma (Guide)',
          },
        ],
        notes: [
          {
            id: 'note-1',
            timestampText: '15 May, 11:45 AM',
            author: 'John Smith',
            authorRole: 'Trip Manager',
            content: 'All 18 travelers checked in safely at Leh hotel. Acclimatization guidelines shared with everyone.',
          },
        ],
        photos: [
          {
            id: 'ph-1',
            url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
            caption: 'Group welcome at Leh Airport',
            category: 'Departure' as const,
            timestampText: '15 May, 08:30 AM',
          },
        ],
        announcements: [
          {
            id: 'anc-1',
            tripId: 'LD-1505-2024',
            title: 'Bus Departure Time',
            message: 'Bus will depart at 7:00 AM tomorrow. Please be at the hotel entrance by 6:45 AM.',
            type: 'Schedule Change' as const,
            status: 'Sent' as const,
            author: 'Ankit Verma',
            createdAt: new Date().toISOString(),
            deliveryOptions: { notifyAllTravelers: true, pushNotification: true, saveToTimeline: true },
          },
        ],
        travelerGroups: [
          {
            groupId: 'TG-BK-2024-00568',
            bookingId: 'BK-2024-00568',
            groupName: 'Travel Group #1',
            groupCategory: 'Family' as const,
            paymentStatus: 'Payment Complete' as const,
            primaryTraveler: {
              id: 'tv-1',
              bookingId: 'BK-2024-00568',
              name: 'Rohit Sharma',
              gender: 'Male' as const,
              age: 32,
              phone: '+91 98765 43210',
              email: 'rohit.sharma@example.com',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
              travelerCount: 4,
              seatNumbers: ['12A'],
              roleInBooking: 'Primary Traveler' as const,
              paymentStatus: 'Payment Complete' as const,
              checkInStatus: 'Checked In' as const,
              verificationStatus: 'Verified' as const,
              hasMedicalNotes: false,
              emergencyContact: { name: 'Rohit Sharma', phone: '+91 98765 00000' },
            },
            companions: [
              {
                id: 'tv-1b',
                bookingId: 'BK-2024-00568',
                name: 'Rahul Das',
                gender: 'Male' as const,
                age: 26,
                phone: '+91 98765 11111',
                email: 'rahul.das@example.com',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
                travelerCount: 4,
                seatNumbers: ['12B'],
                roleInBooking: 'Travel Partner' as const,
                primaryTravelerName: 'Rohit Sharma',
                paymentStatus: 'Payment Complete' as const,
                checkInStatus: 'Checked In' as const,
                verificationStatus: 'Verified' as const,
                hasMedicalNotes: false,
                emergencyContact: { name: 'Rohit Sharma', phone: '+91 98765 00000' },
              },
            ],
            totalTravelersCount: 2,
          },
        ],
        quickContacts: [
          { id: 'qc-1', label: 'Emergency Call', sublabel: '24/7 Support', phone: '+91 98765 43210', iconType: 'phone' as const },
          { id: 'qc-2', label: 'Trip Coordinator', sublabel: 'Ankit Verma', phone: '+91 87654 32100', iconType: 'person' as const },
          { id: 'qc-3', label: 'Hotel Contact', sublabel: 'Leh Hotel', phone: '+91 94195 67890', iconType: 'hotel' as const },
        ],
      },
      {
        tripId: 'BK-2041-TRIP',
        agencyId: new mongoose.Types.ObjectId(agencyId),
        packageName: 'Spiti Expedition (Newly Moved)',
        dayBadge: '18 May',
        departureDate: futureDate2,
        returnDate: new Date(futureDate2.getTime() + 7 * 24 * 60 * 60 * 1000),
        dateRangeText: '18 May – 25 May 2025',
        destinationRoute: 'Shimla, Kaza, Tabo, Chandratal',
        guideName: 'Unassigned (Pending Setup)',
        travelerCount: 14,
        capacity: 18,
        vehicleAssigned: 'Pending Vehicle Assignment',
        statusCategory: 'Pending Setup' as TripStatusCategory,
        statusBadgeText: 'Pending Team Assignment',
        badgeColor: 'amber' as const,
        coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500',
        teamAssignments: [],
        vehicleAssignments: [],
      },
      {
        tripId: 'HP-0205-2024',
        agencyId: new mongoose.Types.ObjectId(agencyId),
        packageName: 'Himachal Spiti Expedition',
        dayBadge: '02 May',
        departureDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        dateRangeText: '02 May – 10 May 2024',
        destinationRoute: 'Shimla, Kaza, Tabo, Manali',
        guideName: 'Vikram Thakur (Senior Guide)',
        travelerCount: 16,
        capacity: 16,
        vehicleAssigned: 'Isuzu D-Max 4x4 Batch',
        statusCategory: 'Ongoing' as TripStatusCategory,
        statusBadgeText: 'Ongoing (Day 5)',
        badgeColor: 'emerald' as const,
        coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500',
      },
      {
        tripId: 'KL-1004-2024',
        agencyId: new mongoose.Types.ObjectId(agencyId),
        packageName: 'Kerala Backwaters & Hills',
        dayBadge: '10 Apr',
        departureDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
        dateRangeText: '10 Apr – 17 Apr 2024',
        destinationRoute: 'Munnar, Alleppey, Kovalam',
        guideName: 'Arun Pillai (Tour Guide)',
        travelerCount: 14,
        capacity: 14,
        vehicleAssigned: 'Force Urbania Premium',
        statusCategory: 'Completed' as TripStatusCategory,
        statusBadgeText: 'Completed',
        badgeColor: 'slate' as const,
        coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500',
      },
    ];

    await TripModel.insertMany(initialTrips);
  }

  /**
   * Get all trips for the authenticated agency
   */
  static async getAgencyTrips(agencyId: string, query: GetTripsQuery) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    await this.ensureInitialTrips(agencyId);

    const filter: Record<string, any> = {
      agencyId: aid,
      isDeleted: false,
    };

    if (query.statusCategory) {
      filter.statusCategory = query.statusCategory;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { packageName: searchRegex },
        { tripId: searchRegex },
        { destinationRoute: searchRegex },
        { guideName: searchRegex },
        { vehicleAssigned: searchRegex },
      ];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [trips, total, allStatusCounts, statsAgg] = await Promise.all([
      TripModel.find(filter)
        .sort({ departureDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      TripModel.countDocuments(filter),

      TripModel.aggregate([
        { $match: { agencyId: aid, isDeleted: false } },
        { $group: { _id: '$statusCategory', count: { $sum: 1 } } },
      ]),

      TripModel.aggregate([
        { $match: { agencyId: aid, isDeleted: false } },
        {
          $group: {
            _id: null,
            upcomingCount: {
              $sum: { $cond: [{ $eq: ['$statusCategory', 'Upcoming'] }, 1, 0] },
            },
            totalTravelers: { $sum: '$travelerCount' },
            assignedGuides: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$guideName', 'Unassigned (Pending Setup)'] },
                      { $ne: ['$guideName', ''] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            vehiclesAssigned: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$vehicleAssigned', 'Pending Vehicle Assignment'] },
                      { $ne: ['$vehicleAssigned', ''] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const tabCounts: Record<TripStatusCategory, number> = {
      'Pending Setup': 0,
      Upcoming: 0,
      Ongoing: 0,
      Completed: 0,
      Cancelled: 0,
    };

    allStatusCounts.forEach((s) => {
      if (s._id in tabCounts) {
        tabCounts[s._id as TripStatusCategory] = s.count;
      }
    });

    const stats = statsAgg[0] || {
      upcomingCount: 0,
      totalTravelers: 0,
      assignedGuides: 0,
      vehiclesAssigned: 0,
    };

    return {
      trips: trips.map((t) => ({
        id: (t as any)._id.toString(),
        tripId: t.tripId,
        packageName: t.packageName,
        dayBadge: t.dayBadge || '',
        departureDate: t.departureDate ? t.departureDate.toISOString() : '',
        returnDate: t.returnDate ? t.returnDate.toISOString() : '',
        dateRangeText: t.dateRangeText,
        durationText: t.durationText || '',
        destinationRoute: t.destinationRoute,
        guideName: t.guideName || 'Unassigned (Pending Setup)',
        travelerCount: t.travelerCount,
        capacity: t.capacity,
        vehicleAssigned: t.vehicleAssigned || 'Pending Vehicle Assignment',
        statusCategory: t.statusCategory,
        statusBadgeText: t.statusBadgeText,
        badgeColor: t.badgeColor,
        coverImage: t.coverImage,
        createdAt: (t as any).createdAt,
      })),
      tabCounts,
      stats: {
        upcomingCount: stats.upcomingCount || 0,
        totalTravelers: stats.totalTravelers || 0,
        assignedGuides: stats.assignedGuides || 0,
        vehiclesAssigned: stats.vehiclesAssigned || 0,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single trip details by ID or business tripId
   */
  static async getAgencyTripById(agencyId: string, tripIdOrObjectId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    let trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    }).lean();

    if (!trip) {
      // Create or populate demo if not found
      await this.ensureInitialTrips(agencyId);
      trip = await TripModel.findOne({
        agencyId: aid,
        $or: [
          { tripId: tripIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      }).lean();
    }

    if (!trip) {
      throw new Error(`Trip with ID '${tripIdOrObjectId}' not found for this agency.`);
    }

    return {
      id: (trip as any)._id.toString(),
      tripId: trip.tripId,
      packageName: trip.packageName,
      coverImage: trip.coverImage,
      statusText: trip.statusBadgeText,
      statusCategory: trip.statusCategory,
      dateRangeText: trip.dateRangeText,
      durationText: trip.durationText || '7 Days / 6 Nights',
      destinationRoute: trip.destinationRoute,
      travelerCount: trip.travelerCount,
      capacity: trip.capacity,
      totalRevenue: trip.totalRevenue || '₹0',
      status: trip.statusCategory,
      departureDate: trip.departureDate ? trip.departureDate.toISOString() : '',
      returnDate: trip.returnDate ? trip.returnDate.toISOString() : '',
      vehicleName: trip.vehicleAssignments?.[0]?.name || trip.vehicleAssigned || 'Tempo Traveller',
      guideName: trip.teamAssignments?.find((m: any) => m.role === 'Guide' || m.role === 'Tour Guide')?.name || trip.guideName || 'Unassigned',
      coordinatorName: trip.teamAssignments?.find((m: any) => m.role === 'Coordinator' || m.role === 'Trip Manager')?.name || 'Operations Desk',
      driverName: trip.teamAssignments?.find((m: any) => m.role === 'Driver')?.name || 'Assigned Driver',
      teamAssignments: trip.teamAssignments || [],
      vehicleAssignments: trip.vehicleAssignments || [],
      hotelInformation: trip.hotelInformation || null,
      emergencyInformation: trip.emergencyInformation || null,
      timelineDays: trip.timelineDays || [],
      incidents: trip.incidents || [],
      notes: trip.notes || [],
      photos: trip.photos || [],
      announcements: trip.announcements || [],
      internalNotes: trip.internalNotes || [],
      travelerGroups: trip.travelerGroups || [],
      quickContacts: trip.quickContacts || [],
    };
  }

  /**
   * Update Trip Team Assignments
   */
  static async updateTripTeam(agencyId: string, tripIdOrObjectId: string, teamMembers: IAssignedTeamMember[]) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const guide = teamMembers.find((m) => m.role === 'Guide' || m.role === 'Tour Guide' || m.role === 'Trip Host');

    const updateFields: Record<string, any> = {
      teamAssignments: teamMembers,
    };

    if (guide) {
      updateFields.guideName = `${guide.name} (${guide.role})`;
    }

    const trip = await TripModel.findOneAndUpdate(
      {
        agencyId: aid,
        $or: [
          { tripId: tripIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      },
      { $set: updateFields },
      { new: true }
    );

    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  /**
   * Update Trip Vehicle Assignments
   */
  static async updateTripVehicle(agencyId: string, tripIdOrObjectId: string, vehicleAssignments: IAssignedVehicle[]) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const primaryVehicle = vehicleAssignments[0];

    const updateFields: Record<string, any> = {
      vehicleAssignments,
    };

    if (primaryVehicle) {
      updateFields.vehicleAssigned = `${primaryVehicle.name} (${primaryVehicle.registrationNumber})`;
    }

    const trip = await TripModel.findOneAndUpdate(
      {
        agencyId: aid,
        $or: [
          { tripId: tripIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      },
      { $set: updateFields },
      { new: true }
    );

    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  /**
   * Update Trip Hotel Info
   */
  static async updateTripHotel(agencyId: string, tripIdOrObjectId: string, hotelInfo: IHotelInfo) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOneAndUpdate(
      {
        agencyId: aid,
        $or: [
          { tripId: tripIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      },
      { $set: { hotelInformation: hotelInfo } },
      { new: true }
    );

    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  /**
   * Update Trip Emergency Info
   */
  static async updateTripEmergency(agencyId: string, tripIdOrObjectId: string, emergencyInfo: IEmergencyInfo) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOneAndUpdate(
      {
        agencyId: aid,
        $or: [
          { tripId: tripIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      },
      { $set: { emergencyInformation: emergencyInfo } },
      { new: true }
    );

    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  /**
   * Update Live Trip Status
   */
  static async updateTripStatus(agencyId: string, tripIdOrObjectId: string, status: TripLiveStatus | TripStatusCategory) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const category = status === 'Archived' ? 'Completed' : (status as TripStatusCategory);

    const trip = await TripModel.findOneAndUpdate(
      {
        agencyId: aid,
        $or: [
          { tripId: tripIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      },
      {
        $set: {
          statusCategory: category,
          statusBadgeText: category === 'Ongoing' ? 'ONGOING TRIP' : category === 'Completed' ? 'Completed' : 'Ready to Start',
          badgeColor: category === 'Ongoing' ? 'emerald' : category === 'Completed' ? 'slate' : 'purple',
        },
      },
      { new: true }
    );

    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  /**
   * Traveler Check-in / Attendance
   */
  static async updateTravelerAttendance(agencyId: string, tripIdOrObjectId: string, travelerId: string, checkInStatus: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    const updatedGroups = (trip.travelerGroups || []).map((group: any) => {
      const updateRecord = (t: any) =>
        t.id === travelerId ? { ...t, checkInStatus } : t;

      return {
        ...group,
        primaryTraveler: updateRecord(group.primaryTraveler),
        companions: (group.companions || []).map(updateRecord),
      };
    });

    trip.travelerGroups = updatedGroups;
    await trip.save();
    return trip;
  }

  /**
   * Check in all travelers
   */
  static async checkInAllTravelers(agencyId: string, tripIdOrObjectId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    const updatedGroups = (trip.travelerGroups || []).map((group: any) => ({
      ...group,
      primaryTraveler: { ...group.primaryTraveler, checkInStatus: 'Checked In' },
      companions: (group.companions || []).map((c: any) => ({ ...c, checkInStatus: 'Checked In' })),
    }));

    trip.travelerGroups = updatedGroups;
    await trip.save();
    return trip;
  }

  /**
   * Create Announcement
   */
  static async createTripAnnouncement(agencyId: string, tripIdOrObjectId: string, announcement: Omit<ITripAnnouncement, 'id' | 'createdAt'>) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    const newAnnouncement: ITripAnnouncement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    trip.announcements = [newAnnouncement, ...(trip.announcements || [])];
    await trip.save();
    return newAnnouncement;
  }

  /**
   * Add Incident
   */
  static async addTripIncident(agencyId: string, tripIdOrObjectId: string, incident: Omit<ITripIncident, 'id'>) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    const newIncident: ITripIncident = {
      ...incident,
      id: `inc-${Date.now()}`,
    };

    trip.incidents = [newIncident, ...(trip.incidents || [])];
    await trip.save();
    return newIncident;
  }

  /**
   * Toggle Incident Resolved
   */
  static async toggleResolveIncident(agencyId: string, tripIdOrObjectId: string, incidentId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    trip.incidents = (trip.incidents || []).map((inc: any) =>
      inc.id === incidentId ? { ...inc, isResolved: !inc.isResolved } : inc
    );

    await trip.save();
    return trip.incidents;
  }

  /**
   * Add Note
   */
  static async addTripNote(agencyId: string, tripIdOrObjectId: string, note: Omit<ITripNote, 'id'>) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    const newNote: ITripNote = {
      ...note,
      id: `note-${Date.now()}`,
    };

    trip.notes = [newNote, ...(trip.notes || [])];
    await trip.save();
    return newNote;
  }

  /**
   * Add Photo
   */
  static async addTripPhoto(agencyId: string, tripIdOrObjectId: string, photo: Omit<ITripPhoto, 'id'>) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    const newPhoto: ITripPhoto = {
      ...photo,
      id: `ph-${Date.now()}`,
    };

    trip.photos = [newPhoto, ...(trip.photos || [])];
    await trip.save();
    return newPhoto;
  }

  /**
   * Update Timeline Day Status
   */
  static async updateTimelineDayStatus(agencyId: string, tripIdOrObjectId: string, dayNumber: number, status: DayLiveStatus) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const trip = await TripModel.findOne({
      agencyId: aid,
      $or: [
        { tripId: tripIdOrObjectId },
        ...(mongoose.Types.ObjectId.isValid(tripIdOrObjectId)
          ? [{ _id: new mongoose.Types.ObjectId(tripIdOrObjectId) }]
          : []),
      ],
      isDeleted: false,
    });

    if (!trip) throw new Error('Trip not found');

    trip.timelineDays = (trip.timelineDays || []).map((d: any) =>
      d.dayNumber === dayNumber ? { ...d, status } : d
    );

    await trip.save();
    return trip.timelineDays;
  }
}
