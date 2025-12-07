import { useNetwork } from "../hooks/use-network";
import { supabaseSyncDictionary } from "./dictionary/sync-dictionary";
import { getSyncQueueRepository } from "./queue/sync-queue-repository";
import { useSyncStateManager } from "./queue/sync-state-manager";
import type { MutationPayloadMap } from "./types/mutation-payloads";
import type { MutationCode } from "./types/mutations";
import type { SyncMutation } from "./types/sync-queue";
import { calculateNextRetryDate } from "./utils/backoff-calculator";
import { confirmSyncFromPayload } from "./utils/sync-confirmation";

export interface SyncResult<T = unknown> {
  success: boolean;
  queued?: boolean;
  result?: T;
  error?: string;
}

/**
 * Type-safe sync function for direct sync (for tests and usage without hooks)
 */
export const syncToSupabase = async <T extends MutationCode>(
  code: T,
  payload: MutationPayloadMap[T]
): Promise<SyncResult> => {
  try {
    const syncFunction = supabaseSyncDictionary[code];

    if (!syncFunction) {
      throw new Error(`No sync function found for mutation code: ${code}`);
    }

    const result = await syncFunction(payload as never);
    return { success: true, result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
};

export const useSyncEngine = () => {
  const isOnline = useNetwork();
  const queueRepo = getSyncQueueRepository();
  const syncState = useSyncStateManager();

  /**
   * Type-safe sync function.
   * Attempts immediate sync if online, otherwise queues the mutation.
   */
  const sync = async <T extends MutationCode>(
    code: T,
    payload: MutationPayloadMap[T]
  ): Promise<SyncResult> => {
    if (!isOnline) {
      try {
        const mutation: SyncMutation = { code, payload };
        const queueId = await queueRepo.enqueue(mutation);

        return {
          success: false,
          queued: true,
          result: { queueId },
        };
      } catch (error) {
        console.error("Failed to queue mutation:", error);
        return {
          success: false,
          queued: false,
          error: "Failed to queue mutation",
        };
      }
    }

    // Use direct sync function
    const result = await syncToSupabase(code, payload);

    // If sync succeeded, mark entity as synced in SQLite
    if (result.success) {
      try {
        await confirmSyncFromPayload(code, payload as Record<string, any>);
      } catch (e) {
        // Non-fatal: log but don't fail the sync
        console.warn(`[Sync] Failed to confirm sync for ${code}:`, e);
      }
    }

    return result;
  };

  const processQueue = async (): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
  }> => {
    if (!isOnline) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    // Check engine state (circuit breaker / backoff)
    const shouldPause = await syncState.shouldPauseProcessing();

    if (shouldPause) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    const entries = await queueRepo.getReadyForProcessing(10);

    let succeeded = 0;
    let failed = 0;

    if (entries.length === 0) {
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    for (const entry of entries) {
      try {
        // Mark as processing
        await queueRepo.markProcessing(entry.id);

        // Parse payload and execute
        const payload = JSON.parse(entry.payload);

        const result = await syncToSupabase(
          entry.mutation_code as MutationCode,
          payload
        );

        if (result.success) {
          await queueRepo.markCompleted(entry.id);
          succeeded++;

          // ✅ Mark entity as synced in SQLite (is_synced = true)
          try {
            await confirmSyncFromPayload(
              entry.mutation_code as MutationCode,
              payload
            );
          } catch (e) {
            // Non-fatal: log but don't fail the sync
            console.warn(
              `[Sync] Failed to confirm sync for ${entry.mutation_code}:`,
              e
            );
          }

          // Notify engine state manager so circuit-breaker can reset
          try {
            await syncState.onSyncSuccess();
          } catch (e) {
            // Non-fatal: don't stop processing if state manager hiccups
            console.warn("Could not notify sync state manager of success:", e);
          }
        } else {
          throw new Error(result.error || "Sync failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        // Increment per-entry retry count
        const retryCount = await queueRepo.incrementRetryCount(entry.id);

        // Notify engine state manager about the failure; it may return a backoffUntil
        let engineBackoff: Date | null = null;
        try {
          engineBackoff = await syncState.onSyncFailure(
            new Error(errorMessage)
          );
        } catch (e) {
          console.warn("Sync state manager onSyncFailure failed:", e);
        }

        if (engineBackoff) {
          // Circuit breaker engaged: schedule next retry globally and stop processing further items
          await queueRepo.markFailed(entry.id, errorMessage, engineBackoff);
          failed++;
          break; // Stop processing more items now
        }

        if (retryCount >= entry.max_retries) {
          // Max retries reached - mark as failed permanently
          await queueRepo.markFailed(entry.id, errorMessage);
          console.error(
            `Max retries reached for ${entry.mutation_code}:`,
            errorMessage
          );
        } else {
          // Calculate exponential backoff delay for this entry only
          const nextRetry = calculateNextRetryDate(retryCount);
          await queueRepo.markFailed(entry.id, errorMessage, nextRetry);
        }

        failed++;
      }
    }

    return { processed: entries.length, succeeded, failed };
  };

  return {
    sync,
    processQueue,
    isOnline,
    // Queue management
    getQueueSize: () => queueRepo.getQueueSize(),
    getQueueMetrics: () => queueRepo.getHealthMetrics(),
    // Funciones útiles para debugging
    getSyncFunction: (code: MutationCode) => supabaseSyncDictionary[code],
    getAvailableMutations: () =>
      Object.keys(supabaseSyncDictionary) as MutationCode[],
  };
};
