import { useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle, CheckCircle2, Loader2, AlertCircle, Send, RotateCcw } from 'lucide-react'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (!formData.message.trim()) {
      setError('Please enter your message.')
      return
    }

    setStatus('submitting')

    // Simulate sending inquiry
    setTimeout(() => {
      setStatus('success')
    }, 700)
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' })
    setStatus('idle')
    setError(null)
  }

  return (
    <>
      <Helmet>
        <title>Contact — ApnaTrip</title>
        <meta name="description" content="Get in touch with ApnaTrip. We're here to help with partnerships, operator onboarding, and technology inquiries." />
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
                  { icon: Mail, label: 'Email', value: 'subhamdas26e@gmail.com', href: 'mailto:subhamdas26e@gmail.com' },
                  { icon: Phone, label: 'Phone', value: '+91 9954060000', href: 'tel:+919954060000' },
                  { icon: MapPin, label: 'Office', value: 'Dibrugarh, Assam 786001, India', href: '#' },
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
                  href="https://wa.me/919954060000"
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

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                        Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. We have received your inquiry and our team will get back to you at <strong className="text-slate-900 dark:text-white">{formData.email}</strong> within 24 hours.
                      </p>
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Send Another Message</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className={styles.form}
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {error && (
                      <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5">
                        <AlertCircle size={16} className="text-rose-500 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Name *</label>
                        <input
                          className={styles.input}
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Email *</label>
                        <input
                          className={styles.input}
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Subject</label>
                      <input
                        className={styles.input}
                        type="text"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What's this about? (e.g. Partnership, Question)"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Message *</label>
                      <textarea
                        className={styles.textarea}
                        rows={5}
                        required
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                        opacity: status === 'submitting' ? 0.75 : 1,
                      }}
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
