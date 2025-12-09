import { RoutineFull } from "@/shared/db/schema";
import { WeeklyVolumeMap } from "@/shared/utils/volume-calculator";

export type AnalyticsPRData = {
  id: string;
  exercise_id: string;
  exercise_name: string;
  exercise_muscle: string;
  measurement_template: string;
  best_primary_value: number;
  best_secondary_value: number | null;
  pr_score: number;
  achieved_at: string;
  source: "auto" | "manual";
};

export type AnalyticsSessionData = {
  id: string;
  started_at: string;
  total_duration_seconds: number;
  total_sets_completed: number;
  total_sets_planned: number;
  routine_name: string;
};

export type AnalyticsDashboardData = {
  activeRoutines: RoutineFull[];
  weeklyVolume: WeeklyVolumeMap;
  topPRs: AnalyticsPRData[];
  recentSessions: AnalyticsSessionData[];
};
