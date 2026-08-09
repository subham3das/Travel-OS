import React from 'react';
import { DestinationSelector } from '../../packages/wizard/DestinationSelector';
import { DestinationChipList } from '../../packages/wizard/DestinationChipList';
import { DurationSelector } from '../../packages/wizard/DurationSelector';
import { SeasonSelector } from '../../packages/wizard/SeasonSelector';
import { MonthSelector } from '../../packages/wizard/MonthSelector';
import { CitySelector } from '../../packages/wizard/CitySelector';
import { MeetingPointCard } from '../../packages/wizard/MeetingPointCard';
import { TravelModeSelector } from '../../packages/wizard/TravelModeSelector';
import { DifficultySummaryCard } from '../../packages/wizard/DifficultySummaryCard';
import { usePackageWizard } from '../../../hooks/usePackageWizard';

export const DestinationStep: React.FC = () => {
  const { draft, updateStep2 } = usePackageWizard();

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
    </div>
  );
};

export default DestinationStep;
