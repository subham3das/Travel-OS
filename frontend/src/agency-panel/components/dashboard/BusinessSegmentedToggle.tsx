import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Car, Sparkles } from 'lucide-react';
import { useActiveBusiness, ActiveBusinessType } from '../../context/ActiveBusinessContext';

interface BusinessSegmentedToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BusinessSegmentedToggle: React.FC<BusinessSegmentedToggleProps> = ({
  className = '',
  size = 'md',
}) => {
  const { activeBusiness, switchBusiness, carRentalStatus } = useActiveBusiness();

  const options: Array<{
    id: ActiveBusinessType;
    label: string;
    mobileLabel: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'agency',
      label: 'Travel Agency',
      mobileLabel: 'Agency',
      icon: Building2,
    },
    {
      id: 'car_rental',
      label: 'Car Rental',
      mobileLabel: 'Car Rental',
      icon: Car,
      badge: carRentalStatus === 'PENDING' || carRentalStatus === 'UNDER_REVIEW' ? 'In Review' : undefined,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Select Active Business Vertical"
      className={`inline-flex items-center p-1.5 rounded-2xl bg-slate-100/90 backdrop-blur-md border border-slate-200/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] transition-all select-none w-full sm:w-auto ${className}`}
    >
      {options.map((opt) => {
        const isActive = activeBusiness === opt.id;
        const IconComponent = opt.icon;

        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => switchBusiness(opt.id)}
            className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-xs font-black transition-all cursor-pointer focus:outline-none active:scale-[0.98] ${
              isActive
                ? 'text-[#0F172A]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="businessSegmentedPill"
                className="absolute inset-0 rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-200/60 -z-10"
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}

            <div
              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                isActive
                  ? opt.id === 'car_rental'
                    ? 'bg-gradient-to-br from-[#583BE8] to-[#7B61FF] text-white shadow-xs'
                    : 'bg-[#583BE8] text-white shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
            </div>

            <span className="hidden xs:inline truncate">{opt.label}</span>
            <span className="xs:hidden truncate">{opt.mobileLabel}</span>

            {opt.badge && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700">
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BusinessSegmentedToggle;
