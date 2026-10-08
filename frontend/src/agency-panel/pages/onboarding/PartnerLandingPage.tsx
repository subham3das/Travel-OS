import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  LayoutDashboard,
  CalendarCheck,
  Users,
  BarChart3,
  Megaphone,
  HeadphonesIcon,
  ShieldCheck,
  Compass,
  Car,
  Hotel,
  Home,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '../../../common/brand';

const benefits = [
  { icon: BadgeCheck, label: 'Verified Partner Badge', color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: LayoutDashboard, label: 'Dedicated Dashboard', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: CalendarCheck, label: 'Booking Management', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Users, label: 'Customer Management', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: BarChart3, label: 'Reports & Analytics', color: 'text-sky-600', bg: 'bg-sky-50' },
  { icon: Megaphone, label: 'Marketing Support', color: 'text-pink-600', bg: 'bg-pink-50' },
  { icon: HeadphonesIcon, label: 'Priority Support', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: ShieldCheck, label: 'Secure Payments', color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const stats = [
  { value: '500+', label: 'Active Partners' },
  { value: '50K+', label: 'Bookings Served' },
  { value: '98%', label: 'Partner Satisfaction' },
  { value: '24h', label: 'Avg. Approval Time' },
];

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const activeBusinesses = [
  {
    icon: Compass,
    title: 'Travel Agency',
    desc: 'Tour operators, DMCs, itinerary planners, and group tour managers.',
    badge: 'Available Now',
    features: ['Publish & Sell Tour Packages', 'Direct Traveler Bookings', 'Automated Invoicing', 'Revenue Analytics'],
  },
  {
    icon: Car,
    title: 'Car Rental',
    desc: 'Fleet owners, self-drive operators, and intercity cab service providers.',
    badge: 'Available Now',
    features: ['Vehicle Listing & Fleet Mgmt', 'Driver Assignment', 'Route-Based Pricing', 'Instant Settlements'],
  },
];

const comingSoon = [
  { icon: Hotel, label: 'Hotels' },
  { icon: Home, label: 'Homestays' },
  { icon: Zap, label: 'Activities' },
];

export const PartnerLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo theme="light" className="h-9 w-auto" alt="ApnaTrip" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:inline">Already a partner?</span>
            <button
              onClick={() => navigate('/agency/login')}
              className="text-sm font-semibold text-[#583BE8] hover:text-[#4529d8] px-4 py-2 rounded-xl hover:bg-purple-50 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/agency/signup')}
              className="text-sm font-bold text-white bg-[#583BE8] hover:bg-[#4529d8] px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F7FF] via-white to-white pt-20 pb-24">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #c4b5fd 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fade}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                ApnaTrip Partner Network
              </span>
            </motion.div>

            <motion.h1
              variants={fade}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-tight"
            >
              Become an <span className="text-[#583BE8]">ApnaTrip</span> Partner
            </motion.h1>

            <motion.p
              variants={fade}
              className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Grow your travel business using India's next-generation travel platform.
              <br className="hidden sm:block" />
              Manage bookings, customers, payments and operations from one dashboard.
            </motion.p>

            <motion.div variants={fade} className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-2">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#583BE8]">{s.value}</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/agency/signup')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#583BE8] hover:bg-[#4529d8] text-white font-bold text-base rounded-2xl shadow-lg shadow-violet-300/40 transition-all cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/agency/login')}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
              >
                Already have an account? Sign In
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Everything you need to grow
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              One platform. Every tool your travel business needs.
            </p>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {benefits.map(({ icon: Icon, label, color, bg }) => (
              <motion.div
                key={label}
                variants={fade}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all bg-white text-center"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="text-xs font-bold text-[#0F172A] leading-tight">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F8F7FF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              What would you like to register?
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              Choose your business type to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {activeBusinesses.map(({ icon: Icon, title, desc, badge, features }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-slate-200 hover:border-[#583BE8]/40 shadow-sm hover:shadow-lg transition-all p-7 flex flex-col gap-5"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#583BE8]" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                    {badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0F172A]">{title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/agency/signup')}
                  className="mt-auto w-full py-3 bg-[#583BE8] hover:bg-[#4529d8] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comingSoon.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-white/60 border border-slate-200 rounded-2xl p-5 flex items-center gap-4 opacity-60"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-500">{label}</div>
                  <div className="text-xs text-slate-400 font-medium">Coming Soon</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-[#583BE8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to grow your business?
          </h2>
          <p className="text-violet-200 text-base font-medium">
            Join 500+ partners already earning with ApnaTrip. Setup takes less than 5 minutes.
          </p>
          <button
            onClick={() => navigate('/agency/signup')}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-slate-50 text-[#583BE8] font-black text-base rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="text-violet-300 text-sm font-medium">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/agency/login')}
              className="underline underline-offset-2 text-white hover:text-violet-100 cursor-pointer font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0F172A] text-center">
        <BrandLogo theme="dark" className="h-8 w-auto mx-auto mb-3" alt="ApnaTrip" />
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved. · Enterprise Partner Network
        </p>
      </footer>
    </div>
  );
};

export default PartnerLandingPage;
