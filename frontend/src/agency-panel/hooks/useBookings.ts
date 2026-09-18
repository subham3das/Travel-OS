import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  agencyBookingsService,
  AgencyBooking,
  BookingGroup,
  BookingStatus,
  PaymentStatus,
  AgencyBookingSummary,
} from '../services/agencyBookings.service';

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
  const [bookings, setBookings] = useState<AgencyBooking[]>([]);
  const [groups, setGroups] = useState<BookingGroup[]>([]);
  const [summary, setSummary] = useState<AgencyBookingSummary>({
    total: 0,
    confirmed: 0,
    confirmedPct: '0%',
    pending: 0,
    pendingPct: '0%',
    cancelled: 0,
    cancelledPct: '0%',
    tripReady: 0,
    minNotReached: 0,
  });

  const [activeTab, setActiveTab] = useState<BookingFilterTab>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<BookingSortOption>('Newest First');
  const [selectedBooking, setSelectedBooking] = useState<AgencyBooking | null>(null);
  const [selectedMoveGroup, setSelectedMoveGroup] = useState<BookingGroup | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPayment, setFilterPayment] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await agencyBookingsService.getBookings();
      setBookings(res.bookings || []);
      setGroups(res.groups || []);
      setSummary(res.summary);
    } catch (err) {
      console.error('Failed to fetch agency bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveBookings();
  }, [fetchLiveBookings]);

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
            b.id.toLowerCase().includes(q) ||
            b.bookingId.toLowerCase().includes(q)
        );

        return packageMatch || groupMatch || departureMatch || tripIdMatch || travelerMatch;
      }

      return true;
    });
  }, [groups, activeTab, searchTerm]);

  const confirmBooking = async (id: string) => {
    try {
      const updated = await agencyBookingsService.confirmBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id || b.bookingId === id ? updated : b)));
      fetchLiveBookings();
    } catch (err) {
      console.error('Error confirming booking:', err);
    }
  };

  const rejectBooking = async (id: string, reason?: string) => {
    try {
      const updated = await agencyBookingsService.cancelBooking(id, reason || 'Rejected by agency');
      setBookings((prev) => prev.map((b) => (b.id === id || b.bookingId === id ? updated : b)));
      fetchLiveBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const extendDeadline = (_groupId: string, _newDate: string) => {
    fetchLiveBookings();
  };

  const cancelDeparture = (_groupId: string, _reason: string) => {
    fetchLiveBookings();
  };

  const forceCreateTrip = (_groupId: string) => {
    fetchLiveBookings();
  };

  const moveGroupToTrips = (_group: BookingGroup) => {
    fetchLiveBookings();
  };

  return {
    bookings,
    groups: filteredGroups,
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
    refreshBookings: fetchLiveBookings,
  };
}
