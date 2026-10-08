import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Node {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  size: number;
  color: string;
  glowColor: string;
  tooltip: { title: string; stats: string[]; };
}

interface Edge {
  from: string;
  to: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const NODES: Node[] = [
  {
    id: 'user',
    label: 'Traveler',
    icon: '🧳',
    x: 50, y: 8,
    size: 52,
    color: '#2563EB',
    glowColor: 'rgba(37,99,235,0.35)',
    tooltip: { title: 'Verified Traveler', stats: ['50K+ Active Users', 'One-time KYC', 'Reward Points', 'Community Profile'] },
  },
  {
    id: 'agency',
    label: 'Travel Agency',
    icon: '🏢',
    x: 18, y: 38,
    size: 48,
    color: '#0891B2',
    glowColor: 'rgba(8,145,178,0.35)',
    tooltip: { title: 'Verified Agencies', stats: ['200+ Partners', 'Package Builder', 'Live Bookings', 'Settlement Dashboard'] },
  },
  {
    id: 'car',
    label: 'Car Booking',
    icon: '🚗',
    x: 50, y: 38,
    size: 48,
    color: '#7C3AED',
    glowColor: 'rgba(124,58,237,0.35)',
    tooltip: { title: 'Route Booking', stats: ['Fixed Fares', 'Verified Drivers', 'Intercity Routes', 'Real-time Tracking'] },
  },
  {
    id: 'rental',
    label: 'Vehicle Rental',
    icon: '🏍️',
    x: 82, y: 38,
    size: 48,
    color: '#059669',
    glowColor: 'rgba(5,150,105,0.35)',
    tooltip: { title: 'Vehicle Rental', stats: ['Cars & Bikes', 'Self Drive', 'Hourly/Daily', 'Airport Transfers'] },
  },
  {
    id: 'core',
    label: 'ApnaTrip Core',
    icon: '⚡',
    x: 50, y: 63,
    size: 60,
    color: '#2563EB',
    glowColor: 'rgba(37,99,235,0.45)',
    tooltip: { title: 'ApnaTrip Platform', stats: ['Real-time Engine', 'Smart Matching', 'Auto Verification', 'Escrow Payments'] },
  },
  {
    id: 'payment',
    label: 'Payments',
    icon: '💳',
    x: 20, y: 86,
    size: 44,
    color: '#D97706',
    glowColor: 'rgba(217,119,6,0.35)',
    tooltip: { title: 'Secure Payments', stats: ['Razorpay Protected', 'Milestone Escrow', 'Instant Confirm', 'Auto Refunds'] },
  },
  {
    id: 'kyc',
    label: 'KYC & Trust',
    icon: '🛡️',
    x: 50, y: 86,
    size: 44,
    color: '#DC2626',
    glowColor: 'rgba(220,38,38,0.35)',
    tooltip: { title: 'Trust & Safety', stats: ['Aadhaar KYC', 'Document Verify', 'Safe Community', 'Emergency SOS'] },
  },
  {
    id: 'community',
    label: 'Community',
    icon: '💬',
    x: 80, y: 86,
    size: 44,
    color: '#7C3AED',
    glowColor: 'rgba(124,58,237,0.35)',
    tooltip: { title: 'WhatsApp Community', stats: ['Travel Updates', 'Group Trips', 'Destination Tips', 'Official Announcements'] },
  },
];

const EDGES: Edge[] = [
  { from: 'user', to: 'agency' },
  { from: 'user', to: 'car' },
  { from: 'user', to: 'rental' },
  { from: 'agency', to: 'core' },
  { from: 'car', to: 'core' },
  { from: 'rental', to: 'core' },
  { from: 'core', to: 'payment' },
  { from: 'core', to: 'kyc' },
  { from: 'core', to: 'community' },
];

const JOURNEY = ['user', 'agency', 'core', 'payment', 'kyc', 'community'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNode(id: string) {
  return NODES.find(n => n.id === id)!;
}

function curvePath(a: Node, b: Node) {
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.25;
  const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

// ── Particle ──────────────────────────────────────────────────────────────────

function Particle({ fromId, toId, delay }: { fromId: string; toId: string; delay: number }) {
  const a = getNode(fromId);
  const b = getNode(toId);
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.25;
  const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
  const pathStr = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;

  return (
    <motion.circle
      r="0.7"
      fill={a.color}
      opacity={0.9}
      initial={{ offsetDistance: '0%', opacity: 0 }}
      animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
      style={{
        offsetPath: `path("${pathStr}")`,
        offsetRotate: '0deg',
      } as React.CSSProperties}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function EcosystemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const [hovered, setHovered] = useState<string | null>(null);
  const [journeyStep, setJourneyStep] = useState(0);
  const [journeyActive, setJourneyActive] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setJourneyActive(true), 1800);
    return () => clearTimeout(t);
  }, [inView]);

  useEffect(() => {
    if (!journeyActive) return;
    const iv = setInterval(() => {
      setJourneyStep(s => (s + 1) % JOURNEY.length);
    }, 700);
    return () => clearInterval(iv);
  }, [journeyActive]);

  const activeJourneyNode = journeyActive ? JOURNEY[journeyStep] : null;

  const isHighlightedNode = useCallback((id: string) => {
    if (hovered) return hovered === id;
    if (activeJourneyNode) return activeJourneyNode === id;
    return false;
  }, [hovered, activeJourneyNode]);

  const isHighlightedEdge = useCallback((from: string, to: string) => {
    if (hovered) return from === hovered || to === hovered;
    if (activeJourneyNode) {
      const idx = JOURNEY.indexOf(activeJourneyNode);
      const prev = idx > 0 ? JOURNEY[idx - 1] : null;
      return (from === prev && to === activeJourneyNode) || (from === activeJourneyNode && to === prev);
    }
    return false;
  }, [hovered, activeJourneyNode]);

  const tooltipNode = hovered ? NODES.find(n => n.id === hovered) : null;

  return (
    <section ref={ref} className="eco-section">
      <div className="container">
        {/* Header */}
        <motion.div
          className="eco-header"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="section-tag">🌐 The Platform</span>
          <h2 className="eco-title">
            Everything connected in<br />
            <em className="eco-em">one ecosystem.</em>
          </h2>
          <p className="eco-sub">
            From discovery to booking, payment to check-in — ApnaTrip handles every step through one intelligent platform.
          </p>
        </motion.div>

        {/* Graph */}
        <motion.div
          className="eco-graph-wrap"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          <svg
            viewBox="0 0 100 100"
            className="eco-svg"
            aria-label="ApnaTrip ecosystem diagram"
            role="img"
          >
            <defs>
              <filter id="eco-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="eco-glow2" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <pattern id="eco-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.15" opacity="0.1" />
              </pattern>
            </defs>

            <rect width="100" height="100" fill="url(#eco-grid)" />

            {/* Edges */}
            {EDGES.map(({ from, to }) => {
              const a = getNode(from);
              const b = getNode(to);
              const hi = isHighlightedEdge(from, to);
              const d = curvePath(a, b);
              return (
                <g key={`${from}-${to}`}>
                  <path d={d} fill="none" stroke={hi ? a.color : '#94a3b8'} strokeWidth={hi ? 0.5 : 0.22} opacity={hi ? 0.75 : 0.25}
                    style={{ transition: 'all 0.4s' }} />
                  {hi && <path d={d} fill="none" stroke={a.color} strokeWidth="1" opacity="0.3" filter="url(#eco-glow)" />}
                </g>
              );
            })}

            {/* Particles */}
            {inView && EDGES.map(({ from, to }, i) => (
              <Particle key={`p-${from}-${to}`} fromId={from} toId={to} delay={i * 0.4} />
            ))}

            {/* Nodes */}
            {NODES.map(node => {
              const r = node.size / 10;
              const hi = isHighlightedNode(node.id);
              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => { setHovered(node.id); setJourneyActive(false); }}
                  onMouseLeave={() => { setHovered(null); setJourneyActive(true); }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label}: ${node.tooltip.stats.join(', ')}`}
                  onFocus={() => setHovered(node.id)}
                  onBlur={() => setHovered(null)}
                >
                  {/* Pulsing glow ring */}
                  {hi && (
                    <circle cx={node.x} cy={node.y} r={r + 2} fill="none" stroke={node.color} strokeWidth="0.4" opacity="0.35" filter="url(#eco-glow2)">
                      <animate attributeName="r" values={`${r + 1};${r + 3.5};${r + 1}`} dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.35;0.1;0.35" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Circle */}
                  <circle cx={node.x} cy={node.y} r={r} fill="white" stroke={hi ? node.color : '#cbd5e1'} strokeWidth={hi ? 0.6 : 0.28}
                    style={{ transition: 'all 0.3s' }} filter={hi ? 'url(#eco-glow)' : undefined} />
                  {hi && <circle cx={node.x} cy={node.y} r={r} fill={node.color} opacity="0.1" />}
                  {/* Icon */}
                  <text x={node.x} y={node.y + (node.size < 50 ? 1.7 : 2.1)} textAnchor="middle" dominantBaseline="middle"
                    fontSize={node.size < 50 ? 4.5 : 5.5} style={{ userSelect: 'none', pointerEvents: 'none' }}>
                    {node.icon}
                  </text>
                  {/* Label */}
                  <text x={node.x} y={node.y + r + 2.5} textAnchor="middle" fontSize="2.2" fontWeight="600"
                    fill={hi ? node.color : '#64748b'} style={{ userSelect: 'none', pointerEvents: 'none', transition: 'fill 0.3s' }}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {tooltipNode && (
              <motion.div
                key={tooltipNode.id}
                className="eco-tooltip"
                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 4 }}
                transition={{ duration: 0.18 }}
                style={{
                  left: `${Math.min(Math.max(tooltipNode.x, 12), 78)}%`,
                  top: `${tooltipNode.y < 50 ? tooltipNode.y + 9 : tooltipNode.y - 26}%`,
                  borderColor: tooltipNode.color,
                } as React.CSSProperties}
              >
                <div className="eco-tip-title" style={{ color: tooltipNode.color }}>{tooltipNode.tooltip.title}</div>
                <ul className="eco-tip-list">
                  {tooltipNode.tooltip.stats.map(s => <li key={s}>{s}</li>)}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Journey bar */}
          {journeyActive && !hovered && (
            <div className="eco-journey" aria-hidden="true">
              <span className="eco-journey-label">Booking journey</span>
              <div className="eco-journey-dots">
                {JOURNEY.map((id, i) => (
                  <div key={id} className={`eco-journey-dot${i === journeyStep ? ' eco-dot-active' : ''}`} />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Cards */}
        <motion.div
          className="eco-cards"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          {SUPPORT_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className="eco-card glass"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="eco-card-icon" style={{ background: card.iconBg }}>{card.icon}</div>
              <div className="eco-card-stat">{card.stat}</div>
              <div className="eco-card-title">{card.title}</div>
              <p className="eco-card-desc">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const SUPPORT_CARDS = [
  { icon: '🏢', iconBg: 'rgba(8,145,178,0.1)', stat: '200+', title: 'Verified Agencies', desc: 'Licensed travel operators across India with package builder access.' },
  { icon: '👥', iconBg: 'rgba(37,99,235,0.1)', stat: '50K+', title: 'Trusted Travelers', desc: 'Verified profiles. Safe community. Trusted bookings nationwide.' },
  { icon: '🚗', iconBg: 'rgba(124,58,237,0.1)', stat: '4 Types', title: 'Vehicle Partners', desc: 'Cars, bikes, self-drive, and airport transfers. Always on demand.' },
  { icon: '🛡️', iconBg: 'rgba(220,38,38,0.1)', stat: '100%', title: 'Secure Platform', desc: 'KYC, escrow payments, and real-time booking verification on every transaction.' },
];
