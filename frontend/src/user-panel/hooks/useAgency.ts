import { useState, useEffect } from 'react';
import { Agency } from '../types/agency';
import { marketplaceService } from '../services/marketplace.service';
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
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (!agencyId) {
      setAgency(null);
      setError('No agency ID provided');
      setLoading(false);
      return;
    }

    marketplaceService
      .getAgencyById(agencyId)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setAgency(data);
          setError(null);
        } else {
          // Fallback if legacy demo ID
          const normalized = agencyId.toLowerCase().trim();
          const fallback = agenciesData.find((a) => a.id.toLowerCase() === normalized);
          if (fallback) {
            setAgency(fallback);
            setError(null);
          } else {
            setAgency(null);
            setError(`Agency "${agencyId}" not found`);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const normalized = agencyId.toLowerCase().trim();
        const fallback = agenciesData.find((a) => a.id.toLowerCase() === normalized);
        if (fallback) {
          setAgency(fallback);
          setError(null);
        } else {
          setAgency(null);
          setError(err?.message || `Agency "${agencyId}" not found`);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [agencyId]);

  return { agency, loading, error };
};
