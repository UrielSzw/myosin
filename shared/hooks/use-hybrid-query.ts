import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNetwork } from "./use-network";

interface HybridQueryOptions<TLocal, TCloud = TLocal> {
  /** Unique cache key for this hybrid query */
  cacheKey: (string | number)[];

  /** Local query function - should be fast and return immediately available data */
  localQuery: () => Promise<TLocal[]>;

  /** Cloud query function - receives local data to determine what to fetch */
  cloudQuery: (localData: TLocal[]) => Promise<TCloud[]>;

  /** Strategy to merge local and cloud data */
  mergeStrategy: (local: TLocal[], cloud: TCloud[]) => (TLocal | TCloud)[];

  /** Options for local query */
  localOptions?: {
    staleTime?: number;
    enabled?: boolean;
  };

  /** Options for cloud query */
  cloudOptions?: {
    staleTime?: number;
    enabled?: boolean;
    /** Minimum local items required before fetching cloud data */
    minLocalItems?: number;
  };
}

interface HybridQueryResult<T> {
  /** Merged data from local and cloud sources */
  data: T[];

  /** True if initial local data is loading */
  isLoading: boolean;

  /** True if cloud data is being fetched (progressive enhancement) */
  isEnhancing: boolean;

  /** True if there was an error fetching local data */
  hasLocalError: boolean;

  /** True if there was an error fetching cloud data */
  hasCloudError: boolean;

  /** Number of items from local source */
  localCount: number;

  /** Total number of items after merge */
  totalCount: number;

  /** True if cloud data has been successfully fetched at least once */
  hasCloudData: boolean;

  /** Refresh function for both local and cloud data */
  refresh: () => void;

  /** Force refresh cloud data only */
  refreshCloud: () => void;
}

/**
 * Hook for hybrid local-first + cloud extension queries
 *
 * Pattern:
 * 1. Shows local data immediately
 * 2. Progressively enhances with cloud data (only if online)
 * 3. Handles offline/online states gracefully
 * 4. Provides granular loading states
 *
 * @example
 * ```ts
 * const { data, isEnhancing, localCount, totalCount } = useHybridQuery({
 *   cacheKey: ['personal-records'],
 *   localQuery: () => db.select().from(personalRecords).where(recent),
 *   cloudQuery: (local) => supabase.rpc('get_pr_history', { ... }),
 *   mergeStrategy: (local, cloud) => [...local, ...cloud].sort(...)
 * });
 * ```
 */
export const useHybridQuery = <TLocal = any, TCloud = TLocal>({
  cacheKey,
  localQuery,
  cloudQuery,
  mergeStrategy,
  localOptions = {},
  cloudOptions = {},
}: HybridQueryOptions<TLocal, TCloud>): HybridQueryResult<TLocal | TCloud> => {
  // Check network status - no cloud calls if offline
  const isOnline = useNetwork();

  // Local query - always enabled, fast response
  const localQueryResult = useQuery({
    queryKey: [...cacheKey, "local"],
    queryFn: localQuery,
    staleTime: localOptions.staleTime ?? 0, // Local data should always be fresh
    enabled: localOptions.enabled ?? true,
    retry: 1, // Quick retry for local queries
  });

  // Cloud query - only when local data is available, conditions are met, AND online
  const shouldFetchCloud = useMemo(() => {
    const hasLocalData = !!localQueryResult.data;
    const meetsMinimum =
      (localQueryResult.data?.length ?? 0) >= (cloudOptions.minLocalItems ?? 0);
    const isEnabled = cloudOptions.enabled ?? true;

    return hasLocalData && meetsMinimum && isEnabled && isOnline;
  }, [
    localQueryResult.data,
    cloudOptions.minLocalItems,
    cloudOptions.enabled,
    isOnline,
  ]);

  const cloudQueryResult = useQuery({
    queryKey: [...cacheKey, "cloud", localQueryResult.dataUpdatedAt],
    queryFn: () => cloudQuery(localQueryResult.data || []),
    staleTime: cloudOptions.staleTime ?? 5 * 60 * 1000, // 5 min default for cloud
    enabled: shouldFetchCloud,
    retry: 3, // More retries for cloud queries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Merged result
  const mergedData = useMemo(() => {
    const localData = localQueryResult.data || [];
    const cloudData = cloudQueryResult.data || [];

    if (!localData.length && !cloudData.length) return [];
    if (!cloudData.length) return localData;

    return mergeStrategy(localData, cloudData);
  }, [localQueryResult.data, cloudQueryResult.data, mergeStrategy]);

  // Refresh functions
  const refresh = () => {
    localQueryResult.refetch();
    if (shouldFetchCloud) {
      cloudQueryResult.refetch();
    }
  };

  const refreshCloud = () => {
    if (shouldFetchCloud) {
      cloudQueryResult.refetch();
    }
  };

  return {
    data: mergedData,
    isLoading: localQueryResult.isLoading,
    isEnhancing: cloudQueryResult.isLoading && !!localQueryResult.data,
    hasLocalError: !!localQueryResult.error,
    hasCloudError: !!cloudQueryResult.error,
    localCount: localQueryResult.data?.length || 0,
    totalCount: mergedData.length,
    hasCloudData: !!cloudQueryResult.data,
    refresh,
    refreshCloud,
  };
};

export default useHybridQuery;
