import { useState, useCallback } from 'react';

export function useRetry<T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const result = await asyncFn();
        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        attempts += 1;
        if (attempts >= maxRetries) {
          setError(err);
          setLoading(false);
          throw err;
        }
        await new Promise((res) => setTimeout(res, delayMs * attempts));
      }
    }
  }, [asyncFn, maxRetries, delayMs]);

  return {
    execute,
    loading,
    error,
    data,
  };
}

export default useRetry;
