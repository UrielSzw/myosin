import { useCallback, useEffect } from "react";
import { useSyncEngine } from "../sync-engine";
import { GlobalSyncLock } from "../utils/global-sync-lock";

/**
 * Scheduler ultra-simple que procesa la sync queue cada 30 segundos
 *
 * - Solo timer periódico, sin triggers adicionales
 * - Usa GlobalSyncLock para prevenir concurrencia
 * - Fail-fast: si hay lock, skip inmediato
 * - Robusto y predecible
 */
export const useSimpleScheduler = (intervalMs: number = 30000) => {
  const { processQueue, isOnline } = useSyncEngine();

  /**
   * Procesa la queue con mutex global
   */
  const processWithLock = useCallback(async () => {
    const result = await GlobalSyncLock.execute(async () => {
      console.log("⏰ [SimpleScheduler] Processing sync queue...");
      return await processQueue();
    });

    // Si no pudo obtener el lock, retorna resultado vacío
    if (result === null) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    return result;
  }, [processQueue]);

  /**
   * Timer periódico - solo ejecuta si está online
   */
  useEffect(() => {
    if (!isOnline) {
      console.log("📴 [SimpleScheduler] Offline - scheduler paused");
      return;
    }

    console.log(
      `▶️ [SimpleScheduler] Started - processing every ${intervalMs / 1000}s`
    );

    // Configurar intervalo (la primera ejecución será después del intervalo)
    const interval = setInterval(() => {
      processWithLock();
    }, intervalMs);

    return () => {
      clearInterval(interval);
      console.log("⏸️ [SimpleScheduler] Stopped");
    };
  }, [isOnline, intervalMs, processWithLock]);

  return {
    /**
     * Procesar queue manualmente (también usa el lock)
     */
    processNow: processWithLock,

    /**
     * Estado del scheduler
     */
    isRunning: isOnline,

    /**
     * Configuración actual
     */
    config: {
      intervalMs,
      isOnline,
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
