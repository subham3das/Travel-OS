import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Radio, Play, Pause, Clock } from 'lucide-react';
import { liveActivityCenterService } from '../../../services/liveActivityCenter.service';
import {
  LiveEventItem,
  PlatformServiceStatus,
  LiveMetricsData,
  ActiveTripItem,
  PaymentQueueItem,
  SupportQueueItem,
} from '../../../types/liveActivityCenter';

import { LiveEventFeed } from './LiveEventFeed';
import { PlatformLiveStatus } from './PlatformLiveStatus';
import { LiveMetricsCards } from './LiveMetricsCards';
import { ActiveTripsWidget } from './ActiveTripsWidget';
import { PaymentQueueWidget } from './PaymentQueueWidget';
import { SupportQueueWidget } from './SupportQueueWidget';

export const LiveActivityCenter: React.FC = () => {
  const [events, setEvents] = useState<LiveEventItem[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<PlatformServiceStatus[]>([]);
  const [metrics, setMetrics] = useState<LiveMetricsData>(liveActivityCenterService.getMetrics());
  const [activeTrips, setActiveTrips] = useState<ActiveTripItem[]>([]);
  const [paymentQueue, setPaymentQueue] = useState<PaymentQueueItem[]>([]);
  const [supportQueue, setSupportQueue] = useState<SupportQueueItem[]>([]);

  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    // Initial data
    setServiceStatuses(liveActivityCenterService.getServiceStatuses());
    setMetrics(liveActivityCenterService.getMetrics());
    setActiveTrips(liveActivityCenterService.getActiveTrips());
    setPaymentQueue(liveActivityCenterService.getPaymentQueue());
    setSupportQueue(liveActivityCenterService.getSupportQueue());

    // Subscribe to live events
    const unsubscribe = liveActivityCenterService.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
      setMetrics(liveActivityCenterService.getMetrics());
      setLastUpdatedSeconds(0);
    });

    // Seconds counter
    const secTimer = setInterval(() => {
      setLastUpdatedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(secTimer);
    };
  }, []);

  const handleToggleAutoRefresh = () => {
    const newState = liveActivityCenterService.toggleAutoRefresh();
    setIsAutoRefresh(newState);
  };

  const handleManualRefresh = () => {
    setIsSpinning(true);
    liveActivityCenterService.forceRefresh();
    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200/80 select-none">
      {/* ── 1. SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Live Activity Center
            </h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Monitor everything happening across Travel OS in real time.
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Last updated timestamp */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {lastUpdatedSeconds === 0 ? 'just now' : `${lastUpdatedSeconds}s ago`}</span>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={handleToggleAutoRefresh}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
              isAutoRefresh
                ? 'bg-purple-50 text-[#6356E5] border-purple-200 shadow-2xs'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            {isAutoRefresh ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>Auto Refresh {isAutoRefresh ? 'ON' : 'OFF'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={handleManualRefresh}
            className="p-2 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            title="Refresh Now"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── 2. TOP 3 COLUMNS: LIVE FEED, PLATFORM STATUS, LIVE METRICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column (≈35% / lg:col-span-4) - Live Event Feed */}
        <div className="lg:col-span-4">
          <LiveEventFeed events={events} />
        </div>

        {/* Center Column (lg:col-span-4) - Platform Live Status */}
        <div className="lg:col-span-4">
          <PlatformLiveStatus statuses={serviceStatuses} />
        </div>

        {/* Right Column (lg:col-span-4) - Live Metrics Counters */}
        <div className="lg:col-span-4">
          <LiveMetricsCards metrics={metrics} />
        </div>
      </div>

      {/* ── 3. BOTTOM 3 OPERATIONAL CARDS: ACTIVE TRIPS, PAYMENT QUEUE, SUPPORT QUEUE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ActiveTripsWidget trips={activeTrips} />
        <PaymentQueueWidget queue={paymentQueue} />
        <SupportQueueWidget queue={supportQueue} />
      </div>
    </div>
  );
};
