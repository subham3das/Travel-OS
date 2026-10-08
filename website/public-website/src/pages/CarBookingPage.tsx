import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Car, Route, CheckCircle, ArrowRight } from 'lucide-react'
import styles from './CarBookingPage.module.css'

const vehicles = [
  { name: 'Swift Dzire', type: 'Sedan', seats: 4, price: '₹12/km', img: '🚗' },
  { name: 'Innova Crysta', type: 'SUV', seats: 7, price: '₹18/km', img: '🚙' },
  { name: 'Tempo Traveller', type: 'Van', seats: 12, price: '₹25/km', img: '🚐' },
  { name: 'Ertiga', type: 'MPV', seats: 7, price: '₹14/km', img: '🚗' },
]

const rentalCars = [
  { name: 'Hyundai i20', type: 'Hatchback', img: '🚘', price: '₹899/day', mileage: '200km free' },
  { name: 'Maruti Brezza', type: 'Compact SUV', img: '🚙', price: '₹1,299/day', mileage: '200km free' },
  { name: 'Honda City', type: 'Sedan', img: '🚗', price: '₹1,099/day', mileage: '150km free' },
  { name: 'Kia Seltos', type: 'SUV', img: '🚙', price: '₹1,499/day', mileage: '150km free' },
]

export default function CarBookingPage() {
  return (
    <>
      <Helmet>
        <title>Car Booking & Self Drive Rental — ApnaTrip</title>
        <meta name="description" content="Book trusted cab services and self-drive car rentals across India. Fixed prices, verified vehicles, professional drivers." />
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
              <div className="section-tag"><Car size={12} /> Car Booking</div>
              <h1 className={styles.heroTitle}>
                Drive On Your Terms.<br />
                <em className={styles.italic}>No Surprises.</em>
              </h1>
              <p className={styles.heroSub}>
                Fixed-route travel with verified drivers, or self-drive freedom with well-maintained cars. Your choice.
              </p>
              <div className={styles.heroCtas}>
                <a href="https://app.apnatrip.in" className="btn-primary" target="_blank" rel="noopener">
                  Book Now <ArrowRight size={16} />
                </a>
                <a href="https://app.apnatrip.in" className="btn-ghost" target="_blank" rel="noopener">
                  Self Drive Rental
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container">
          {/* Route Booking */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className="section-tag"><Route size={12} /> Route Booking</div>
              <h2 className="section-heading">Fixed-Route Travel</h2>
              <p className="section-subheading">Know the price before you book. Transparent fares, professional drivers, zero hidden charges.</p>
            </div>
            <div className={styles.vehicleGrid}>
              {vehicles.map((v, i) => (
                <motion.div
                  key={v.name}
                  className={styles.vehicleCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles.vehicleEmoji}>{v.img}</div>
                  <div className={styles.vehicleInfo}>
                    <h3 className={styles.vehicleName}>{v.name}</h3>
                    <p className={styles.vehicleType}>{v.type} · {v.seats} seats</p>
                  </div>
                  <div className={styles.vehiclePrice}>
                    <span>{v.price}</span>
                    <a href="https://app.apnatrip.in" className={styles.vehicleBtn} target="_blank" rel="noopener">Book</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Self Drive */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className="section-tag"><Car size={12} /> Self Drive</div>
              <h2 className="section-heading">Rent & Drive Yourself</h2>
              <p className="section-subheading">GPS-equipped, well-maintained cars. Choose hourly, daily, or weekly.</p>
            </div>
            <div className={styles.rentalGrid}>
              {rentalCars.map((c, i) => (
                <motion.div
                  key={c.name}
                  className={`${styles.rentalCard} glass`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={styles.rentalEmoji}>{c.img}</div>
                  <h3 className={styles.rentalName}>{c.name}</h3>
                  <p className={styles.rentalType}>{c.type}</p>
                  <div className={styles.rentalMeta}>
                    <CheckCircle size={12} style={{ color: 'var(--brand-accent)' }} />
                    {c.mileage}
                  </div>
                  <div className={styles.rentalFooter}>
                    <span className={styles.rentalPrice}>{c.price}</span>
                    <a href="https://app.apnatrip.in" className={styles.rentalBtn} target="_blank" rel="noopener">
                      Rent <ArrowRight size={13} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
