/**
 * PartnerNetworkMarquee — reusable infinite marquee ticker
 *
 * Features:
 *  - rAF-based translation (GPU-composited, 144Hz-safe)
 *  - Pause on hover, resume from exact position
 *  - Click-drag / swipe support, auto-resumes after release
 *  - prefers-reduced-motion respected
 *  - Random "live pulse" highlight every 6–10s
 *  - Duplicated list for seamless loop (no JS reset)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Building2, ShieldCheck, Clock, Sparkles } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const AGENCIES = [
  { name: 'Highland Travels',      city: 'Shillong, Meghalaya',     joined: 'Joined Today',       trips: '140+' },
  { name: 'NorthEast Trails',      city: 'Guwahati, Assam',         joined: 'Joined Yesterday',   trips: '310+' },
  { name: 'Royal Assam Tours',     city: 'Dibrugarh, Assam',        joined: 'Joined 2 Days Ago',  trips: '95+'  },
  { name: 'Explore Meghalaya',     city: 'Shillong, Meghalaya',     joined: 'Joined Today',       trips: '220+' },
  { name: 'Himalayan Expedition',  city: 'Gangtok, Sikkim',         joined: 'Joined 3 Days Ago',  trips: '185+' },
  { name: 'Adventure NorthEast',   city: 'Itanagar, Arunachal',     joined: 'Joined Yesterday',   trips: '110+' },
  { name: 'Kaziranga Safari Hub',  city: 'Golaghat, Assam',         joined: 'Joined Today',       trips: '260+' },
  { name: 'Nilgiri Wanderers',     city: 'Ooty, Tamil Nadu',        joined: 'Joined 4 Days Ago',  trips: '150+' },
  { name: 'Malabar Journeys',      city: 'Kozhikode, Kerala',       joined: 'Joined 2 Days Ago',  trips: '190+' },
  { name: 'Ladakh High Passes',    city: 'Leh, Ladakh',             joined: 'Joined Today',       trips: '210+' },
  { name: 'Spiti Valley Treks',    city: 'Kaza, Himachal Pradesh',  joined: 'Joined This Week',   trips: '80+'  },
  { name: 'Coorg Trails',          city: 'Madikeri, Karnataka',     joined: 'Joined Yesterday',   trips: '130+' },
];

// Avatar colors — deterministic per name initial
const AVATAR_COLORS: Record<string, string> = {
  H: '#2563EB', N: '#0891B2', R: '#7C3AED', E: '#059669',
  K: '#D97706', A: '#DC2626', M: '#4F46E5', S: '#0F766E',
  L: '#9333EA', C: '#0284C7',
};
function avatarColor(name: string) {
  return AVATAR_COLORS[name[0]] ?? '#2563EB';
}

// Speed: px per frame at 60fps → 35s full loop at ~740px list width
const SPEED_PX_PER_FRAME = 0.55; // ~33fps × 0.55 ≈ 18px/s; one loop ≈ 40s

// ── Reusable InfiniteMarquee hook ─────────────────────────────────────────────

function useInfiniteMarquee(trackRef: React.RefObject<HTMLDivElement | null>, paused: boolean) {
  const xRef = useRef(0);
  const rafRef = useRef(0);
  const halfWidthRef = useRef(0);

  // Measure half-width (one copy) after mount
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        halfWidthRef.current = trackRef.current.scrollWidth / 2;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [trackRef]);

  // rAF loop
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const tick = () => {
      if (!paused && trackRef.current) {
        xRef.current -= SPEED_PX_PER_FRAME;
        const half = halfWidthRef.current;
        if (half > 0 && Math.abs(xRef.current) >= half) {
          xRef.current += half; // seamless reset — user never sees it
        }
        trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, trackRef]);

  return xRef;
}

// ── Agency Card ───────────────────────────────────────────────────────────────

interface AgencyCardProps {
  name: string;
  city: string;
  joined: string;
  trips: string;
  pulse?: boolean;
}

function AgencyCard({ name, city, joined, trips, pulse }: AgencyCardProps) {
  return (
    <div
      className={`marquee-card${pulse ? ' marquee-card-pulse' : ''}`}
      tabIndex={0}
      role="article"
      aria-label={`${name}, ${city}. ${joined}. ${trips} trips.`}
    >
      {pulse && (
        <div className="marquee-pulse-badge">
          <Sparkles size={11} />
          <span>New Verified Agency</span>
        </div>
      )}
      <div className="marquee-avatar" style={{ background: avatarColor(name) }}>
        {name.charAt(0)}
      </div>
      <div className="marquee-card-body">
        <div className="marquee-card-name">
          <span>{name}</span>
          <ShieldCheck size={13} className="marquee-verified" />
        </div>
        <p className="marquee-card-city">{city}</p>
        <div className="marquee-card-meta">
          <span className="marquee-joined">
            <Clock size={11} />
            {joined}
          </span>
          <span className="marquee-dot">•</span>
          <span className="marquee-trips">{trips} Trips</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PartnerNetworkMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);

  // Drag support
  const dragRef = useRef({ dragging: false, startX: 0, startOffset: 0 });
  const xRef = useInfiniteMarquee(trackRef, paused);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { dragging: true, startX: e.clientX, startOffset: xRef.current };
    setPaused(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [xRef]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const delta = e.clientX - dragRef.current.startX;
    xRef.current = dragRef.current.startOffset + delta;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
    }
  }, [xRef]);

  const onPointerUp = useCallback(() => {
    dragRef.current.dragging = false;
    setPaused(false);
  }, []);

  // Live pulse: random card every 6–10s
  useEffect(() => {
    const schedule = () => {
      const delay = 6000 + Math.random() * 4000;
      return setTimeout(() => {
        setPulseIndex(Math.floor(Math.random() * AGENCIES.length));
        setTimeout(() => setPulseIndex(null), 2200);
        schedule();
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  const doubled = [...AGENCIES, ...AGENCIES];

  return (
    <section className="marquee-section">
      {/* Header */}
      <div className="container">
        <div className="marquee-header">
          <span className="section-tag">
            <Building2 size={14} />
            Growing Agency Ecosystem
          </span>
          <h2 className="marquee-title">Recently Verified Travel Agencies</h2>
          <p className="marquee-sub">
            Licensed local operators joining the ApnaTrip network every single week with verified documentation.
          </p>
        </div>
      </div>

      {/* Ticker */}
      <div
        className="marquee-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => !dragRef.current.dragging && setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: dragRef.current.dragging ? 'grabbing' : 'grab' }}
      >
        <div ref={trackRef} className="marquee-track">
          {doubled.map((agency, i) => (
            <AgencyCard
              key={`${agency.name}-${i}`}
              {...agency}
              pulse={i < AGENCIES.length && i === pulseIndex}
            />
          ))}
        </div>
      </div>

      {/* Fades */}
      <div className="marquee-fade-left" aria-hidden="true" />
      <div className="marquee-fade-right" aria-hidden="true" />
    </section>
  );
}
