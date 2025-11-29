import { workoutSessionsRepository } from "@/shared/db/repository/workout-sessions";
import { useQuery } from "@tanstack/react-query";
import { SessionListItem, SessionListStats } from "../types/session-list";

export const SESSION_LIST_QUERY_KEY = ["sessionList"];

// Helper functions
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      return "Hace unos minutos";
    }
    return `Hace ${diffHours}h`;
  } else if (diffDays === 1) {
    return "Ayer";
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else {
    return date.toLocaleDateString();
  }
};

export const useSessionList = (userId: string = "default-user") => {
  const query = useQuery<SessionListItem[]>({
    queryKey: [...SESSION_LIST_QUERY_KEY, userId],
    queryFn: async () => {
      const rawSessions = await workoutSessionsRepository.findAllWithSummary(
        100
      );

      // Transform data to include calculated fields
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

      const transformedSessions: SessionListItem[] = rawSessions.map(
        (session) => ({
          id: session.id,
          started_at: session.started_at,
          total_duration_seconds: session.total_duration_seconds,
          total_sets_completed: session.total_sets_completed,
          total_sets_planned: session.total_sets_planned,
          routine_name: session.routine.name,
          // Calculated fields
          is_recent: new Date(session.started_at).getTime() > oneWeekAgo,
          completion_rate: Math.round(
            (session.total_sets_completed / session.total_sets_planned) * 100
          ),
          formatted_duration: formatDuration(session.total_duration_seconds),
          time_ago: getTimeAgo(session.started_at),
        })
      );

      return transformedSessions;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos en cache
    refetchOnWindowFocus: false,
    retry: (failureCount) => failureCount < 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Calculate stats from the data
  const stats: SessionListStats = {
    totalSessions: query.data?.length || 0,
    recentSessions:
      query.data?.filter((session) => session.is_recent).length || 0,
    avgCompletionRate: query.data?.length
      ? Math.round(
          query.data.reduce(
            (sum, session) => sum + session.completion_rate,
            0
          ) / query.data.length
        )
      : 0,
    totalDurationHours: query.data?.length
      ? Math.round(
          query.data.reduce(
            (sum, session) => sum + session.total_duration_seconds,
            0
          ) / 3600
        )
      : 0,
  };

  return {
    ...query,
    data: query.data || [],
    stats,
  };
};
