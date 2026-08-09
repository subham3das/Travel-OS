// ─── Agency Package Wizard Pricing Mock Data ─────────────────────────────

export type PricingModel = 'Price Per Person' | 'Price Per Couple' | 'Group Pricing' | 'Custom Pricing';

export type PaymentType = 'Full Payment' | 'Partial Payment';

export type PricingInclusion =
  | 'GST Included'
  | 'Permit Charges'
  | 'Toll Included'
  | 'Driver Charges'
  | 'Fuel Charges';

export type CancellationPolicy = 'Flexible' | 'Moderate' | 'Strict' | 'Non-Refundable';

export const PRICING_INCLUSIONS_CONFIG: { id: PricingInclusion; label: string }[] = [
  { id: 'GST Included', label: 'GST Included' },
  { id: 'Permit Charges', label: 'Permit Charges' },
  { id: 'Toll Included', label: 'Toll Included' },
  { id: 'Driver Charges', label: 'Driver Charges' },
  { id: 'Fuel Charges', label: 'Fuel Charges' },
];

export const CANCELLATION_POLICIES: CancellationPolicy[] = [
  'Flexible',
  'Moderate',
  'Strict',
  'Non-Refundable',
];
