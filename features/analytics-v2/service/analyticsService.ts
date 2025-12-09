import { prRepository } from "@/shared/db/repository/pr";
import { workoutSessionsRepository } from "@/shared/db/repository/workout-sessions";
import { VolumeCalculator } from "@/shared/utils/volume-calculator";
import {
  AnalyticsDashboardData,
  AnalyticsPRData,
  AnalyticsSessionData,
} from "../types/dashboard";

export const analyticsService = {
  getDashboardData: async (
    userId: string = "default-user"
  ): Promise<AnalyticsDashboardData> => {
    try {
      // Fetch todos los datos en paralelo para mejor performance
      const [activeRoutines, weeklyVolume, topPRsRaw, recentSessionsRaw] =
        await Promise.all([
          VolumeCalculator.getActiveRoutines(userId),
          VolumeCalculator.calculateWeeklyVolume(userId),
          prRepository.getTopPRs(userId, 4),
          workoutSessionsRepository.getRecentSessions(4),
        ]);

      // Procesar PRs para incluir nombres de ejercicios
      const topPRs: AnalyticsPRData[] = topPRsRaw.map((pr) => ({
        id: pr.id,
        exercise_id: pr.exercise_id,
        exercise_name: pr.exercise_name,
        exercise_muscle: pr.exercise_muscle,
        measurement_template: pr.measurement_template,
        best_primary_value: pr.best_primary_value,
        best_secondary_value: pr.best_secondary_value,
        pr_score: pr.pr_score,
        achieved_at: pr.achieved_at,
        source: pr.source,
      }));

      // Procesar sesiones recientes
      const recentSessions: AnalyticsSessionData[] = recentSessionsRaw.map(
        (session) => ({
          id: session.id,
          started_at: session.started_at,
          total_duration_seconds: session.total_duration_seconds,
          total_sets_completed: session.total_sets_completed,
          total_sets_planned: session.total_sets_planned,
          routine_name: session.routine_name,
        })
      );

      const result: AnalyticsDashboardData = {
        activeRoutines,
        weeklyVolume,
        topPRs,
        recentSessions,
      };

      return result;
    } catch (error) {
      console.error("[AnalyticsService] Error fetching dashboard data:", error);

      return {
        activeRoutines: [],
        weeklyVolume: {
          chest: { totalSets: 0, frequency: 0, routineNames: [] },
          back: { totalSets: 0, frequency: 0, routineNames: [] },
          shoulders: { totalSets: 0, frequency: 0, routineNames: [] },
          arms: { totalSets: 0, frequency: 0, routineNames: [] },
          legs: { totalSets: 0, frequency: 0, routineNames: [] },
          core: { totalSets: 0, frequency: 0, routineNames: [] },
          other: { totalSets: 0, frequency: 0, routineNames: [] },
        },
        topPRs: [],
        recentSessions: [],
      };
    }
  },
};

export default analyticsService;
