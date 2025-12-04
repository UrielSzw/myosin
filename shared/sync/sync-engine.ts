import { useNetwork } from "../hooks/use-network";
import { supabaseSyncDictionary } from "./dictionary/sync-dictionary";
import { getSyncQueueRepository } from "./queue/sync-queue-repository";
import { useSyncStateManager } from "./queue/sync-state-manager";
import type { MutationPayloadMap } from "./types/mutation-payloads";
import type { MutationCode } from "./types/mutations";
import type { SyncMutation } from "./types/sync-queue";
import { calculateNextRetryDate } from "./utils/backoff-calculator";

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
    console.log(`🔄 Attempting sync: ${code}`, { isOnline, payload });

    if (!isOnline) {
      console.log("📴 Offline - queueing mutation:", code);

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
    return await syncToSupabase(code, payload);
  };

  const processQueue = async (): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
  }> => {
    console.log("🚀 [processQueue] Starting processQueue function");
    console.log(
      "🔥 [processQueue] Starting internal logic (no mutex here, handled by scheduler)"
    );
    console.log("🔍 [processQueue] Inside mutex, checking conditions...");
    console.log("🔍 [processQueue] isOnline =", isOnline);

    if (!isOnline) {
      console.log("📴 Offline - skipping queue processing");
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    console.log("🔍 [processQueue] Online confirmed, checking engine state...");

    // Check engine state (circuit breaker / backoff)
    console.log("🔍 [processQueue] About to check shouldPauseProcessing...");
    const shouldPause = await syncState.shouldPauseProcessing();
    console.log("🔍 [processQueue] shouldPauseProcessing result:", shouldPause);

    if (shouldPause) {
      const remaining = await syncState.getBackoffTimeRemaining();
      console.log(
        `⏸️ Queue processing paused by engine state. Backoff remaining: ${Math.round(
          remaining / 1000
        )}s`
      );
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    console.log("🔍 [processQueue] Engine state OK, starting processing...");
    console.log("🔄 Processing sync queue...");
    console.log(
      "🔍 [processQueue] About to call queueRepo.getReadyForProcessing(10)..."
    );

    const entries = await queueRepo.getReadyForProcessing(10);
    console.log(`🔍 [processQueue] Found ${entries.length} entries to process`);
    console.log(
      "🔍 [processQueue] Entries details:",
      entries.map((e) => ({
        id: e.id,
        code: e.mutation_code,
        created_at: e.created_at,
      }))
    );

    let succeeded = 0;
    let failed = 0;

    if (entries.length === 0) {
      console.log(
        "✨ [processQueue] No entries to process, returning empty result"
      );
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    console.log(
      "🔥 [processQueue] Starting sequential processing of entries..."
    );

    for (const entry of entries) {
      try {
        console.log(
          `🔄 [processQueue] Processing entry: ${entry.mutation_code} (${entry.id})`
        );

        // Mark as processing
        await queueRepo.markProcessing(entry.id);
        console.log(`🔄 [processQueue] Marked ${entry.id} as processing`);

        // Parse payload and execute
        const payload = JSON.parse(entry.payload);
        console.log(
          `🔄 [processQueue] Parsed payload for ${entry.id}:`,
          payload
        );

        const result = await syncToSupabase(
          entry.mutation_code as MutationCode,
          payload
        );
        console.log(
          `🔄 [processQueue] syncToSupabase result for ${entry.id}:`,
          result
        );

        if (result.success) {
          await queueRepo.markCompleted(entry.id);
          succeeded++;
          console.log(`✅ Synced: ${entry.mutation_code}`);

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
          console.error(
            `🔴 Circuit breaker engaged due to ${
              entry.mutation_code
            }. Backing off until ${engineBackoff.toISOString()}`
          );
          failed++;
          break; // Stop processing more items now
        }

        if (retryCount >= entry.max_retries) {
          // Max retries reached - mark as failed permanently
          await queueRepo.markFailed(entry.id, errorMessage);
          console.error(
            `❌ Max retries reached for ${entry.mutation_code}:`,
            errorMessage
          );
        } else {
          // Calculate exponential backoff delay for this entry only
          const nextRetry = calculateNextRetryDate(retryCount);
          await queueRepo.markFailed(entry.id, errorMessage, nextRetry);
          console.warn(
            `⚠️ Retry ${retryCount}/${entry.max_retries} for ${
              entry.mutation_code
            } - next attempt: ${nextRetry.toLocaleTimeString()}`
          );
        }

        failed++;
      }
    }

    console.log(
      `📊 Queue processed: ${entries.length} total, ${succeeded} succeeded, ${failed} failed`
    );
    const finalResult = { processed: entries.length, succeeded, failed };
    console.log(
      "🏁 [processQueue] Processing complete, returning:",
      finalResult
    );
    return finalResult;
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
