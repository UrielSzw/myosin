import { useSyncEngine } from "../sync-engine";
import { useSimpleScheduler } from "./use-simple-scheduler";

/**
 * Hook principal que integra todo el sistema de sync con queue
 * - Sync engine con queue y circuit breaker
 * - Scheduler simple que procesa cada 30s con mutex global
 * - Sin race conditions ni múltiples triggers
 * - APIs para debugging y monitoreo
 */
export const useSync = () => {
  const syncEngine = useSyncEngine();
  const scheduler = useSimpleScheduler(30000); // 30 segundos

  return {
    // Core sync functionality
    ...syncEngine,

    // Scheduler control
    scheduler: {
      processNow: scheduler.processNow,
      isRunning: scheduler.isRunning,
      config: scheduler.config,
    },

    // Debugging utilities
    debug: {
      getQueueMetrics: syncEngine.getQueueMetrics,
      getQueueSize: syncEngine.getQueueSize,
      getSyncFunction: syncEngine.getSyncFunction,
      getAvailableMutations: syncEngine.getAvailableMutations,
    },
  };
};

/**
 * Hook ligero solo para sync sin scheduler automático
 */
export const useSyncOnly = () => {
  return useSyncEngine();
};
