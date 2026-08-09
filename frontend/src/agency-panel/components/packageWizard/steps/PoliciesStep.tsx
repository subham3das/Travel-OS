import React from 'react';
import { PackageSummaryHeader } from './itinerary/PackageSummaryHeader';
import { CancellationPolicySelector } from './policies/CancellationPolicySelector';
import { BookingTermsSection } from './policies/BookingTermsSection';
import { RefundProcessingSelector } from './policies/RefundProcessingSelector';
import { RequiredDocumentsSection } from './policies/RequiredDocumentsSection';
import { HealthSafetySection } from './policies/HealthSafetySection';
import { FAQSection } from './policies/FAQSection';
import { EmergencyContactCard } from './policies/EmergencyContactCard';
import { LegalConfirmationCard } from './policies/LegalConfirmationCard';
import { PoliciesOverviewCard } from './policies/PoliciesOverviewCard';

export const PoliciesStep: React.FC = () => {
  return (
    <div className="space-y-6 select-none">
      {/* 1. Package Summary Header */}
      <PackageSummaryHeader />

      {/* 2. Cancellation Policy */}
      <CancellationPolicySelector />

      {/* 3. Booking Terms */}
      <BookingTermsSection />

      {/* 4. Refund Policy */}
      <RefundProcessingSelector />

      {/* 5. Required Documents */}
      <RequiredDocumentsSection />

      {/* 6. Health & Safety + FAQs (2 columns on desktop) */}
      <div className="flex flex-col md:flex-row items-stretch gap-5">
        <HealthSafetySection />
        <FAQSection />
      </div>

      {/* 7. Emergency Contact */}
      <EmergencyContactCard />

      {/* 8. Legal Agreement */}
      <LegalConfirmationCard />

      {/* 9. Quick Overview Card */}
      <PoliciesOverviewCard />
    </div>
  );
};

export default PoliciesStep;
