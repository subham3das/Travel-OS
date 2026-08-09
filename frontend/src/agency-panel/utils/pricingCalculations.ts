// ─── Package Pricing Helper Utilities ──────────────────────────────────────

export interface PricingCalculationResult {
  savingsAmount: number;
  savingsPercentage: number;
  effectivePrice: number;
  estimatedTax: number;
  finalPrice: number;
}

export const calculatePricingSummary = (
  originalPrice: number = 0,
  discountedPrice: number = 0,
  advanceAmount: number = 0,
  taxRatePercent: number = 5
): PricingCalculationResult => {
  const orig = Math.max(0, originalPrice);
  const disc = Math.max(0, discountedPrice);

  const effectivePrice = disc > 0 && disc < orig ? disc : orig;
  const savingsAmount = disc > 0 && disc < orig ? orig - disc : 0;
  const savingsPercentage = orig > 0 ? Math.round((savingsAmount / orig) * 100) : 0;

  const estimatedTax = Math.round(effectivePrice * (taxRatePercent / 100));
  const finalPrice = effectivePrice + estimatedTax;

  return {
    savingsAmount,
    savingsPercentage,
    effectivePrice,
    estimatedTax,
    finalPrice,
  };
};
