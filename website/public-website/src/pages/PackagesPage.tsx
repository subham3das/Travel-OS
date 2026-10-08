import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight, Package } from 'lucide-react'
import styles from './GenericPage.module.css'

const packages = [
  {
    name: 'Himalayan Odyssey',
    sub: 'Manali + Spiti + Kaza',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80&auto=format',
    duration: '10D/9N',
    price: '₹24,999',
    badge: '🔥 Bestseller',
  },
  {
    name: 'South India Circuit',
    sub: 'Kerala + Coorg + Ooty',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80&auto=format',
    duration: '8D/7N',
    price: '₹19,499',
    badge: '⭐ Premium',
  },
  {
    name: 'Rajasthan Royal Tour',
    sub: 'Jaipur + Jodhpur + Udaipur',
    image: 'https://images.unsplash.com/photo-1667819943948-f21e1f3e4284?w=600&q=80&auto=format',
    duration: '7D/6N',
    price: '₹16,999',
    badge: '🏰 Heritage',
  },
  {
    name: 'Goa Beach Bliss',
    sub: 'North + South Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80&auto=format',
    duration: '5D/4N',
    price: '₹11,999',
    badge: '🌊 Beach',
  },
  {
    name: 'Ladakh Expedition',
    sub: 'Leh + Pangong + Nubra',
    image: 'https://images.unsplash.com/photo-1591790308747-2f56a2fe50d0?w=600&q=80&auto=format',
    duration: '8D/7N',
    price: '₹28,999',
    badge: '🏔️ Adventure',
  },
  {
    name: 'Andaman Escape',
    sub: 'Port Blair + Havelock + Neil',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format',
    duration: '6D/5N',
    price: '₹22,999',
    badge: '🏝️ Island',
  },
]

export default function PackagesPage() {
  return (
    <>
      <Helmet>
        <title>Travel Packages — ApnaTrip</title>
        <meta name="description" content="Explore all-inclusive travel packages across India. Curated itineraries covering transport, stays, and experiences." />
      </Helmet>
      <div className={styles.page}>
        <div className={styles.pageHero}>
          <div className={styles.heroGlow} />
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-tag"><Package size={12} /> Travel Packages</div>
              <h1 className={styles.heroTitle}>
                All-Inclusive.<br />
                <em className={styles.heroItalic}>Zero Stress.</em>
              </h1>
              <p className={styles.heroSub}>
                Let us handle everything — from transport to stays to experiences. You just show up and enjoy.
              </p>
            </motion.div>
          </div>
        </div>

        <div className={`container ${styles.content}`}>
          <div className={styles.grid}>
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <div className={styles.cardImg}>
                  <img src={pkg.image} alt={pkg.name} loading="lazy" />
                  <div className={styles.cardOverlay} />
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                    {pkg.badge}
                  </span>
                  <span style={{ position: 'absolute', bottom: 12, right: 14, background: 'rgba(5,5,10,0.7)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '4px 10px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {pkg.duration}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div>
                    <h3 className={styles.cardName}>{pkg.name}</h3>
                    <p className={styles.cardState}>{pkg.sub}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>From <strong>{pkg.price}</strong> / person</span>
                    <a href="https://app.apnatrip.in" className={styles.cardBtn} target="_blank" rel="noopener">
                      View <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
