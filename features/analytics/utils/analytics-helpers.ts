import { AnalyticsDashboardData } from "../types/dashboard";

/**
 * Crea datos por defecto seguros para cuando no hay datos disponibles
 */
export const createEmptyAnalyticsData = (): AnalyticsDashboardData => ({
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
});

/**
 * Valida y sanitiza los datos de analytics para evitar crashes
 */
export const sanitizeAnalyticsData = (
  data: Partial<AnalyticsDashboardData> | undefined
): AnalyticsDashboardData => {
  const fallback = createEmptyAnalyticsData();

  if (!data) return fallback;

  return {
    activeRoutines: Array.isArray(data.activeRoutines)
      ? data.activeRoutines
      : fallback.activeRoutines,
    weeklyVolume:
      data.weeklyVolume && typeof data.weeklyVolume === "object"
        ? { ...fallback.weeklyVolume, ...data.weeklyVolume }
        : fallback.weeklyVolume,
    topPRs: Array.isArray(data.topPRs) ? data.topPRs : fallback.topPRs,
    recentSessions: Array.isArray(data.recentSessions)
      ? data.recentSessions
      : fallback.recentSessions,
  };
};

/**
 * Formatea fechas de manera consistente para la UI
 */
export const formatAnalyticsDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Fecha inválida";
  }
};

/**
 * Calcula estadísticas rápidas para mostrar en headers
 */
export const calculateQuickStats = (data: AnalyticsDashboardData) => {
  const totalActiveRoutines = data.activeRoutines.length;
  const totalActiveDays = new Set(
    data.activeRoutines.flatMap((r) => r.training_days || [])
  ).size;

  const totalWeeklyVolume = Object.values(data.weeklyVolume).reduce(
    (sum, muscle) => sum + muscle.totalSets,
    0
  );

  const recentPRsCount = data.topPRs.filter((pr) => {
    const prDate = new Date(pr.achieved_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return prDate > weekAgo;
  }).length;

  const avgSessionCompletion =
    data.recentSessions.length > 0
      ? Math.round(
          (data.recentSessions.reduce(
            (sum, session) =>
              sum + session.total_sets_completed / session.total_sets_planned,
            0
          ) /
            data.recentSessions.length) *
            100
        )
      : 0;

  return {
    totalActiveRoutines,
    totalActiveDays,
    totalWeeklyVolume,
    recentPRsCount,
    avgSessionCompletion,
  };
};
