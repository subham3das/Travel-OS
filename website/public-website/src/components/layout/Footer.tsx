import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const CURRENT_YEAR = new Date().getFullYear();

const footerLinks = {
  Destinations: [
    { label: 'Meghalaya & Cherrapunji', href: '/destinations?region=meghalaya' },
    { label: 'Ladakh High Passes', href: '/destinations?region=ladakh' },
    { label: 'Spiti Valley Expedition', href: '/destinations?region=spiti-valley' },
    { label: 'Kerala Backwaters', href: '/destinations?region=kerala' },
    { label: 'Kaziranga & Majuli Island', href: '/destinations?region=assam' },
    { label: 'South Goa Coastline', href: '/destinations?region=goa' },
  ],
  Platform: [
    { label: 'Traveler App', href: '/#overview' },
    { label: 'Tour Packages', href: '/packages' },
    { label: 'Intercity Route Cabs', href: '/car-booking' },
    { label: 'Self Drive Rentals', href: '/car-booking' },
    { label: 'Traveler Community', href: '/#overview' },
    { label: 'WhatsApp Community', href: 'https://app.apnatrip.in/community' },
  ],
  Partners: [
    { label: 'Join as Travel Agency', href: '/partner' },
    { label: 'List Vehicles & Fleets', href: '/partner' },
    { label: 'Agency Portal Login', href: 'https://app.apnatrip.in/login' },
    { label: 'Partner Verification Policy', href: '/about' },
    { label: 'Real-Time Settlement Guide', href: '/partner' },
  ],
  Company: [
    { label: 'About ApnaTrip', href: '/about' },
    { label: 'Verification & Safety', href: '/about' },
    { label: 'Careers at ApnaTrip', href: '/about' },
    { label: 'Press & Media Kit', href: '/about' },
    { label: 'Contact Support Team', href: '/contact' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Privacy Policy (DPDP)', href: '/legal/privacy' },
    { label: 'Milestone Escrow Rules', href: '/legal/escrow' },
    { label: 'Vehicle Handover Terms', href: '/legal/vehicle-handover' },
    { label: 'Grievance Redressal', href: '/legal/grievance' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="container mx-auto px-4">
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800">
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo forceTheme="Dark" className="h-9 w-auto" />
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              India's trusted travel ecosystem connecting authentic explorers with verified tour operators, route transport, and vehicle partners across the subcontinent.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold pt-1">
              <ShieldCheck size={16} />
              <span>100% Verified Partners · Milestone Escrow Protection</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 max-w-lg lg:ml-auto">
              <h4 className="text-white font-bold text-base mb-1">
                Stay Updated on Verified Indian Trails
              </h4>
              <p className="text-slate-400 text-xs mb-4">
                Receive weekly route alerts, seasonal travel permits, and agency discounts. No spam.
              </p>
              {subscribed ? (
                <div className="text-emerald-400 text-xs font-semibold py-2">
                  ✓ Thank you! You’re subscribed to ApnaTrip Field Updates.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 5-Column Navigation Directory */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="space-y-3">
              <h5 className="text-white text-xs uppercase tracking-wider font-bold">
                {group}
              </h5>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {CURRENT_YEAR} ApnaTrip Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart size={13} className="text-red-500 fill-red-500" />
            <span>for Indian Travelers & Local Operators</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
