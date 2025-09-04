import type { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useEffect, useState } from "react";
import { routinesService } from "../service/routines";

export const useRoutinesByFolder = (folderId: string | null) => {
  const [routines, setRoutines] = useState<RoutineWithMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const getRoutines = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await routinesService.findAllWithMetrics(folderId);
        if (mounted) setRoutines(data);
      } catch (err: any) {
        if (mounted)
          setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getRoutines();

    return () => {
      mounted = false;
    };
  }, [folderId]);

  return {
    routines,
    count: routines.length,
    loading,
    error,
  };
};
