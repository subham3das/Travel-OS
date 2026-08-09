import React from 'react';
import { usePackageWizard } from '../../../hooks/usePackageWizard';
import { PricingModelSelector } from './pricing/PricingModelSelector';
import { PriceInputSection } from './pricing/PriceInputSection';
import { BookingTypeSelector } from './pricing/BookingTypeSelector';
import { PricingIncludesSelector } from './pricing/PricingIncludesSelector';
import { ExtraChargesSection } from './pricing/ExtraChargesSection';
import { CouponToggleCard } from './pricing/CouponToggleCard';
import { CancellationPolicySelector } from './pricing/CancellationPolicySelector';
import { PriceSummaryCard } from './pricing/PriceSummaryCard';
import { PricingInfoCard } from './pricing/PricingInfoCard';

export const PricingStep: React.FC = () => {
  const { draft, updateStep3 } = usePackageWizard();

  const step3 = draft?.step3 || {
    pricingModel: 'Price Per Person',
    originalPrice: 18999,
    discountedPrice: 16999,
    minTravelers: 4,
    maxTravelers: 20,
    recommendedGroupSize: 12,
    paymentType: 'Partial Payment',
    advanceAmount: 5000,
    inclusions: [
      'GST Included',
      'Permit Charges',
      'Toll Included',
      'Driver Charges',
      'Fuel Charges',
    ],
    extraCharges: {
      singleOccupancy: false,
      childPrice: false,
      extraBed: false,
      peakSeasonSurcharge: false,
    },
    allowCouponCodes: true,
    cancellationPolicy: 'Moderate',
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Pricing Model */}
      <PricingModelSelector
        value={step3.pricingModel}
        onChange={(model) => updateStep3({ pricingModel: model })}
      />

      {/* 2. Base Price */}
      <PriceInputSection
        originalPrice={step3.originalPrice}
        discountedPrice={step3.discountedPrice}
        onOriginalPriceChange={(val) => updateStep3({ originalPrice: val })}
        onDiscountedPriceChange={(val) => updateStep3({ discountedPrice: val })}
      />

      {/* 3. Booking Amount */}
      <BookingTypeSelector
        paymentType={step3.paymentType}
        advanceAmount={step3.advanceAmount}
        onPaymentTypeChange={(type) => updateStep3({ paymentType: type })}
        onAdvanceAmountChange={(val) => updateStep3({ advanceAmount: val })}
      />

      {/* 4. Pricing Includes */}
      <PricingIncludesSelector
        inclusions={step3.inclusions || []}
        onChange={(inclusions) => updateStep3({ inclusions })}
      />

      {/* 5. Extra Charges */}
      <ExtraChargesSection
        extraCharges={step3.extraCharges}
        onChange={(key) =>
          updateStep3({
            extraCharges: {
              ...step3.extraCharges,
              [key]: !step3.extraCharges[key],
            },
          })
        }
      />

      {/* 6. Coupons & Cancellation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <CouponToggleCard
          allowCouponCodes={step3.allowCouponCodes}
          onToggle={() => updateStep3({ allowCouponCodes: !step3.allowCouponCodes })}
        />
        <CancellationPolicySelector
          cancellationPolicy={step3.cancellationPolicy}
          onChange={(policy) => updateStep3({ cancellationPolicy: policy })}
        />
      </div>

      {/* 7. Price Summary & Info Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <PriceSummaryCard
          originalPrice={step3.originalPrice}
          discountedPrice={step3.discountedPrice}
          advanceAmount={step3.advanceAmount}
        />
        <PricingInfoCard />
      </div>
    </div>
  );
};

export default PricingStep;
