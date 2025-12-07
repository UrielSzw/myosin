/**
 * Queue Cleanup - Limpieza automática de la sync queue
 *
 * Este módulo maneja la limpieza periódica de entries completadas
 * para evitar que la tabla sync_queue crezca indefinidamente.
 */

import {
  getSyncQueueRepository,
  SyncQueueRepository,
} from "../queue/sync-queue-repository";

// Extended interface for cleanup methods (TypeScript cache workaround)
interface SyncQueueRepoWithCleanup extends SyncQueueRepository {
  cleanupCompleted(daysOld?: number): Promise<number>;
  cleanupFailed(daysOld?: number): Promise<number>;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const CLEANUP_CONFIG = {
  /** Intervalo entre limpiezas (24 horas) */
  intervalMs: 24 * 60 * 60 * 1000,
  /** Edad mínima de entries completadas para borrar (7 días) */
  completedDaysOld: 7,
  /** Edad mínima de entries fallidas para borrar (30 días) */
  failedDaysOld: 30,
};

// =============================================================================
// CLEANUP FUNCTIONS
// =============================================================================

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Ejecuta la limpieza de la queue
 */
export const runQueueCleanup = async (): Promise<{
  completedDeleted: number;
  failedDeleted: number;
}> => {
  const queueRepo = getSyncQueueRepository() as SyncQueueRepoWithCleanup;

  try {
    // Limpiar entries completadas de más de 7 días
    const completedDeleted = await queueRepo.cleanupCompleted(
      CLEANUP_CONFIG.completedDaysOld
    );

    // Limpiar entries fallidas de más de 30 días (después de max retries)
    const failedDeleted = await queueRepo.cleanupFailed(
      CLEANUP_CONFIG.failedDaysOld
    );

    if (completedDeleted > 0 || failedDeleted > 0) {
      console.warn(
        `[QueueCleanup] Cleaned up: ${completedDeleted} completed, ${failedDeleted} failed entries`
      );
    }

    return { completedDeleted, failedDeleted };
  } catch (error) {
    console.error("[QueueCleanup] Error during cleanup:", error);
    return { completedDeleted: 0, failedDeleted: 0 };
  }
};

/**
 * Inicia el cleanup automático periódico
 */
export const startQueueCleanupScheduler = (): void => {
  if (cleanupInterval) {
    console.warn("[QueueCleanup] Scheduler already running");
    return;
  }

  console.warn(
    `[QueueCleanup] Starting scheduler (every ${
      CLEANUP_CONFIG.intervalMs / 1000 / 60 / 60
    }h)`
  );

  // Ejecutar una limpieza inicial después de 5 minutos
  setTimeout(() => {
    runQueueCleanup();
  }, 5 * 60 * 1000);

  // Configurar intervalo periódico
  cleanupInterval = setInterval(() => {
    runQueueCleanup();
  }, CLEANUP_CONFIG.intervalMs);
};

/**
 * Detiene el cleanup automático
 */
export const stopQueueCleanupScheduler = (): void => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.warn("[QueueCleanup] Scheduler stopped");
  }
};

/**
 * Obtiene estadísticas de la queue para debugging
 */
export const getQueueStats = async (): Promise<{
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
}> => {
  const queueRepo = getSyncQueueRepository();
  const metrics = await queueRepo.getHealthMetrics();

  return {
    pending: metrics.pending,
    processing: 0, // Health metrics doesn't track this currently
    completed: metrics.completed,
    failed: metrics.failed,
    total: metrics.total,
  };
};
