import { useState, useEffect } from 'react';
import { Agency } from '../types/agency';
import { marketplaceService } from '../services/marketplace.service';

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
          setAgency(null);
          setError(`Agency "${agencyId}" not found`);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setAgency(null);
        setError(err?.message || `Failed to load agency "${agencyId}"`);
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
