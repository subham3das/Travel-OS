import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * Agency Details Page (Placeholder)
 * Route: /admin/agencies/:agencyId
 */
export const AdminAgencyDetailsPage: React.FC = () => {
  const { agencyId } = useParams<{ agencyId: string }>();

  return (
    <div className="p-6 space-y-4 font-sans">
      <h1 className="text-2xl font-black text-slate-900">Agency Details</h1>
      <p className="text-xs text-slate-500 font-medium">Viewing agency ID: {agencyId}</p>
    </div>
  );
};

export default AdminAgencyDetailsPage;
