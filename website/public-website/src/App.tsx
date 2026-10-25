import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/layout/ScrollProgress'
import HomePage from './pages/HomePage'
import DestinationsPage from './pages/DestinationsPage'
import PackagesPage from './pages/PackagesPage'
import CarBookingPage from './pages/CarBookingPage'
import PartnerPage from './pages/PartnerPage'
import PricingPage from './pages/PricingPage'
import AboutPage from './pages/AboutPage'
import SafetyPage from './pages/SafetyPage'
import CareersPage from './pages/CareersPage'
import ContactPage from './pages/ContactPage'
import LegalCenterPage from './pages/legal/LegalCenterPage'
import NotFoundPage from './pages/NotFoundPage'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const pageTransition = {
  duration: 0.4,
  ease: 'easeOut' as const,
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/car-booking" element={<CarBookingPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/verification-safety" element={<SafetyPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalCenterPage />} />
          <Route path="/legal/:slug" element={<LegalCenterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </>
  )
}
