import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse } from '../types';
import { apiCache } from '../utils/api';

export function useApi<T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[] = []
): ApiResponse<T | null> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = apiCache.get<T>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // If no cache, fetch from API
      const result = await apiCall();
      apiCache.set(cacheKey, result);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error(`Error fetching ${cacheKey}:`, err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);


  return {
    data,
    loading,
    error
  };
}