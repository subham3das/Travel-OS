import { adminApiClient } from './adminApiClient';
import {
  LiveEventItem,
  PlatformServiceStatus,
  LiveMetricsData,
  ActiveTripItem,
  PaymentQueueItem,
  SupportQueueItem,
} from '../types/liveActivityCenter';

type Listener = (events: LiveEventItem[]) => void;

class LiveActivityCenterService {
  private events: LiveEventItem[] = [];
  private serviceStatuses: PlatformServiceStatus[] = [];
  private metrics: LiveMetricsData = {
    onlineUsers: 1,
    liveAgencies: 0,
    bookingsToday: 0,
    tripsRunning: 0,
    paymentsProcessing: 0,
    supportQueue: 0,
  };
  private activeTrips: ActiveTripItem[] = [];
  private paymentQueue: PaymentQueueItem[] = [];
  private supportQueue: SupportQueueItem[] = [];
  private listeners: Set<Listener> = new Set();
  private timer: NodeJS.Timeout | null = null;
  private isAutoRefreshEnabled: boolean = true;
  private isFetching: boolean = false;

  constructor() {
    this.fetchLiveActivity();
    this.startPolling();
  }

  public async fetchLiveActivity(): Promise<void> {
    if (this.isFetching) return;
    this.isFetching = true;

    try {
      const [liveRes, tripsRes, paymentsRes, supportRes] = await Promise.all([
        adminApiClient.get<{
          events: LiveEventItem[];
          serviceStatuses: PlatformServiceStatus[];
          metrics: LiveMetricsData;
        }>('/admin/dashboard/live'),
        adminApiClient.get<ActiveTripItem[]>('/admin/dashboard/active-trips'),
        adminApiClient.get<PaymentQueueItem[]>('/admin/dashboard/payment-queue'),
        adminApiClient.get<SupportQueueItem[]>('/admin/dashboard/support-queue'),
      ]);

      if (liveRes.data) {
        this.events = liveRes.data.events || [];
        this.serviceStatuses = liveRes.data.serviceStatuses || [];
        this.metrics = liveRes.data.metrics || this.metrics;
      }
      if (tripsRes.data) {
        this.activeTrips = tripsRes.data || [];
      }
      if (paymentsRes.data) {
        this.paymentQueue = paymentsRes.data || [];
      }
      if (supportRes.data) {
        this.supportQueue = supportRes.data || [];
      }

      this.notify();
    } catch (err) {
      console.warn('Failed to fetch live activity from backend:', err);
    } finally {
      this.isFetching = false;
    }
  }

  public getEvents(): LiveEventItem[] {
    return this.events;
  }

  public getServiceStatuses(): PlatformServiceStatus[] {
    return this.serviceStatuses;
  }

  public getMetrics(): LiveMetricsData {
    return this.metrics;
  }

  public getActiveTrips(): ActiveTripItem[] {
    return this.activeTrips;
  }

  public getPaymentQueue(): PaymentQueueItem[] {
    return this.paymentQueue;
  }

  public getSupportQueue(): SupportQueueItem[] {
    return this.supportQueue;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.events);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.events));
  }

  public toggleAutoRefresh(enabled?: boolean): boolean {
    this.isAutoRefreshEnabled = enabled !== undefined ? enabled : !this.isAutoRefreshEnabled;
    if (this.isAutoRefreshEnabled) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
    return this.isAutoRefreshEnabled;
  }

  public isAutoRefreshing(): boolean {
    return this.isAutoRefreshEnabled;
  }

  public forceRefresh(): void {
    this.fetchLiveActivity();
  }

  private startPolling() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (document.hidden) return; // Pause polling when tab is inactive
      this.fetchLiveActivity();
    }, 10000);
  }

  private stopPolling() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const liveActivityCenterService = new LiveActivityCenterService();
