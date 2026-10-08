import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import TrustedByIndia from '../components/sections/TrustedByIndia';
import PlatformOverview from '../components/sections/PlatformOverview';
import EcosystemSection from '../components/sections/EcosystemSection';
import WhyApnaTrip from '../components/sections/WhyApnaTrip';
import DestinationsShowcase from '../components/sections/DestinationsShowcase';
import PartnerNetworkMarquee from '../components/sections/PartnerNetworkMarquee';
import PartnerPromotionSection from '../components/sections/PartnerPromotionSection';
import CommunitySection from '../components/sections/CommunitySection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import GrowthStatsSection from '../components/sections/GrowthStatsSection';
import FAQSection from '../components/sections/FAQSection';
import DownloadAppSection from '../components/sections/DownloadAppSection';


export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>ApnaTrip — India's Trusted Travel Ecosystem</title>
        <meta
          name="description"
          content="Discover India's hidden gems. Connect with verified local travel agencies, book verified routes, self-drive rentals, and travel with total confidence."
        />
        <link rel="canonical" href="https://apnatrip.in/" />
        {/* Schema.org Organization & TravelAgency Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: 'ApnaTrip',
            url: 'https://apnatrip.in',
            logo: 'https://apnatrip.in/logo/logo-dark.png',
            description:
              "India's trusted travel ecosystem connecting travelers with verified travel agencies, vehicle partners, and authentic destinations.",
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'IN',
            },
            sameAs: [
              'https://instagram.com/apnatrip.in',
              'https://twitter.com/apnatrip_in',
              'https://facebook.com/apnatrip.in',
            ],
          })}
        </script>
      </Helmet>

      <div>
        {/* Cinematic Hero */}
        <Hero />

        {/* Section 1: Trusted by India */}
        <TrustedByIndia />

        {/* Section 2: Platform Overview */}
        <PlatformOverview />

        {/* Section 3: Ecosystem Map */}
        <EcosystemSection />

        {/* Section 4: Why ApnaTrip */}
        <WhyApnaTrip />


        {/* Section 4: Featured Indian Destinations */}
        <DestinationsShowcase />

        {/* Section 5: Growing Partner Network Ticker */}
        <PartnerNetworkMarquee />

        {/* Sections 6 & 7: Vehicle & Agency Partner Promotion */}
        <PartnerPromotionSection />

        {/* Section 8: Traveler Community */}
        <CommunitySection />

        {/* Section 9: Verified Traveler Testimonials */}
        <TestimonialsSection />

        {/* Section 10: Growth Statistics */}
        <GrowthStatsSection />

        {/* Section 11: FAQ Accordion */}
        <FAQSection />

        {/* Section 12: Download App */}
        <DownloadAppSection />
      </div>
    </>
  );
}
