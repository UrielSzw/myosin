import type { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useCallback, useEffect, useState } from "react";
import { routinesService } from "../service/routines";

export const useFolderDetailData = (folderId: string) => {
  const [routines, setRoutines] = useState<RoutineWithMetrics[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const routinesDb = await routinesService.findAllWithMetrics(folderId);

      setRoutines(routinesDb);
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
        await fetchData();
      }
    };

    runFetch();

    return () => {
      mounted = false;
    };
  }, [fetchData]);

  return {
    routines,
    loading,
    error,
    refetch: fetchData,
    count: routines.length,
  };
};
