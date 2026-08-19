import {
  LiveEventItem,
  PlatformServiceStatus,
  LiveMetricsData,
  ActiveTripItem,
  PaymentQueueItem,
  SupportQueueItem,
} from '../types/liveActivityCenter';
import {
  initialLiveEvents,
  initialServiceStatuses,
  initialLiveMetrics,
  initialActiveTrips,
  initialPaymentQueue,
  initialSupportQueue,
} from '../data/liveActivityCenterData';

type Listener = (events: LiveEventItem[]) => void;

class LiveActivityCenterService {
  private events: LiveEventItem[] = [...initialLiveEvents];
  private serviceStatuses: PlatformServiceStatus[] = [...initialServiceStatuses];
  private metrics: LiveMetricsData = { ...initialLiveMetrics };
  private activeTrips: ActiveTripItem[] = [...initialActiveTrips];
  private paymentQueue: PaymentQueueItem[] = [...initialPaymentQueue];
  private supportQueue: SupportQueueItem[] = [...initialSupportQueue];
  private listeners: Set<Listener> = new Set();
  private timer: NodeJS.Timeout | null = null;
  private isAutoRefreshEnabled: boolean = true;

  constructor() {
    this.startSimulation();
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
      this.startSimulation();
    } else {
      this.stopSimulation();
    }
    return this.isAutoRefreshEnabled;
  }

  public isAutoRefreshing(): boolean {
    return this.isAutoRefreshEnabled;
  }

  public forceRefresh(): void {
    // Generate a fresh live simulated event
    this.generateSimulatedEvent();
  }

  private startSimulation() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (document.hidden) return; // Pause when tab inactive
      this.generateSimulatedEvent();
    }, 8000);
  }

  private stopSimulation() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private generateSimulatedEvent() {
    const samplePool: Omit<LiveEventItem, 'id' | 'timestamp' | 'time'>[] = [
      {
        type: 'booking_created',
        title: 'New Booking Created',
        subtitle: 'Kashmir Paradise 5D4N',
        description: 'Booked by Rohit Malhotra • Instant Payment Confirmed',
        amount: '₹28,500',
        status: 'Confirmed',
        statusColor: 'emerald',
        targetRoute: '/admin/bookings',
      },
      {
        type: 'payment_success',
        title: 'Payment Received',
        subtitle: 'Payment ID: PMT-99214',
        description: 'Razorpay UPI Payment Successful for BK-8821',
        amount: '₹42,000',
        status: 'Completed',
        statusColor: 'emerald',
        targetRoute: '/admin/payments',
      },
      {
        type: 'user_registered',
        title: 'New Traveler Joined',
        subtitle: 'Ananya Deshmukh',
        description: 'Signed up via Mobile OTP • Profile 100% complete',
        status: 'Active',
        statusColor: 'blue',
        targetRoute: '/admin/users',
      },
      {
        type: 'agency_registered',
        title: 'New Agency KYC Uploaded',
        subtitle: 'Skyline Tours Pvt. Ltd.',
        description: 'GST and PAN documents uploaded for verification',
        status: 'Pending KYC',
        statusColor: 'purple',
        targetRoute: '/admin/verification-pending',
      },
      {
        type: 'package_approved',
        title: 'Package Published Live',
        subtitle: 'Andaman Scuba Explorer 6D5N',
        description: 'Approved and published to marketplace',
        amount: '₹55,000',
        status: 'Published',
        statusColor: 'emerald',
        targetRoute: '/admin/packages',
      },
    ];

    const pick = samplePool[Math.floor(Math.random() * samplePool.length)];
    const newEvent: LiveEventItem = {
      ...pick,
      id: `evt-${Date.now()}`,
      time: 'Just now',
      timestamp: Date.now(),
    };

    // Slight metric fluctuations
    this.metrics = {
      onlineUsers: this.metrics.onlineUsers + Math.floor(Math.random() * 5) - 2,
      liveAgencies: this.metrics.liveAgencies + (Math.random() > 0.7 ? 1 : 0),
      bookingsToday: this.metrics.bookingsToday + (pick.type === 'booking_created' ? 1 : 0),
      tripsRunning: this.metrics.tripsRunning,
      paymentsProcessing: Math.max(8, this.metrics.paymentsProcessing + Math.floor(Math.random() * 3) - 1),
      supportQueue: Math.max(4, this.metrics.supportQueue + Math.floor(Math.random() * 2) - 1),
    };

    this.events = [newEvent, ...this.events].slice(0, 30);
    this.notify();
  }
}

export const liveActivityCenterService = new LiveActivityCenterService();
