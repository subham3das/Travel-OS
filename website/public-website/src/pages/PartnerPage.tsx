import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Briefcase, TrendingUp, Users } from 'lucide-react'
import styles from './PartnerPage.module.css'

const steps = [
  { num: '01', title: 'Register Agency', desc: 'Create your agency account in minutes. Submit documents and get verified within 24 hours.' },
  { num: '02', title: 'List Your Fleet', desc: 'Add your vehicles, routes, and pricing. Our smart tools auto-calculate competitive fares.' },
  { num: '03', title: 'Receive Bookings', desc: 'Bookings come directly to your dashboard with traveler details and trip information.' },
  { num: '04', title: 'Get Paid Instantly', desc: 'Earnings are settled to your bank account via Razorpay — fast, transparent, reliable.' },
]

const perks = [
  'Zero setup and listing fee',
  'Real-time booking notifications',
  'Dedicated account manager',
  'Performance analytics dashboard',
  'Razorpay instant settlements',
  'Driver management tools',
  'Traveler rating and reviews',
  'Priority listing in search results',
]

export default function PartnerPage() {
  return (
    <>
      <Helmet>
        <title>Partner With Us — ApnaTrip</title>
        <meta name="description" content="Join ApnaTrip as a travel agency partner. List your fleet, receive bookings, and grow your business with India's top travel platform." />
      </Helmet>
      <div className={styles.page}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-tag"><Briefcase size={12} /> Partner Program</div>
              <h1 className={styles.heroTitle}>
                Grow Your Agency<br />
                <em className={styles.italic}>With ApnaTrip.</em>
              </h1>
              <p className={styles.heroSub}>
                Join 500+ travel agencies already earning more with ApnaTrip. Register today and start receiving bookings from thousands of verified travelers.
              </p>
              <div className={styles.heroCtas}>
                <a href="http://localhost:5173/agency" className="btn-primary" target="_blank" rel="noopener">
                  Become a Partner <ArrowRight size={16} />
                </a>
                <a href="mailto:partners@apnatrip.in" className="btn-ghost">
                  Talk to Sales
                </a>
              </div>

              {/* Mini stats */}
              <div className={styles.miniStats}>
                {[
                  { icon: Briefcase, v: '500+', l: 'Partner Agencies' },
                  { icon: Users, v: '50K+', l: 'Monthly Bookings' },
                  { icon: TrendingUp, v: '3.2x', l: 'Revenue Growth' },
                ].map(s => (
                  <div key={s.l} className={styles.miniStat}>
                    <span className={styles.miniStatVal}>{s.v}</span>
                    <span className={styles.miniStatLabel}>{s.l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container">
          {/* How it works */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className="section-tag">How It Works</div>
              <h2 className="section-heading">Simple. Fast. Profitable.</h2>
            </div>
            <div className={styles.steps}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className={styles.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                >
                  <div className={styles.stepNum}>{step.num}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Perks */}
          <section className={styles.section}>
            <div className={styles.perksWrap}>
              <div className={styles.perksLeft}>
                <div className="section-tag">What You Get</div>
                <h2 className="section-heading">Everything You Need to Scale</h2>
                <p className="section-subheading">We handle the technology so you can focus on delivering great experiences.</p>
                <a href="http://localhost:5173/agency/signup" className="btn-primary" style={{ marginTop: '2rem' }} target="_blank" rel="noopener">
                  Get Started Free <ArrowRight size={16} />
                </a>
              </div>
              <div className={styles.perksList}>
                {perks.map((perk, i) => (
                  <motion.div
                    key={perk}
                    className={styles.perkItem}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <CheckCircle size={16} style={{ color: 'var(--brand-accent)', flexShrink: 0 }} />
                    <span>{perk}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
