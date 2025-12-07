import { SYNC_STATUS_QUERY_KEY } from "@/features/sync-status-v2/hooks/use-sync-status";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { getSyncQueueRepository } from "../queue/sync-queue-repository";
import { useSyncEngine } from "../sync-engine";
import { GlobalSyncLock } from "../utils/global-sync-lock";
import { runQueueCleanup } from "../utils/queue-cleanup";

/**
 * Scheduler ultra-simple que procesa la sync queue cada 30 segundos
 *
 * - Solo timer periódico, sin triggers adicionales
 * - Usa GlobalSyncLock para prevenir concurrencia
 * - Fail-fast: si hay lock, skip inmediato
 * - Robusto y predecible
 * - Cleanup automático de entries viejas (una vez al día)
 * - Auto-sync cuando vuelve la conexión
 * - Pausa cuando la app va a background (ahorro de batería)
 */
export const useSimpleScheduler = (intervalMs: number = 30000) => {
  const { processQueue, isOnline } = useSyncEngine();
  const queryClient = useQueryClient();
  const hasRunStartupTasks = useRef(false);
  const wasOnlineRef = useRef(isOnline);
  const isOnlineRef = useRef(isOnline); // Para usar en closures sin stale values
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const [isAppActive, setIsAppActive] = useState(true);

  // Mantener ref sincronizada con el estado actual
  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  /**
   * Procesa la queue con mutex global e invalida el sync status
   */
  const processWithLock = useCallback(async () => {
    const result = await GlobalSyncLock.execute(async () => {
      return await processQueue();
    });

    // Si no pudo obtener el lock, retorna resultado vacío
    if (result === null) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    // Invalidar sync status para actualizar la UI
    if (result.processed > 0) {
      queryClient.invalidateQueries({ queryKey: SYNC_STATUS_QUERY_KEY });
    }

    return result;
  }, [processQueue, queryClient]);

  /**
   * Startup tasks: recovery de items stuck + cleanup de entries viejas
   * Se ejecuta una sola vez al iniciar la app
   */
  useEffect(() => {
    if (hasRunStartupTasks.current) return;

    const performStartupTasks = async () => {
      try {
        const repo = getSyncQueueRepository();

        // 1. Recuperar items que quedaron stuck en "processing" (app killed mid-sync)
        const recoveredCount = await repo.recoverStuckProcessingItems();
        if (recoveredCount > 0) {
          console.warn(
            `[SimpleScheduler] Recovered ${recoveredCount} stuck processing items`
          );
        }

        // 2. Cleanup de entries viejas
        const cleanupResult = await runQueueCleanup();
        if (
          cleanupResult.completedDeleted > 0 ||
          cleanupResult.failedDeleted > 0
        ) {
          console.warn(
            `[SimpleScheduler] Cleanup: ${cleanupResult.completedDeleted} completed, ${cleanupResult.failedDeleted} failed entries removed`
          );
        }

        hasRunStartupTasks.current = true;
      } catch (error) {
        console.error("[SimpleScheduler] Startup tasks error:", error);
      }
    };

    // Ejecutar después de un pequeño delay (para no bloquear el startup)
    const timeoutId = setTimeout(performStartupTasks, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  /**
   * AppState listener - pausa el scheduler cuando la app va a background
   */
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        const wasInBackground =
          appStateRef.current.match(/inactive|background/);
        const isNowActive = nextAppState === "active";

        if (wasInBackground && isNowActive) {
          // App volvió a foreground -> reanudar y disparar sync
          setIsAppActive(true);
          // Sync inmediato al volver (si está online - usar ref para valor fresco)
          if (isOnlineRef.current) {
            setTimeout(() => processWithLock(), 1000);
          }
        } else if (nextAppState.match(/inactive|background/)) {
          // App va a background -> pausar scheduler
          setIsAppActive(false);
        }

        appStateRef.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, [processWithLock]); // ✅ Removido isOnline de dependencies

  /**
   * Timer periódico - solo ejecuta si está online Y app activa
   */
  useEffect(() => {
    // No correr si está offline o en background
    if (!isOnline || !isAppActive) {
      if (!isOnline) {
        wasOnlineRef.current = false;
      }
      return;
    }

    // Si pasamos de offline a online, disparar sync inmediatamente
    if (!wasOnlineRef.current && isOnline) {
      // Pequeño delay para asegurar que la conexión está estable
      const reconnectTimeout = setTimeout(() => {
        processWithLock();
      }, 2000);

      wasOnlineRef.current = true;

      // Configurar intervalo normal
      const interval = setInterval(() => {
        processWithLock();
      }, intervalMs);

      return () => {
        clearTimeout(reconnectTimeout);
        clearInterval(interval);
      };
    }

    wasOnlineRef.current = true;

    // Configurar intervalo (la primera ejecución será después del intervalo)
    const interval = setInterval(() => {
      processWithLock();
    }, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [isOnline, isAppActive, intervalMs, processWithLock]);

  return {
    /**
     * Procesar queue manualmente (también usa el lock)
     */
    processNow: processWithLock,

    /**
     * Estado del scheduler (online + app activa)
     */
    isRunning: isOnline && isAppActive,

    /**
     * Configuración actual
     */
    config: {
      intervalMs,
      isOnline,
      isAppActive,
    },

    /**
     * Debug info
     */
    debug: {
      isLocked: GlobalSyncLock.isLocked(),
      lockInfo: GlobalSyncLock.getDebugInfo(),
    },
  };
};
