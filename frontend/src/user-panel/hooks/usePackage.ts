import { useState, useEffect } from 'react';
import { TourPackage } from '../types/package';
import { packagesData, getPackageById } from '../data/packages';

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
    setLoading(true);
    setError(null);

    // Simulate async API fetch (GET /api/packages/:packageId)
    const timer = setTimeout(() => {
      if (!packageId) {
        setPkg(null);
        setError('No package ID provided');
        setLoading(false);
        return;
      }

      const found = getPackageById(packageId) || packagesData.find((p) => p.id === packageId);

      if (found) {
        setPkg(found);
        setError(null);
      } else {
        setPkg(null);
        setError(`Package "${packageId}" not found`);
      }
      setLoading(false);
    }, 80);

    return () => clearTimeout(timer);
  }, [packageId]);

  return { pkg, loading, error };
};
