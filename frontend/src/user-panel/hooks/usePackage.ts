import { useState, useEffect } from 'react';
import { TourPackage } from '../types/package';
import { marketplaceService } from '../services/marketplace.service';

interface UsePackageResult {
  pkg: TourPackage | null;
  loading: boolean;
  error: string | null;
}

export const usePackage = (packageId?: string): UsePackageResult => {
  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (!packageId) {
      setPkg(null);
      setError('No package ID provided');
      setLoading(false);
      return;
    }

    marketplaceService
      .getPackageById(packageId)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setPkg(data);
          setError(null);
        } else {
          setPkg(null);
          setError(`Package "${packageId}" not found`);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setPkg(null);
        setError(err?.message || `Package "${packageId}" not found`);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [packageId]);

  return { pkg, loading, error };
};
