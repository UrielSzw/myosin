import { FolderWithMetrics } from "@/shared/db/repository/folders";
import type { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useCallback, useEffect, useState } from "react";
import { routinesService } from "../service/routines";

export const useMainWorkoutsData = () => {
  const [routines, setRoutines] = useState<RoutineWithMetrics[]>([]);
  const [folders, setFolders] = useState<FolderWithMetrics[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const routinesDb = await routinesService.findAllWithMetrics(null);
      const foldersDb = await routinesService.getAllFoldersWithMetrics();

      setRoutines(routinesDb);
      setFolders(foldersDb);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

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
    folders,
    loading,
    error,
    refetch: fetchData,
    count: routines.length,
  };
};
