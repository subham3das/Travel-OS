import { useState, useEffect } from 'react';
import { Agency } from '../types/agency';
import { agenciesData } from '../data/agencies';

interface UseAgencyResult {
  agency: Agency | null;
  loading: boolean;
  error: string | null;
}

export const useAgency = (agencyId?: string): UseAgencyResult => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate async API endpoint (GET /api/agencies/:agencyId)
    const timer = setTimeout(() => {
      if (!agencyId) {
        setAgency(null);
        setError('No agency ID provided');
        setLoading(false);
        return;
      }

      const normalized = agencyId.toLowerCase().trim();

      const found = agenciesData.find((a) => {
        const idLower = a.id.toLowerCase();
        const nameSlug = a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Match agency-001, agency-1, mountain-trails, etc.
        return (
          idLower === normalized ||
          nameSlug === normalized ||
          idLower.replace('agency-00', 'agency-') === normalized ||
          idLower.replace('agency-0', 'agency-') === normalized ||
          normalized.endsWith(idLower.replace('agency-', ''))
        );
      });

      if (found) {
        setAgency(found);
        setError(null);
      } else {
        setAgency(null);
        setError(`Agency "${agencyId}" not found`);
      }
      setLoading(false);
    }, 80);

    return () => clearTimeout(timer);
  }, [agencyId]);

  return { agency, loading, error };
};
