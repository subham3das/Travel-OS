import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import {
  Compass,
  Car,
  Hotel,
  Home,
  Tent,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAgencyAuthContext } from '../../services/agencyAuth.service';

/**
 * Step 5: Partner Business Selection Welcome Screen
 * Route: /agency/onboarding/select-type, /partner/select-business, /partner
 */
export const PartnerTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { agencyUser, isAuthenticated } = useAgencyAuthContext();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/agency/signup', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSelect = (type: 'agency' | 'car_rental') => {
    if (type === 'car_rental') {
      navigate('/agency/onboarding/car-rental');
    } else {
      navigate('/agency/onboarding/business');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const activeCategories = [
    {
      id: 'agency',
      title: 'Travel Agency',
      description: 'Tour operators, DMCs, itinerary designers, and group tour planners.',
      icon: <Compass className="w-8 h-8 text-[#583BE8]" />,
      badge: 'Available Now',
      features: [
        'Publish & Sell Tour Packages',
        'Direct Traveler Bookings & Inquiries',
        'Automated Invoicing & Payouts',
        'Direct Chat with Customers',
      ],
      actionLabel: 'Register Travel Agency',
      color: 'border-[#583BE8]/30 hover:border-[#583BE8] shadow-purple-500/5',
      buttonClass: 'bg-[#583BE8] hover:bg-[#472ecc] text-white shadow-lg shadow-[#583BE8]/25',
      type: 'agency' as const,
    },
    {
      id: 'car_rental',
      title: 'Car Rental Business',
      description: 'Fleet owners, taxi operators, chauffeur services, and self-drive rentals.',
      icon: <Car className="w-8 h-8 text-emerald-600" />,
      badge: 'Available Now',
      features: [
        'Fleet Inventory & Pricing Control',
        'Hourly, Daily, & Outstation Bookings',
        'Driver Assignment & Dispatch',
        'Integrated Telematics & Verification',
      ],
      actionLabel: 'Register Car Rental',
      color: 'border-emerald-500/30 hover:border-emerald-500 shadow-emerald-500/5',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25',
      type: 'car_rental' as const,
    },
  ];

  const comingSoonCategories = [
    {
      id: 'hotel',
      title: 'Hotel & Resorts',
      description: 'Hotels, luxury resorts, boutique stays, and business accommodations.',
      icon: <Hotel className="w-7 h-7 text-slate-400" />,
    },
    {
      id: 'homestay',
      title: 'Homestay & Villas',
      description: 'Local authentic homestays, bed & breakfast, and vacation rentals.',
      icon: <Home className="w-7 h-7 text-slate-400" />,
    },
    {
      id: 'activity',
      title: 'Activity Provider',
      description: 'Adventure sports, trekking guides, water sports, and local experiences.',
      icon: <Tent className="w-7 h-7 text-slate-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8 font-sans select-none overflow-y-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl flex flex-col gap-8 py-2"
      >
        {/* ── Top Header & Welcome ── */}
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Account Verified & Active</span>
          </div>

          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Welcome, {agencyUser?.name || 'Partner'}!
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Your partner account has been successfully created. What would you like to register today?
            </p>
          </div>
        </motion.div>

        {/* ── Active Business Cards ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {activeCategories.map((cat) => (
            <div
              key={cat.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border-2 ${cat.color} transition-all flex flex-col justify-between relative group hover:shadow-2xl hover:-translate-y-0.5 duration-200`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs border border-slate-100">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">{cat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  {cat.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#583BE8] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => handleSelect(cat.type)}
                  className={`w-full py-4 px-6 rounded-2xl ${cat.buttonClass} font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <span>{cat.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Future Ready / Coming Soon Categories ── */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto w-full pt-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Future Ready — Coming Soon
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comingSoonCategories.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/60 opacity-60 flex flex-col justify-between space-y-3 cursor-not-allowed select-none"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    <span>Coming Soon</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-600">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Trust Footer ── */}
        <motion.div variants={itemVariants} className="text-center pt-6 text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#583BE8]" />
          <span>ApnaTrip SaaS Architecture: One login supports multi-business management.</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PartnerTypeSelectionPage;
