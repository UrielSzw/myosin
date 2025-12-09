import { prRepository } from "@/shared/db/repository/pr";
import { useQuery } from "@tanstack/react-query";
import { MUSCLE_CATEGORY_MAP, PRListItem, PRListStats } from "../types/pr-list";

export const PR_LIST_QUERY_KEY = ["prList"];

export const usePRList = (userId?: string) => {
  const query = useQuery<PRListItem[]>({
    queryKey: [...PR_LIST_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return [];

      const rawPRs = await prRepository.getAllCurrentPRsWithExerciseInfo(
        userId
      );

      // Transform data to include calculated fields
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const transformedPRs: PRListItem[] = rawPRs.map((pr) => ({
        id: pr.id,
        user_id: pr.user_id,
        exercise_id: pr.exercise_id,
        exercise_name: pr.exercise_name,
        exercise_muscle: pr.exercise_muscle,
        measurement_template: pr.measurement_template,
        best_primary_value: pr.best_primary_value,
        best_secondary_value: pr.best_secondary_value,
        pr_score: pr.pr_score,
        achieved_at: pr.achieved_at,
        source: pr.source,
        created_at: pr.created_at || new Date().toISOString(),
        updated_at: pr.updated_at || new Date().toISOString(),
        // Calculated fields
        is_recent: new Date(pr.achieved_at).getTime() > oneWeekAgo,
        exercise_muscle_category: MUSCLE_CATEGORY_MAP[pr.exercise_muscle],
      }));

      return transformedPRs;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutos - PRs no cambian tan frecuentemente
    gcTime: 1000 * 60 * 5, // 5 minutos en cache
    refetchOnWindowFocus: false,
    retry: (failureCount) => failureCount < 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Calculate stats from the data
  const stats: PRListStats = {
    totalPRs: query.data?.length || 0,
    recentPRs: query.data?.filter((pr) => pr.is_recent).length || 0,
    avgEstimated1RM: query.data?.length
      ? query.data.reduce((sum, pr) => sum + pr.pr_score, 0) / query.data.length
      : 0,
    strongestLift: query.data?.length
      ? query.data.reduce((max, pr) => (pr.pr_score > max.pr_score ? pr : max))
      : null,
  };

  return {
    ...query,
    data: query.data || [],
    stats,
  };
};

// Hook para búsqueda específica
export const usePRSearch = (
  userId: string = "default-user",
  searchQuery: string
) => {
  return useQuery<PRListItem[]>({
    queryKey: [...PR_LIST_QUERY_KEY, "search", userId, searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return [];
      }

      const rawPRs = await prRepository.searchPRsByName(userId, searchQuery);

      // Transform data similar to usePRList
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const transformedPRs: PRListItem[] = rawPRs.map((pr) => ({
        id: pr.id,
        user_id: pr.user_id,
        exercise_id: pr.exercise_id,
        exercise_name: pr.exercise_name,
        exercise_muscle: pr.exercise_muscle,
        measurement_template: pr.measurement_template,
        best_primary_value: pr.best_primary_value,
        best_secondary_value: pr.best_secondary_value,
        pr_score: pr.pr_score,
        achieved_at: pr.achieved_at,
        source: pr.source,
        created_at: pr.created_at || new Date().toISOString(),
        updated_at: pr.updated_at || new Date().toISOString(),
        is_recent: new Date(pr.achieved_at).getTime() > oneWeekAgo,
        exercise_muscle_category: MUSCLE_CATEGORY_MAP[pr.exercise_muscle],
      }));

      return transformedPRs;
    },
    enabled: !!searchQuery.trim(),
    staleTime: 1000 * 60 * 1, // 1 minuto para búsquedas
    gcTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

// Hook para filtros por muscle groups
export const usePRByMuscleGroups = (
  userId: string = "default-user",
  muscleGroups: string[]
) => {
  return useQuery<PRListItem[]>({
    queryKey: [...PR_LIST_QUERY_KEY, "muscle-filter", userId, muscleGroups],
    queryFn: async () => {
      if (muscleGroups.length === 0) {
        return [];
      }

      const rawPRs = await prRepository.filterPRsByMuscleGroups(
        userId,
        muscleGroups
      );

      // Transform data
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const transformedPRs: PRListItem[] = rawPRs.map((pr) => ({
        id: pr.id,
        user_id: pr.user_id,
        exercise_id: pr.exercise_id,
        exercise_name: pr.exercise_name,
        exercise_muscle: pr.exercise_muscle,
        measurement_template: pr.measurement_template,
        best_primary_value: pr.best_primary_value,
        best_secondary_value: pr.best_secondary_value,
        pr_score: pr.pr_score,
        achieved_at: pr.achieved_at,
        source: pr.source,
        created_at: pr.created_at || new Date().toISOString(),
        updated_at: pr.updated_at || new Date().toISOString(),
        is_recent: new Date(pr.achieved_at).getTime() > oneWeekAgo,
        exercise_muscle_category: MUSCLE_CATEGORY_MAP[pr.exercise_muscle],
      }));

      return transformedPRs;
    },
    enabled: muscleGroups.length > 0,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
