import { BaseFolder } from "@/shared/db/schema";
import { useEffect, useState } from "react";
import { routinesService } from "../service/routines";

export const useFolders = () => {
  const [folders, setFolders] = useState<BaseFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const getRoutines = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await routinesService.getAllFolders();
        if (mounted) setFolders(data);
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
  }, []);

  return {
    folders,
    loading,
    error,
  };
};
