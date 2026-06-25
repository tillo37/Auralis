'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/api';

export interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // deps are passed by caller — intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error };
}
