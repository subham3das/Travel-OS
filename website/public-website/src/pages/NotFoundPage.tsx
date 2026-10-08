import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, MapPin } from 'lucide-react'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found · ApnaTrip</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.glow} />
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.icon}>
            <MapPin size={32} />
          </div>
          <h1 className={styles.code}>404</h1>
          <h2 className={styles.title}>Page Not Found</h2>
          <p className={styles.desc}>
            Looks like this destination doesn't exist on our map.<br />
            Let's get you back on track.
          </p>
          <Link to="/" className="btn-primary">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </motion.div>
      </div>
    </>
  )
}
