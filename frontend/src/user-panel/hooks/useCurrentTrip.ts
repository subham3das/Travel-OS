import { useState, useEffect, useCallback, useRef } from 'react';
import { myTripService } from '../services/myTrip.service';
import { userSocketService } from '../services/userSocket.service';
import { OngoingTripDTO } from '../types/currentTrip';

interface UseCurrentTripResult {
  trip: OngoingTripDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCurrentTrip(): UseCurrentTripResult {
  const [trip, setTrip] = useState<OngoingTripDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchCurrentTrip = useCallback(async () => {
    try {
      setError(null);
      const res = await myTripService.getCurrentTrip();
      if (!isMountedRef.current) return;
      setTrip(res.hasTrip ? res.trip : null);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      // 401 = user not authenticated; treat as "no trip", don't show error in UI
      const status = err?.response?.status ?? err?.status;
      if (status === 401) {
        setTrip(null);
      } else {
        console.error('useCurrentTrip: fetch failed:', err);
        setError('Failed to load trip data');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchCurrentTrip();

    // Real-time updates via socket
    const unsubTrip = userSocketService.subscribe('current_trip_updated', fetchCurrentTrip);
    const unsubBooking = userSocketService.subscribe('booking_updated', fetchCurrentTrip);
    const unsubStatus = userSocketService.subscribe('trip_status_updated', fetchCurrentTrip);

    // Re-fetch on tab focus (handles day transitions)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchCurrentTrip();
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // Periodic re-sync every 60 seconds for day-boundary transitions
    const intervalId = setInterval(fetchCurrentTrip, 60_000);

    return () => {
      isMountedRef.current = false;
      unsubTrip();
      unsubBooking();
      unsubStatus();
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      clearInterval(intervalId);
    };
  }, [fetchCurrentTrip]);

  return { trip, loading, error, refetch: fetchCurrentTrip };
}
