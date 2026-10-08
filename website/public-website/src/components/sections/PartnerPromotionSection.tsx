import { Link } from 'react-router-dom';
import {
  Car,
  Building2,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Wallet,
  Shield,
  Layers,
  Users,
  BarChart3,
} from 'lucide-react';

export default function PartnerPromotionSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Users size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Join India's Fastest Growing Travel Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Partner With ApnaTrip
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg">
            Whether you run a fleet of vehicles or manage a multi-destination travel agency, we give you the technology, escrow security, and traveler demand to grow your business.
          </p>
        </div>

        {/* 2-Column High Impact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Section 6: Vehicle Partners Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-lg flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-xs">
                <Car size={28} />
              </div>

              <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                Vehicle Owners & Fleet Operators
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Own Cars or Bikes?
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                List your vehicles for verified intercity route transfers or self-drive rentals. Get access to verified travelers, zero arbitrary commission cuts, and instant automated payouts.
              </p>

              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Wallet size={18} className="text-emerald-500 shrink-0" />
                  <span><strong>Real-Time Settlement:</strong> Direct bank payout within 24 hours of trip</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Shield size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span><strong>KYC Verified Drivers:</strong> Complete passenger security and document tracking</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <TrendingUp size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span><strong>Predictable Demand:</strong> Fixed scheduled route bookings & long-term rentals</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/partner"
                className="btn-primary w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <span>Join as Vehicle Partner</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* Section 7: Agency Promotion Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-lg flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-xs">
                <Building2 size={28} />
              </div>

              <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                Tour Operators & Destination Managers
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Own a Travel Agency?
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Join 200+ trusted agencies scaling their business with ApnaTrip. Replace spreadsheets and manual bank transfers with our end-to-end Agency Portal.
              </p>

              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Layers size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span><strong>Package & Itinerary Builder:</strong> Multi-day tours with photo galleries</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                  <span><strong>Automated Vouchers:</strong> Instant PDF booking slips & traveler insurance</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <BarChart3 size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span><strong>Revenue Analytics:</strong> Live inquiry pipeline and settlement status</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/partner"
                className="btn-primary w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <span>Join 200+ Trusted Agencies</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
