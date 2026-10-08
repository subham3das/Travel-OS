import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import styles from './GenericPage.module.css'

const destinations = [
  { name: 'Manali', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80&auto=format', emoji: '🏔️', price: '₹8,999' },
  { name: 'Goa', state: 'Beaches & Nightlife', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80&auto=format', emoji: '🌊', price: '₹10,499' },
  { name: 'Leh Ladakh', state: 'Jammu & Kashmir', image: 'https://images.unsplash.com/photo-1591790308747-2f56a2fe50d0?w=600&q=80&auto=format', emoji: '🏔️', price: '₹18,999' },
  { name: 'Kerala', state: "God's Own Country", image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80&auto=format', emoji: '🌴', price: '₹12,499' },
  { name: 'Rajasthan', state: 'Land of Kings', image: 'https://images.unsplash.com/photo-1667819943948-f21e1f3e4284?w=600&q=80&auto=format', emoji: '🏰', price: '₹9,749' },
  { name: 'Andaman', state: 'Island Paradise', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format', emoji: '🏝️', price: '₹22,999' },
  { name: 'Coorg', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1605457867610-e990b192553e?w=600&q=80&auto=format', emoji: '☕', price: '₹7,499' },
  { name: 'Varanasi', state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1561361058-c24e01b35ded?w=600&q=80&auto=format', emoji: '🪔', price: '₹6,999' },
  { name: 'Spiti Valley', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=80&auto=format', emoji: '🗻', price: '₹15,999' },
]

export default function DestinationsPage() {
  return (
    <>
      <Helmet>
        <title>Destinations — ApnaTrip</title>
        <meta name="description" content="Explore 200+ curated destinations across India. From Himalayan peaks to coastal gems." />
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
              <div className="section-tag"><MapPin size={12} /> Destinations</div>
              <h1 className={styles.heroTitle}>
                200+ Destinations.<br />
                <em className={styles.heroItalic}>Infinite Stories.</em>
              </h1>
              <p className={styles.heroSub}>
                Hand-picked experiences across India — from misty mountain villages to sun-soaked beaches.
              </p>
            </motion.div>
          </div>
        </div>

        <div className={`container ${styles.content}`}>
          <div className={styles.grid}>
            {destinations.map((d, i) => (
              <motion.div
                key={d.name}
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <div className={styles.cardImg}>
                  <img src={d.image} alt={d.name} loading="lazy" />
                  <div className={styles.cardOverlay} />
                  <span className={styles.cardEmoji}>{d.emoji}</span>
                </div>
                <div className={styles.cardBody}>
                  <div>
                    <h3 className={styles.cardName}>{d.name}</h3>
                    <p className={styles.cardState}>{d.state}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>From <strong>{d.price}</strong></span>
                    <a href="https://app.apnatrip.in" className={styles.cardBtn} target="_blank" rel="noopener">
                      Book <ArrowRight size={14} />
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
