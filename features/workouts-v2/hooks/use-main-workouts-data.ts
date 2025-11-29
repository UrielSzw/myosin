import { FolderWithMetrics } from "@/shared/db/repository/folders";
import type { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useQuery } from "@tanstack/react-query";
import { routinesService } from "../service/routines";

export const useMainWorkoutsData = () => {
  const {
    data: routines = [],
    isLoading: routinesLoading,
    error: routinesError,
  } = useQuery({
    queryKey: ["workouts", "routines"],
    queryFn: () => routinesService.findAllWithMetrics(null),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  const { data: routinesCount = 0 } = useQuery({
    queryKey: ["workouts", "routines", "count"],
    queryFn: () => routinesService.getAllRoutinesCount(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  const {
    data: folders = [],
    isLoading: foldersLoading,
    error: foldersError,
  } = useQuery({
    queryKey: ["workouts", "folders"],
    queryFn: () => routinesService.getAllFoldersWithMetrics(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  // Estados derivados
  const loading = routinesLoading || foldersLoading;
  const error = routinesError || foldersError;

  return {
    routines: routines as RoutineWithMetrics[],
    folders: folders as FolderWithMetrics[],
    loading,
    error: error as Error | null,
    count: routinesCount,
  };
};
