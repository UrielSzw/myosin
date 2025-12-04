import { queryKeys } from "@/shared/queries/query-keys";
import { useQuery } from "@tanstack/react-query";
import {
  TrackerAnalyticsData,
  trackerAnalyticsService,
} from "../service/trackerAnalyticsService";

export const useTrackerAnalytics = (userId?: string) => {
  const query = useQuery<TrackerAnalyticsData>({
    queryKey: queryKeys.analytics.tracker(userId ?? ""),
    queryFn: async () => {
      if (!userId) {
        return {
          topMetrics: [],
          streaks: [],
          weightProgress: {
            hasWeightMetric: false,
            metricId: null,
            currentWeight: null,
            startWeight: null,
            weightChange: null,
            changePercentage: null,
            trend: null,
            dataPoints: [],
          },
          habits: [],
          overallStats: {
            totalMetrics: 0,
            avgDailyEntries: 0,
            bestStreak: 0,
            daysTrackedThisWeek: 0,
          },
        };
      }
      return await trackerAnalyticsService.getTrackerAnalytics(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    data: query.data,
  };
};
