import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  Mail,
  MessageCircle,
  Globe,
  Compass,
  Star,
  Users,
  ShieldCheck,
  Award,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

import { useAgency } from '../../hooks/useAgency';
import { AgencyHero } from './components/AgencyHero';
import { AgencyStats } from './components/AgencyStats';
import { AgencyTabs } from './components/AgencyTabs';
import { AboutSection } from './components/AboutSection';
import { PackageCarousel } from './components/PackageCarousel';
import { ItineraryMap } from './components/ItineraryMap';
import { ReviewSection } from './components/ReviewSection';
import { TeamSection } from './components/TeamSection';
import { CertificationSection } from './components/CertificationSection';
import { OfficeSection } from './components/OfficeSection';
import { PolicySection } from './components/PolicySection';
import { SupportSection } from './components/SupportSection';
import { StickyBookingBar } from './components/StickyBookingBar';

export const AgencyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { agencyId, id } = useParams<{ agencyId?: string; id?: string }>();
  const activeId = agencyId || id;

  const { agency, loading, error } = useAgency(activeId);
  const [activeTab, setActiveTab] = useState('about');

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4 text-slate-500 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-[#6356E5]/20 border-t-[#6356E5] animate-spin" />
        <p className="text-sm font-extrabold text-[#0F172A]">Loading Agency Profile...</p>
      </div>
    );
  }

  // Not Found State
  if (!agency || error) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#FF4D6D] flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#0F172A]">Agency Not Found</h2>
          <p className="text-sm font-medium text-slate-500 max-w-sm">
            We couldn't find an agency with ID "{activeId}". It may have been removed or changed address.
          </p>
        </div>
        <button
          onClick={() => navigate('/agencies')}
          className="px-6 py-3 rounded-2xl bg-[#6356E5] text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-[#5245d6] transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agencies</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* 1. Dynamic Hero Cover Header */}
      <AgencyHero agency={agency} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10 pb-36">
        {/* 2. Quick Contact Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-100/90 shadow-2xs grid grid-cols-5 gap-2 text-center"
        >
          <a
            href={`tel:${agency.phone}`}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50 text-slate-700 hover:text-[#6356E5] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold">Call</span>
          </a>

          <a
            href={`https://wa.me/${agency.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-extrabold">Whatsapp</span>
          </a>

          <a
            href={`mailto:${agency.email}`}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-rose-50 text-slate-700 hover:text-[#FF4D6D] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
              <Mail className="w-5 h-5 text-[#FF4D6D]" />
            </div>
            <span className="text-xs font-extrabold">Email</span>
          </a>

          <button
            onClick={() => navigate(`/chat/${agency.id}`)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50 text-slate-700 hover:text-[#6356E5] transition-all cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
              <MessageCircle className="w-5 h-5 text-[#6356E5]" />
            </div>
            <span className="text-xs font-extrabold">Message</span>
          </button>

          <a
            href={agency.website}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
              <Globe className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-xs font-extrabold">Website</span>
          </a>
        </motion.div>

        {/* 3. Agency Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <AgencyStats agency={agency} />
        </motion.div>

        {/* 4. Sticky Navigation Tabs */}
        <AgencyTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

        {/* 5. About Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <AboutSection agency={agency} />
        </motion.section>

        {/* 6. Top Packages Carousel */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <PackageCarousel packages={agency.packages} />
        </motion.section>

        {/* 7. Sample Itinerary & Route Map */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <ItineraryMap />
        </motion.section>

        {/* 8. Traveler Reviews */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <ReviewSection reviews={agency.reviews} />
        </motion.section>

        {/* 9. Meet Our Team */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <TeamSection team={agency.team} />
        </motion.section>

        {/* 10. Certifications & Registrations */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <CertificationSection certifications={agency.certifications} />
        </motion.section>

        {/* 11. Office & Location */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <OfficeSection
            agencyName={agency.name}
            office={agency.office}
            coordinates={agency.coordinates}
          />
        </motion.section>

        {/* 12. Why Choose Us */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-3.5"
        >
          <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
            Why Choose Us
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Expert Local Team</h4>
              <p className="text-[11px] font-medium text-slate-500 leading-snug">
                Experienced travel professionals and local guides.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Custom Itineraries</h4>
              <p className="text-[11px] font-medium text-slate-500 leading-snug">
                Tailored itineraries to your travel preferences.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">Best Price Guarantee</h4>
              <p className="text-[11px] font-medium text-slate-500 leading-snug">
                Best value for money with no hidden charges.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF4D6D] flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">24/7 Support</h4>
              <p className="text-[11px] font-medium text-slate-500 leading-snug">
                Available 24/7 before, during, and after your trip.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 13. Travel Style Chips */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
            Travel Style
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {agency.travelStyles.map((style, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#6356E5] text-xs font-bold"
              >
                {style}
              </span>
            ))}
          </div>
        </motion.section>

        {/* 14. Popular Destinations Carousel */}
        {agency.popularDestinations && agency.popularDestinations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                Popular Destinations
              </h3>
              <button
                onClick={() => navigate('/search/results?tab=destinations')}
                className="text-xs sm:text-sm font-bold text-[#6356E5] hover:underline focus:outline-none cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              {agency.popularDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => navigate(`/destination/${dest.id}`)}
                  className="w-48 sm:w-56 rounded-3xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-md transition-all overflow-hidden shrink-0 cursor-pointer group"
                >
                  <div className="w-full h-32 overflow-hidden bg-slate-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{dest.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                      <span className="text-slate-300">•</span>
                      <span>({dest.reviews})</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 15. Policies Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <PolicySection />
        </motion.section>

        {/* 16. Support Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SupportSection />
        </motion.section>
      </main>

      {/* 17. Sticky Booking Bottom CTA Bar */}
      <StickyBookingBar startingPrice={agency.startingPrice} onViewPackages={() => navigate('/search/results?tab=packages')} />
    </div>
  );
};

export default AgencyDetailsPage;
