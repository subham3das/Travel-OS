import { useState, useMemo } from 'react';
import {
  MOCK_AGENCY_BOOKINGS,
  INITIAL_BOOKING_GROUPS,
  AgencyBooking,
  BookingGroup,
  BookingStatus,
  PaymentStatus,
  computeTripEligibility,
} from '../data/bookings';
import { MOCK_AGENCY_TRIPS, AgencyTrip } from '../data/trips';

export type BookingFilterTab =
  | 'All'
  | 'Open'
  | 'Ready for Trip'
  | 'Minimum Not Reached'
  | 'Moved to Trip'
  | 'Cancelled'
  | 'Pending'
  | 'Confirmed';

export type BookingSortOption =
  | 'Newest First'
  | 'Oldest First'
  | 'Departure Date'
  | 'Booking Amount';

export function useBookings() {
  const [bookings, setBookings] = useState<AgencyBooking[]>(MOCK_AGENCY_BOOKINGS);
  const [groups, setGroups] = useState<BookingGroup[]>(INITIAL_BOOKING_GROUPS);

  const [activeTab, setActiveTab] = useState<BookingFilterTab>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<BookingSortOption>('Newest First');
  const [selectedBooking, setSelectedBooking] = useState<AgencyBooking | null>(null);
  const [selectedMoveGroup, setSelectedMoveGroup] = useState<BookingGroup | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPayment, setFilterPayment] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Summary Card Counts
  const summary = useMemo(() => {
    const total = 32;
    const confirmed = 18;
    const pending = 8;
    const cancelled = 6;
    const tripReady = groups.filter((g) => g.groupStatus === 'READY_FOR_TRIP').length;
    const minNotReached = groups.filter((g) => g.groupStatus === 'MINIMUM_NOT_REACHED').length;

    return {
      total,
      confirmed,
      confirmedPct: '56.3%',
      pending,
      pendingPct: '25.0%',
      cancelled,
      cancelledPct: '18.7%',
      tripReady,
      minNotReached,
    };
  }, [groups]);

  // Filtered Booking Groups matching specifications
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      // 1. Filter Chip Matching
      if (activeTab === 'Open' && g.groupStatus !== 'OPEN') return false;
      if (activeTab === 'Ready for Trip' && g.groupStatus !== 'READY_FOR_TRIP') return false;
      if (activeTab === 'Minimum Not Reached' && g.groupStatus !== 'MINIMUM_NOT_REACHED') return false;
      if (activeTab === 'Moved to Trip' && g.groupStatus !== 'MOVED_TO_TRIP') return false;
      if (activeTab === 'Cancelled' && g.groupStatus !== 'CANCELLED') return false;

      // 2. Search Matching by Package, Booking Group, Trip ID, Departure, Traveler Name
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const packageMatch = g.packageName.toLowerCase().includes(q);
        const groupMatch = g.groupId.toLowerCase().includes(q);
        const departureMatch = g.departureDate.toLowerCase().includes(q);
        const tripIdMatch = g.assignedTripId ? g.assignedTripId.toLowerCase().includes(q) : false;
        const travelerMatch = g.bookings.some(
          (b) =>
            b.traveler.name.toLowerCase().includes(q) ||
            b.traveler.phone.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q)
        );

        return packageMatch || groupMatch || departureMatch || tripIdMatch || travelerMatch;
      }

      return true;
    });
  }, [groups, activeTab, searchTerm]);

  const confirmBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const bookingStatus: BookingStatus = 'CONFIRMED';
          const paymentStatus: PaymentStatus = 'PAID';
          const amountPaid = b.totalAmount;
          const remainingAmount = 0;
          const tripEligibility = computeTripEligibility(bookingStatus, paymentStatus);
          return {
            ...b,
            bookingStatus,
            paymentStatus,
            amountPaid,
            remainingAmount,
            tripEligibility,
            timeline: b.timeline.map((t) =>
              t.title === 'Confirmed' ? { ...t, completed: true, active: true } : t
            ),
          };
        }
        return b;
      })
    );

    setGroups((prevGroups) =>
      prevGroups.map((g) => ({
        ...g,
        bookings: g.bookings.map((b) =>
          b.id === id
            ? {
                ...b,
                bookingStatus: 'CONFIRMED',
                paymentStatus: 'PAID',
                amountPaid: b.totalAmount,
                remainingAmount: 0,
                tripEligibility: computeTripEligibility('CONFIRMED', 'PAID'),
              }
            : b
        ),
      }))
    );

    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) =>
        prev
          ? {
              ...prev,
              bookingStatus: 'CONFIRMED',
              paymentStatus: 'PAID',
              amountPaid: prev.totalAmount,
              remainingAmount: 0,
              tripEligibility: computeTripEligibility('CONFIRMED', 'PAID'),
            }
          : null
      );
    }
  };

  const rejectBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const bookingStatus: BookingStatus = 'CANCELLED';
          const paymentStatus: PaymentStatus = 'REFUNDED';
          const tripEligibility = computeTripEligibility(bookingStatus, paymentStatus);
          return {
            ...b,
            bookingStatus,
            paymentStatus,
            tripEligibility,
          };
        }
        return b;
      })
    );

    setGroups((prevGroups) =>
      prevGroups.map((g) => ({
        ...g,
        bookings: g.bookings.map((b) =>
          b.id === id
            ? {
                ...b,
                bookingStatus: 'CANCELLED',
                paymentStatus: 'REFUNDED',
                tripEligibility: computeTripEligibility('CANCELLED', 'REFUNDED'),
              }
            : b
        ),
      }))
    );

    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) =>
        prev
          ? {
              ...prev,
              bookingStatus: 'CANCELLED',
              paymentStatus: 'REFUNDED',
              tripEligibility: computeTripEligibility('CANCELLED', 'REFUNDED'),
            }
          : null
      );
    }
  };

  // Operational Action 1: Extend Booking Deadline
  const extendDeadline = (groupToExtend: BookingGroup, newDate: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.groupId === groupToExtend.groupId
          ? {
              ...g,
              deadlineDate: newDate,
              deadlineText: `Extended to ${newDate}`,
              isDeadlineExpired: false,
              groupStatus: 'OPEN',
            }
          : g
      )
    );
  };

  // Operational Action 2: Cancel Departure
  const cancelDeparture = (groupToCancel: BookingGroup) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.groupId === groupToCancel.groupId
          ? {
              ...g,
              groupStatus: 'CANCELLED',
            }
          : g
      )
    );
  };

  // Operational Action 3: Force Create Trip
  const forceCreateTrip = (groupToForce: BookingGroup) => {
    const updatedGroup: BookingGroup = {
      ...groupToForce,
      groupStatus: 'READY_FOR_TRIP',
      tripReadyReason: 'MANUAL',
    };

    setGroups((prev) =>
      prev.map((g) => (g.groupId === groupToForce.groupId ? updatedGroup : g))
    );

    setSelectedMoveGroup(updatedGroup);
  };

  // Move Group to Trips Action
  const moveGroupToTrips = (groupToMove: BookingGroup) => {
    const newTripId = `TRIP-2024-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Create Trip object and insert into MOCK_AGENCY_TRIPS
    const newTrip: AgencyTrip = {
      id: `trip-${Date.now()}`,
      tripId: newTripId,
      packageName: groupToMove.packageName,
      dayBadge: groupToMove.departureDate,
      departureDate: groupToMove.departureDate,
      returnDate: groupToMove.returnDate,
      dateRangeText: `${groupToMove.departureDate} – ${groupToMove.returnDate}`,
      destinationRoute: groupToMove.packageName,
      guideName: 'Not Assigned',
      travelerCount: groupToMove.fullyPaidTravelerCount,
      capacity: groupToMove.maxCapacity,
      vehicleAssigned: 'Not Assigned',
      statusCategory: 'Pending Setup',
      statusBadgeText: 'Pending Team Assignment',
      badgeColor: 'amber',
      coverImage: groupToMove.coverImage,
    };

    MOCK_AGENCY_TRIPS.unshift(newTrip);

    // 2. Update Group Status to MOVED_TO_TRIP
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.groupId === groupToMove.groupId) {
          return {
            ...g,
            groupStatus: 'MOVED_TO_TRIP',
            assignedTripId: newTripId,
            bookings: g.bookings.map((b) =>
              b.bookingStatus === 'CONFIRMED' && b.paymentStatus === 'PAID'
                ? {
                    ...b,
                    assignedTripId: newTripId,
                    assignedTripName: groupToMove.packageName,
                    timeline: [
                      ...b.timeline,
                      {
                        title: `Trip Assigned (${newTripId})`,
                        timestamp: 'Just now',
                        completed: true,
                        active: true,
                      },
                    ],
                  }
                : b
            ),
          };
        }
        return g;
      })
    );

    setSelectedMoveGroup(null);
  };

  return {
    groups: filteredGroups,
    bookings,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    selectedBooking,
    setSelectedBooking,
    selectedMoveGroup,
    setSelectedMoveGroup,
    isFilterModalOpen,
    setIsFilterModalOpen,
    filterStatus,
    setFilterStatus,
    filterPayment,
    setFilterPayment,
    isLoading,
    summary,
    confirmBooking,
    rejectBooking,
    extendDeadline,
    cancelDeparture,
    forceCreateTrip,
    moveGroupToTrips,
  };
}
