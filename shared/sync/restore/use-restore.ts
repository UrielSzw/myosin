/**
 * useRestore Hook
 *
 * Hook para manejar el proceso de restauración de datos desde Supabase.
 * Provee estado reactivo y funciones para iniciar/monitorear el restore.
 */

import { useCallback, useState } from "react";
import { useAuth } from "../../providers/auth-provider";
import {
  restoreService,
  type RestoreProgress,
  type RestoreResult,
} from "./restore-service";

export type RestoreStatus =
  | "idle"
  | "checking"
  | "needs_restore"
  | "restoring"
  | "success"
  | "error"
  | "not_needed";

export interface UseRestoreReturn {
  /** Estado actual del restore */
  status: RestoreStatus;
  /** Progreso del restore (cuando está en curso) */
  progress: RestoreProgress | null;
  /** Resultado del restore (cuando terminó) */
  result: RestoreResult | null;
  /** Error message si hubo error */
  error: string | null;
  /** Verifica si se necesita restore */
  checkNeedsRestore: () => Promise<boolean>;
  /** Inicia el proceso de restore */
  startRestore: () => Promise<RestoreResult | null>;
  /** Resetea el estado */
  reset: () => void;
}

export const useRestore = (): UseRestoreReturn => {
  const { user } = useAuth();
  const [status, setStatus] = useState<RestoreStatus>("idle");
  const [progress, setProgress] = useState<RestoreProgress | null>(null);
  const [result, setResult] = useState<RestoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkNeedsRestore = useCallback(async (): Promise<boolean> => {
    if (!user?.id) {
      setStatus("idle");
      return false;
    }

    setStatus("checking");
    setError(null);

    try {
      const needsRestore = await restoreService.needsRestore(user.id);
      setStatus(needsRestore ? "needs_restore" : "not_needed");
      return needsRestore;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      setStatus("error");
      return false;
    }
  }, [user?.id]);

  const startRestore = useCallback(async (): Promise<RestoreResult | null> => {
    if (!user?.id) {
      setError("No hay usuario autenticado");
      setStatus("error");
      return null;
    }

    setStatus("restoring");
    setError(null);
    setProgress(null);
    setResult(null);

    try {
      const restoreResult = await restoreService.restoreAll(
        user.id,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      setResult(restoreResult);
      setStatus(restoreResult.success ? "success" : "error");

      if (!restoreResult.success && restoreResult.errors.length > 0) {
        setError(restoreResult.errors.join("\n"));
      }

      return restoreResult;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      setStatus("error");
      return null;
    }
  }, [user?.id]);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(null);
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    progress,
    result,
    error,
    checkNeedsRestore,
    startRestore,
    reset,
  };
};
