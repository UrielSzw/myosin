import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../service/analyticsService";
import { AnalyticsDashboardData } from "../types/dashboard";
import { sanitizeAnalyticsData } from "../utils/analytics-helpers";

export const ANALYTICS_QUERY_KEY = ["analyticsDashboard"];

export const useAnalyticsData = (userId: string = "default-user") => {
  const query = useQuery<AnalyticsDashboardData>({
    queryKey: [...ANALYTICS_QUERY_KEY, userId],
    queryFn: async () => {
      const rawData = await analyticsService.getDashboardData(userId);
      const sanitizedData = sanitizeAnalyticsData(rawData);

      return sanitizedData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos - analytics no necesitan ser real-time
    gcTime: 1000 * 60 * 10, // 10 minutos en cache
    refetchOnWindowFocus: false, // No refetch automático al focus
    retry: (failureCount) => {
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10s delay
  });

  return {
    ...query,
    data: query.data || sanitizeAnalyticsData(undefined),
  };
};
