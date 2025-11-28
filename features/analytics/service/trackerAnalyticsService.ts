import { trackerRepository } from "@/shared/db/repository/tracker";
import {
  BaseTrackerDailyAggregate,
  BaseTrackerMetric,
} from "@/shared/db/schema/tracker";
import { getDayKeyLocal } from "@/shared/utils/timezone";

export type TrackerMetricSummary = {
  metric: BaseTrackerMetric;
  currentValue: number;
  avgLast7Days: number;
  avgPrevious7Days: number;
  trendPercentage: number;
  trend: "up" | "down" | "stable";
  targetProgress: number | null; // percentage of target reached today
  streak: number; // consecutive days with entries
  daysTracked: number; // days with data in last 7
};

export type TrackerStreak = {
  metricId: string;
  metricName: string;
  metricIcon: string;
  metricColor: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // % of days target was met (last 30 days)
  lastEntryDate: string | null;
};

export type WeightProgressData = {
  hasWeightMetric: boolean;
  metricId: string | null;
  currentWeight: number | null;
  startWeight: number | null;
  weightChange: number | null;
  changePercentage: number | null;
  trend: "loss" | "gain" | "stable" | null;
  dataPoints: { date: string; value: number }[];
};

export type HabitCompletion = {
  metricId: string;
  metricName: string;
  metricIcon: string;
  metricColor: string;
  weekData: { dayKey: string; completed: boolean }[];
  completionRate: number; // % this week
};

export type TrackerAnalyticsData = {
  topMetrics: TrackerMetricSummary[];
  streaks: TrackerStreak[];
  weightProgress: WeightProgressData;
  habits: HabitCompletion[];
  overallStats: {
    totalMetrics: number;
    avgDailyEntries: number;
    bestStreak: number;
    daysTrackedThisWeek: number;
  };
};

export const trackerAnalyticsService = {
  /**
   * Get complete tracker analytics data
   */
  getTrackerAnalytics: async (
    userId: string
  ): Promise<TrackerAnalyticsData> => {
    if (!userId) {
      return getEmptyAnalyticsData();
    }

    try {
      const [topMetrics, streaks, weightProgress, habits, overallStats] =
        await Promise.all([
          trackerAnalyticsService.getTopMetricsSummary(userId),
          trackerAnalyticsService.getStreaksData(userId),
          trackerAnalyticsService.getWeightProgress(userId),
          trackerAnalyticsService.getHabitsCompletion(userId),
          trackerAnalyticsService.getOverallStats(userId),
        ]);

      return {
        topMetrics,
        streaks,
        weightProgress,
        habits,
        overallStats,
      };
    } catch (error) {
      console.error("[TrackerAnalyticsService] Error:", error);
      return getEmptyAnalyticsData();
    }
  },

  /**
   * Get top 3 most used metrics with trends
   */
  getTopMetricsSummary: async (
    userId: string
  ): Promise<TrackerMetricSummary[]> => {
    const metrics = await trackerRepository.getActiveMetricsWithQuickActions(
      userId
    );

    if (metrics.length === 0) return [];

    const today = getDayKeyLocal();
    const dates = generateDateRange(14); // Last 14 days for trend calculation

    // Get aggregates for all metrics
    const summaries: TrackerMetricSummary[] = [];

    for (const metric of metrics) {
      const aggregates = await trackerRepository.getDailyAggregatesRange(
        userId,
        metric.id,
        dates[dates.length - 1],
        dates[0]
      );

      const last7Days = dates.slice(0, 7);
      const previous7Days = dates.slice(7, 14);

      const last7Aggregates = aggregates.filter((a) =>
        last7Days.includes(a.day_key)
      );
      const previous7Aggregates = aggregates.filter((a) =>
        previous7Days.includes(a.day_key)
      );

      const avgLast7 = calculateAverage(last7Aggregates);
      const avgPrevious7 = calculateAverage(previous7Aggregates);

      const trendPercentage =
        avgPrevious7 > 0
          ? Math.round(((avgLast7 - avgPrevious7) / avgPrevious7) * 100)
          : 0;

      const trend: "up" | "down" | "stable" =
        trendPercentage > 5 ? "up" : trendPercentage < -5 ? "down" : "stable";

      // Today's value
      const todayAggregate = aggregates.find((a) => a.day_key === today);
      const currentValue = todayAggregate?.sum_normalized || 0;

      // Target progress
      const targetProgress =
        metric.default_target && metric.default_target > 0
          ? Math.round((currentValue / metric.default_target) * 100)
          : null;

      // Calculate streak
      const streak = calculateStreak(aggregates, dates.slice(0, 7));

      summaries.push({
        metric,
        currentValue,
        avgLast7Days: avgLast7,
        avgPrevious7Days: avgPrevious7,
        trendPercentage,
        trend,
        targetProgress,
        streak,
        daysTracked: last7Aggregates.filter((a) => a.count > 0).length,
      });
    }

    // Sort by days tracked (most used first), take top 3
    return summaries.sort((a, b) => b.daysTracked - a.daysTracked).slice(0, 3);
  },

  /**
   * Get streaks data for all metrics
   */
  getStreaksData: async (userId: string): Promise<TrackerStreak[]> => {
    const metrics = await trackerRepository.getActiveMetricsWithQuickActions(
      userId
    );

    if (metrics.length === 0) return [];

    const dates = generateDateRange(30);
    const streaks: TrackerStreak[] = [];

    for (const metric of metrics) {
      const aggregates = await trackerRepository.getDailyAggregatesRange(
        userId,
        metric.id,
        dates[dates.length - 1],
        dates[0]
      );

      const currentStreak = calculateStreak(aggregates, dates);
      const longestStreak = calculateLongestStreak(aggregates, dates);

      // Count days with actual entries (not dividing by 30 fixed)
      const daysWithEntries = aggregates.filter((a) => a.count > 0).length;
      // Calculate completion rate only based on days that have passed since first entry
      const completionRate =
        daysWithEntries > 0
          ? Math.round((currentStreak / Math.max(currentStreak, 7)) * 100)
          : 0;

      const lastEntry = aggregates.find((a) => a.count > 0);

      streaks.push({
        metricId: metric.id,
        metricName: metric.name,
        metricIcon: metric.icon,
        metricColor: metric.color,
        currentStreak,
        longestStreak,
        completionRate,
        lastEntryDate: lastEntry?.day_key || null,
      });
    }

    // Sort by current streak descending
    return streaks.sort((a, b) => b.currentStreak - a.currentStreak);
  },

  /**
   * Get weight progress data (if user tracks weight)
   */
  getWeightProgress: async (userId: string): Promise<WeightProgressData> => {
    const metrics = await trackerRepository.getActiveMetricsWithQuickActions(
      userId
    );

    // Find weight metric
    const weightMetric = metrics.find(
      (m) => m.slug === "weight" || m.name.toLowerCase().includes("peso")
    );

    if (!weightMetric) {
      return {
        hasWeightMetric: false,
        metricId: null,
        currentWeight: null,
        startWeight: null,
        weightChange: null,
        changePercentage: null,
        trend: null,
        dataPoints: [],
      };
    }

    const dates = generateDateRange(30);
    const aggregates = await trackerRepository.getDailyAggregatesRange(
      userId,
      weightMetric.id,
      dates[dates.length - 1],
      dates[0]
    );

    // For weight, we use the latest value of each day (not sum)
    const dataPoints = aggregates
      .filter((a) => a.count > 0 && a.max_normalized !== null)
      .map((a) => ({
        date: a.day_key,
        value: a.max_normalized || a.sum_normalized,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (dataPoints.length === 0) {
      return {
        hasWeightMetric: true,
        metricId: weightMetric.id,
        currentWeight: null,
        startWeight: null,
        weightChange: null,
        changePercentage: null,
        trend: null,
        dataPoints: [],
      };
    }

    const currentWeight = dataPoints[dataPoints.length - 1].value;
    const startWeight = dataPoints[0].value;
    const weightChange = Math.round((currentWeight - startWeight) * 10) / 10;
    const changePercentage =
      startWeight > 0
        ? Math.round((weightChange / startWeight) * 1000) / 10
        : 0;

    const trend: "loss" | "gain" | "stable" =
      weightChange < -0.5 ? "loss" : weightChange > 0.5 ? "gain" : "stable";

    return {
      hasWeightMetric: true,
      metricId: weightMetric.id,
      currentWeight,
      startWeight,
      weightChange,
      changePercentage,
      trend,
      dataPoints,
    };
  },

  /**
   * Get habits (boolean_toggle metrics) completion data
   */
  getHabitsCompletion: async (userId: string): Promise<HabitCompletion[]> => {
    const metrics = await trackerRepository.getActiveMetricsWithQuickActions(
      userId
    );

    // Filter boolean_toggle metrics
    const habitMetrics = metrics.filter(
      (m) => m.input_type === "boolean_toggle"
    );

    if (habitMetrics.length === 0) return [];

    const weekDates = generateDateRange(7);
    const habits: HabitCompletion[] = [];

    for (const metric of habitMetrics) {
      const aggregates = await trackerRepository.getDailyAggregatesRange(
        userId,
        metric.id,
        weekDates[weekDates.length - 1],
        weekDates[0]
      );

      const weekData = weekDates.map((dayKey) => {
        const dayAggregate = aggregates.find((a) => a.day_key === dayKey);
        return {
          dayKey,
          completed: dayAggregate ? dayAggregate.sum_normalized > 0 : false,
        };
      });

      const completedDays = weekData.filter((d) => d.completed).length;
      const completionRate = Math.round((completedDays / 7) * 100);

      habits.push({
        metricId: metric.id,
        metricName: metric.name,
        metricIcon: metric.icon,
        metricColor: metric.color,
        weekData: weekData.reverse(), // oldest first for display
        completionRate,
      });
    }

    return habits;
  },

  /**
   * Get overall tracker stats
   */
  getOverallStats: async (userId: string) => {
    const metrics = await trackerRepository.getActiveMetricsWithQuickActions(
      userId
    );
    const weekDates = generateDateRange(7);

    let totalEntries = 0;
    let bestStreak = 0;
    const daysWithEntries = new Set<string>();

    for (const metric of metrics) {
      const aggregates = await trackerRepository.getDailyAggregatesRange(
        userId,
        metric.id,
        weekDates[weekDates.length - 1],
        weekDates[0]
      );

      aggregates.forEach((a) => {
        totalEntries += a.count;
        if (a.count > 0) {
          daysWithEntries.add(a.day_key);
        }
      });

      const streak = calculateStreak(aggregates, weekDates);
      if (streak > bestStreak) bestStreak = streak;
    }

    return {
      totalMetrics: metrics.length,
      avgDailyEntries: metrics.length > 0 ? Math.round(totalEntries / 7) : 0,
      bestStreak,
      daysTrackedThisWeek: daysWithEntries.size,
    };
  },
};

// Helper functions
function generateDateRange(days: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(getDayKeyLocal(date));
  }
  return dates; // Most recent first
}

function calculateAverage(aggregates: BaseTrackerDailyAggregate[]): number {
  if (aggregates.length === 0) return 0;
  const sum = aggregates.reduce((acc, a) => acc + a.sum_normalized, 0);
  return Math.round((sum / aggregates.length) * 10) / 10;
}

function calculateStreak(
  aggregates: BaseTrackerDailyAggregate[],
  dates: string[]
): number {
  let streak = 0;
  for (const date of dates) {
    const dayAggregate = aggregates.find((a) => a.day_key === date);
    if (dayAggregate && dayAggregate.count > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateLongestStreak(
  aggregates: BaseTrackerDailyAggregate[],
  dates: string[]
): number {
  let longestStreak = 0;
  let currentStreak = 0;

  // Sort dates ascending for proper streak calculation
  const sortedDates = [...dates].sort();

  for (const date of sortedDates) {
    const dayAggregate = aggregates.find((a) => a.day_key === date);
    if (dayAggregate && dayAggregate.count > 0) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return longestStreak;
}

function getEmptyAnalyticsData(): TrackerAnalyticsData {
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

export default trackerAnalyticsService;
