import React from 'react';
import { VerificationCheckitem } from '../../../types/agencyRequest';

interface VerificationChecklistProps {
  checklist: VerificationCheckitem[];
}

export const VerificationChecklist: React.FC<VerificationChecklistProps> = ({ checklist }) => {
  const defaultChecklist: VerificationCheckitem[] = [
    { id: '1', label: 'GST Verification', status: 'Verified' },
    { id: '2', label: 'PAN Verification', status: 'Verified' },
    { id: '3', label: 'Business License', status: 'Verified' },
    { id: '4', label: 'Bank Verification', status: 'Under Review' },
    { id: '5', label: 'KYC Verification', status: 'Verified' },
    { id: '6', label: 'Office Address', status: 'Pending' },
  ];

  const items = checklist && checklist.length > 0 ? checklist : defaultChecklist;

  const getBadgeStyle = (status: VerificationCheckitem['status']) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Under Review':
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Missing':
      default:
        return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Verification Checklist
      </h4>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-bold">{item.label}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border whitespace-nowrap ${getBadgeStyle(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
