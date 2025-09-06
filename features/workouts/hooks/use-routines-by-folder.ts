import type { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useCallback, useEffect, useState } from "react";
import { routinesService } from "../service/routines";

export const useRoutinesByFolder = (folderId: string | null) => {
  const [routines, setRoutines] = useState<RoutineWithMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoutines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await routinesService.findAllWithMetrics(folderId);
      setRoutines(data);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    let mounted = true;

    const runFetch = async () => {
      if (mounted) {
        await fetchRoutines();
      }
    };

    runFetch();

    return () => {
      mounted = false;
    };
  }, [fetchRoutines]);

  return {
    routines,
    count: routines.length,
    loading,
    error,
    refetch: fetchRoutines,
  };
};
