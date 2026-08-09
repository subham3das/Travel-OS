import React from 'react';
import { PackageSummaryHeader } from './itinerary/PackageSummaryHeader';
import { IncludedItemsSection } from './inclusions/IncludedItemsSection';
import { ExcludedItemsSection } from './inclusions/ExcludedItemsSection';
import { PackingItemsSection } from './inclusions/PackingItemsSection';
import { OptionalAddOnsSection } from './inclusions/OptionalAddOnsSection';
import { ImportantNotesCard } from './inclusions/ImportantNotesCard';
import { QuickPreviewCard } from './inclusions/QuickPreviewCard';

export const InclusionsStep: React.FC = () => {
  return (
    <div className="space-y-6 select-none">
      {/* 1. Package Summary Header */}
      <PackageSummaryHeader />

      {/* 2. What's Included */}
      <IncludedItemsSection />

      {/* 3. What's NOT Included */}
      <ExcludedItemsSection />

      {/* 4. Things Travelers Should Carry */}
      <PackingItemsSection />

      {/* 5. Optional Add-ons */}
      <OptionalAddOnsSection />

      {/* 6. Important Notes */}
      <ImportantNotesCard />

      {/* 7. Quick Preview Card */}
      <QuickPreviewCard />
    </div>
  );
};

export default InclusionsStep;
