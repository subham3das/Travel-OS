import React from 'react';
import { PackagePreviewHero } from './preview/PackagePreviewHero';
import { CompletionChecklist } from './preview/CompletionChecklist';
import { PackageStatisticsGrid } from './preview/PackageStatisticsGrid';
import { TravelerPreviewCard } from './preview/TravelerPreviewCard';
import { SEOAccordion } from './preview/SEOAccordion';
import { PublishSettingsCard } from './preview/PublishSettingsCard';
import { SchedulePublishingCard } from './preview/SchedulePublishingCard';
import { VisibilityTargetsSelector } from './preview/VisibilityTargetsSelector';
import { FinalAgreementCard } from './preview/FinalAgreementCard';
import { PublishActionBar } from './preview/PublishActionBar';

export const PreviewStep: React.FC = () => {
  return (
    <div className="space-y-6 select-none">
      {/* 1. Hero Card */}
      <PackagePreviewHero />

      {/* 2. Completion Status & Statistics (2 columns on desktop) */}
      <div className="flex flex-col md:flex-row items-stretch gap-5">
        <CompletionChecklist />
        <PackageStatisticsGrid />
      </div>

      {/* 3. Traveler Preview Card */}
      <TravelerPreviewCard />

      {/* 4. SEO Accordion */}
      <SEOAccordion />

      {/* 5. Publish Settings */}
      <PublishSettingsCard />

      {/* 6. Schedule Publishing */}
      <SchedulePublishingCard />

      {/* 7. Visibility Targets */}
      <VisibilityTargetsSelector />

      {/* 8. Final Agreement */}
      <FinalAgreementCard />

      {/* 9. Publish Action Bar */}
      <PublishActionBar />
    </div>
  );
};

export default PreviewStep;
