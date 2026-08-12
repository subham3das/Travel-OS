import React from 'react';
import { Agency } from '../../../types/agency';
import { VerificationBadge } from './VerificationBadge';

interface AgencyVerificationCardProps {
  agency: Agency;
}

export const AgencyVerificationCard: React.FC<AgencyVerificationCardProps> = ({ agency }) => {
  const verifications = agency.verificationDetails || {
    kyc: 'Verified',
    gst: 'Verified',
    businessLicense: 'Verified',
    bankVerification: 'Under Review',
  };

  const items = [
    { label: 'KYC Verification', status: verifications.kyc },
    { label: 'GST Verification', status: verifications.gst },
    { label: 'Business License', status: verifications.businessLicense },
    { label: 'Bank Verification', status: verifications.bankVerification },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Verification Status
      </h4>

      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-bold">{item.label}</span>
            <VerificationBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
};
