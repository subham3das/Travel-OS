import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageWizardLayout } from '../../components/packages/wizard/PackageWizardLayout';
import { DestinationSelector } from '../../components/packages/wizard/DestinationSelector';
import { DestinationChipList } from '../../components/packages/wizard/DestinationChipList';
import { DurationSelector } from '../../components/packages/wizard/DurationSelector';
import { SeasonSelector } from '../../components/packages/wizard/SeasonSelector';
import { MonthSelector } from '../../components/packages/wizard/MonthSelector';
import { CitySelector } from '../../components/packages/wizard/CitySelector';
import { MeetingPointCard } from '../../components/packages/wizard/MeetingPointCard';
import { TravelModeSelector } from '../../components/packages/wizard/TravelModeSelector';
import { DifficultySummaryCard } from '../../components/packages/wizard/DifficultySummaryCard';
import { WizardFooter } from '../../components/packages/wizard/WizardFooter';
import { usePackageWizard } from '../../hooks/usePackageWizard';

/**
 * Step 2 Content Component (Inside PackageWizardProvider)
 */
const CreatePackageStep2Content: React.FC = () => {
  const navigate = useNavigate();
  const { draft, updateStep2, isStep2Valid } = usePackageWizard();

  const step2 = draft?.step2 || {
    primaryDestination: 'Leh, Ladakh',
    destinationsCovered: ['Leh', 'Nubra Valley', 'Pangong Lake', 'Khardung La'],
    durationPreset: '7 Days / 6 Nights',
    days: 7,
    nights: 6,
    seasons: ['Spring', 'Summer'],
    bestMonths: ['Jul', 'Aug', 'Sep', 'Oct'],
    pickupCity: 'Leh',
    dropOffCity: 'Leh',
    meetingPoint: 'Leh Airport Arrival Gate',
    travelModes: ['Flight', 'Bus', 'Private Vehicle', 'Trek'],
  };

  const handleNext = () => {
    if (isStep2Valid) {
      navigate('/agency/packages/create/pricing');
    }
  };

  const handlePrevious = () => {
    navigate('/agency/packages/create');
  };

  return (
    <div className="space-y-6">
      {/* Primary Destination */}
      <DestinationSelector
        value={step2.primaryDestination || ''}
        onChange={(val) => updateStep2({ primaryDestination: val })}
      />

      {/* Destinations Covered */}
      <DestinationChipList
        destinations={step2.destinationsCovered || []}
        onChange={(dests) => updateStep2({ destinationsCovered: dests })}
      />

      {/* Trip Duration */}
      <DurationSelector
        preset={step2.durationPreset || '7 Days / 6 Nights'}
        days={step2.days ?? 7}
        nights={step2.nights ?? 6}
        onPresetChange={(preset, days, nights) =>
          updateStep2({ durationPreset: preset, days, nights })
        }
        onDaysChange={(d) => updateStep2({ days: d })}
        onNightsChange={(n) => updateStep2({ nights: n })}
      />

      {/* Travel Season */}
      <SeasonSelector
        selectedSeasons={step2.seasons || []}
        onChange={(seasons) => updateStep2({ seasons })}
      />

      {/* Best Time to Visit */}
      <MonthSelector
        selectedMonths={step2.bestMonths || []}
        onChange={(months) => updateStep2({ bestMonths: months })}
      />

      {/* Pickup & Drop-off City */}
      <CitySelector
        pickupCity={step2.pickupCity || ''}
        dropOffCity={step2.dropOffCity || ''}
        onPickupChange={(city) => updateStep2({ pickupCity: city })}
        onDropOffChange={(city) => updateStep2({ dropOffCity: city })}
      />

      {/* Meeting Point & Map Preview */}
      <MeetingPointCard
        value={step2.meetingPoint || ''}
        onChange={(val) => updateStep2({ meetingPoint: val })}
      />

      {/* Travel Mode */}
      <TravelModeSelector
        selectedModes={step2.travelModes || []}
        onChange={(modes) => updateStep2({ travelModes: modes })}
      />

      {/* Read-only Difficulty Summary Card */}
      <DifficultySummaryCard difficulty={draft?.step1?.tripDifficulty || null} />

      {/* Fixed Bottom Footer Bar */}
      <WizardFooter
        onCancel={handlePrevious}
        onNext={handleNext}
        isNextDisabled={!isStep2Valid}
        nextLabel="Next"
      />
    </div>
  );
};

/**
 * Step 2 Page Component
 * Route: /agency/packages/create/destination
 */
export const CreatePackageStep2Page: React.FC = () => {
  return (
    <PackageWizardLayout currentStep={2} stepTitle="Destination & Duration">
      <CreatePackageStep2Content />
    </PackageWizardLayout>
  );
};

export default CreatePackageStep2Page;
