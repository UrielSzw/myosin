/**
 * use-login-sync Hook
 *
 * Hook que orquesta todo el flujo de sincronización al login.
 * Maneja:
 * 1. Queue Gate check
 * 2. Full Reset vs Incremental Sync
 * 3. Progress tracking para UI
 * 4. Error handling
 */

import { useCallback, useRef, useState } from "react";
import {
  IncrementalSyncService,
  type LoginSyncResult,
  type SyncMode,
  type SyncProgress,
} from "../restore/incremental-sync";
import { QueueGateService, type QueueGateResult } from "../restore/queue-gate";

// =============================================================================
// TYPES
// =============================================================================

export type LoginSyncStatus =
  | "idle"
  | "checking_gate"
  | "blocked"
  | "syncing"
  | "success"
  | "error"
  | "offline_allowed";

export interface LoginSyncState {
  status: LoginSyncStatus;
  progress: SyncProgress | null;
  result: LoginSyncResult | null;
  error: string | null;
  blockReason: QueueGateResult | null;
}

export interface UseLoginSyncReturn {
  state: LoginSyncState;
  /** Ejecuta el flujo de login sync */
  performSync: (userId: string) => Promise<LoginSyncResult | null>;
  /** Reintenta el sync después de un error */
  retry: () => Promise<LoginSyncResult | null>;
  /** Intenta procesar el queue para desbloquear */
  tryUnblock: () => Promise<boolean>;
  /** Fuerza el clear del queue (DANGER) */
  forceUnblock: () => Promise<void>;
  /** Reset del estado */
  reset: () => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useLoginSync(): UseLoginSyncReturn {
  const [state, setState] = useState<LoginSyncState>({
    status: "idle",
    progress: null,
    result: null,
    error: null,
    blockReason: null,
  });

  const currentUserIdRef = useRef<string | null>(null);
  const syncInProgressRef = useRef(false);

  /**
   * Ejecuta el flujo completo de login sync
   */
  const performSync = useCallback(
    async (userId: string): Promise<LoginSyncResult | null> => {
      // Evitar doble ejecución
      if (syncInProgressRef.current) {
        return null;
      }

      syncInProgressRef.current = true;
      currentUserIdRef.current = userId;

      try {
        // PASO 1: Verificar Queue Gate
        console.warn(`[useLoginSync] Starting sync for user: ${userId}`);
        setState((prev) => ({
          ...prev,
          status: "checking_gate",
          error: null,
          blockReason: null,
        }));

        const gateResult = await QueueGateService.checkLoginAllowed(userId);
        console.warn(`[useLoginSync] Gate result:`, JSON.stringify(gateResult));

        if (!gateResult.allowed) {
          console.warn(`[useLoginSync] BLOCKED: ${gateResult.reason}`);
          setState((prev) => ({
            ...prev,
            status: "blocked",
            blockReason: gateResult,
          }));
          return null;
        }

        // PASO 2: Verificar conectividad
        const isOnline = await IncrementalSyncService.checkOnlineStatus();
        const lastUserId = await QueueGateService.getLastLoggedUserId();
        const isSameUser = lastUserId === userId;

        console.warn(
          `[useLoginSync] isOnline=${isOnline}, lastUserId=${lastUserId}, newUserId=${userId}, isSameUser=${isSameUser}`
        );

        // Si es el mismo usuario y está offline, permitir acceso sin sync
        if (!isOnline && isSameUser) {
          console.warn(
            `[useLoginSync] Offline + same user -> allowing without sync`
          );
          setState((prev) => ({
            ...prev,
            status: "offline_allowed",
            result: {
              success: true,
              mode: "incremental" as SyncMode,
              tables: [],
              totalDownloaded: 0,
              totalErrors: 0,
              durationMs: 0,
            },
          }));
          return null;
        }

        // Si está offline y es usuario diferente, error
        if (!isOnline && !isSameUser) {
          setState((prev) => ({
            ...prev,
            status: "error",
            error:
              "Sin conexión a internet. Necesitas conexión para iniciar sesión con otra cuenta.",
          }));
          return null;
        }

        // PASO 3: Ejecutar sync
        setState((prev) => ({
          ...prev,
          status: "syncing",
          progress: {
            mode: isSameUser ? "incremental" : "full_reset",
            phase: "downloading",
            currentTable: "",
            tablesCompleted: 0,
            totalTables: 0,
            recordsProcessed: 0,
            percentage: 0,
          },
        }));

        const result = await IncrementalSyncService.performLoginSync(
          userId,
          lastUserId,
          (progress) => {
            setState((prev) => ({
              ...prev,
              progress,
            }));
          }
        );

        // PASO 4: Resultado
        if (result.success) {
          setState((prev) => ({
            ...prev,
            status: "success",
            result,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            status: "error",
            result,
            error: `Sync completado con ${result.totalErrors} errores`,
          }));
        }

        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        setState((prev) => ({
          ...prev,
          status: "error",
          error: errorMsg,
        }));
        return null;
      } finally {
        syncInProgressRef.current = false;
      }
    },
    []
  );

  /**
   * Reintenta el sync con el último userId
   */
  const retry = useCallback(async (): Promise<LoginSyncResult | null> => {
    if (!currentUserIdRef.current) {
      console.warn("[useLoginSync] No userId to retry");
      return null;
    }
    return performSync(currentUserIdRef.current);
  }, [performSync]);

  /**
   * Intenta procesar el queue pendiente para desbloquear
   */
  const tryUnblock = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({
      ...prev,
      status: "syncing",
      progress: {
        mode: "incremental",
        phase: "uploading",
        currentTable: "sync_queue",
        tablesCompleted: 0,
        totalTables: 1,
        recordsProcessed: 0,
        percentage: 50,
      },
    }));

    const success = await QueueGateService.tryProcessQueueBeforeLogin();

    if (success) {
      // Queue vacío, reintentar login
      if (currentUserIdRef.current) {
        return performSync(currentUserIdRef.current) !== null;
      }
    } else {
      setState((prev) => ({
        ...prev,
        status: "blocked",
        error: "No se pudo procesar el queue pendiente. Verifica tu conexión.",
      }));
    }

    return success;
  }, [performSync]);

  /**
   * Fuerza el clear del queue (DANGER)
   */
  const forceUnblock = useCallback(async (): Promise<void> => {
    await QueueGateService.forceQueueClear();

    // Reintentar login
    if (currentUserIdRef.current) {
      await performSync(currentUserIdRef.current);
    }
  }, [performSync]);

  /**
   * Reset del estado
   */
  const reset = useCallback(() => {
    setState({
      status: "idle",
      progress: null,
      result: null,
      error: null,
      blockReason: null,
    });
    currentUserIdRef.current = null;
    syncInProgressRef.current = false;
  }, []);

  return {
    state,
    performSync,
    retry,
    tryUnblock,
    forceUnblock,
    reset,
  };
}
