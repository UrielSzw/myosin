import type { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { queryKeys } from "@/shared/queries/query-keys";
import { useQuery } from "@tanstack/react-query";
import { routinesService } from "../service/routines";

export const useFolderDetailData = (folderId: string) => {
  const {
    data: routines = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: queryKeys.workouts.routines.list(folderId),
    queryFn: () => routinesService.findAllWithMetrics(folderId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  return {
    routines: routines as RoutineWithMetrics[],
    loading,
    error: error as Error | null,
    count: routines.length,
  };
};
