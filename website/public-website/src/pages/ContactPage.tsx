import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact — ApnaTrip</title>
        <meta name="description" content="Get in touch with ApnaTrip. We're here to help with bookings, partnerships, and any travel-related queries." />
      </Helmet>
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-tag"><MessageCircle size={12} /> Contact Us</div>
              <h1 className={styles.heroTitle}>
                We're Here.<br />
                <em className={styles.italic}>Let's Talk.</em>
              </h1>
              <p className={styles.heroSub}>
                Questions, partnerships, or feedback — our team is happy to help. Reach out anytime.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container">
          <div className={styles.grid}>
            {/* Info */}
            <motion.div
              className={styles.info}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <h2 className={styles.infoTitle}>Get in Touch</h2>
              <p className={styles.infoDesc}>Prefer talking to a real person? Our team is available Monday–Saturday, 9am to 9pm IST.</p>

              <div className={styles.contacts}>
                {[
                  { icon: Mail, label: 'Email', value: 'hello@apnatrip.in', href: 'mailto:hello@apnatrip.in' },
                  { icon: Phone, label: 'Phone', value: '+91 99999 99999', href: 'tel:+919999999999' },
                  { icon: MapPin, label: 'Office', value: 'Bengaluru, Karnataka, India', href: '#' },
                  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9am–9pm IST', href: '#' },
                ].map(c => (
                  <a key={c.label} href={c.href} className={styles.contactItem}>
                    <div className={styles.contactIcon}>
                      <c.icon size={18} />
                    </div>
                    <div>
                      <div className={styles.contactLabel}>{c.label}</div>
                      <div className={styles.contactValue}>{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className={styles.whatsapp}>
                <a
                  href="https://wa.me/919999999999"
                  className="btn-primary"
                  target="_blank"
                  rel="noopener"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              className={`${styles.formWrap} glass`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <h3 className={styles.formTitle}>Send a Message</h3>
              <form className={styles.form} onSubmit={e => e.preventDefault()}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Name</label>
                    <input className={styles.input} type="text" placeholder="Your full name" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Subject</label>
                  <input className={styles.input} type="text" placeholder="What's this about?" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Message</label>
                  <textarea className={styles.textarea} rows={5} placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
