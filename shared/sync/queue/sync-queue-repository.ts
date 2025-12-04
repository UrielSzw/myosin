import { and, asc, desc, eq, lte } from "drizzle-orm";
import { db } from "../../db/client";
import { syncEngineState, syncQueue } from "../../db/schema/sync-queue";
import type {
  SyncEngineState,
  SyncMutation,
  SyncQueueEntry,
  SyncQueueInsert,
  SyncQueueStatus,
} from "../types/sync-queue";

// Singleton instance - única instancia en toda la app
let globalInstance: SyncQueueRepository | null = null;

/**
 * Get the singleton instance of SyncQueueRepository
 */
export const getSyncQueueRepository = (): SyncQueueRepository => {
  if (!globalInstance) {
    globalInstance = new SyncQueueRepository();
  }
  return globalInstance;
};

export class SyncQueueRepository {
  // ==================== QUEUE OPERATIONS ====================

  /**
   * Agrega mutation a la queue
   */
  async enqueue(mutation: SyncMutation): Promise<string> {
    const now = new Date().toISOString();

    const entry: SyncQueueInsert = {
      mutation_code: mutation.code,
      payload: JSON.stringify(mutation.payload),
      scheduled_at: now, // Inmediato por defecto
      max_retries: mutation.maxRetries ?? 5,
    };

    const [inserted] = await db
      .insert(syncQueue)
      .values({
        ...entry,
        created_at: now,
        updated_at: now,
      })
      .returning();

    console.log(`📥 Queued mutation: ${mutation.code} (id: ${inserted.id})`);
    return inserted.id;
  }

  /**
   * Obtiene mutations ready para procesar (en orden cronológico)
   */
  async getReadyForProcessing(limit: number = 10): Promise<SyncQueueEntry[]> {
    const now = new Date().toISOString();

    const entries = await db
      .select()
      .from(syncQueue)
      .where(
        and(
          eq(syncQueue.status, "pending"),
          lte(syncQueue.scheduled_at, now) // Solo los que ya están programados
        )
      )
      .orderBy(asc(syncQueue.created_at)) // 🔑 Orden cronológico
      .limit(limit);

    return entries as SyncQueueEntry[];
  }

  /**
   * Marca entry como processing
   */
  async markProcessing(id: string): Promise<void> {
    await db
      .update(syncQueue)
      .set({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .where(eq(syncQueue.id, id));
  }

  /**
   * Marca entry como completed
   */
  async markCompleted(id: string): Promise<void> {
    await db
      .update(syncQueue)
      .set({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .where(eq(syncQueue.id, id));
  }

  /**
   * Marca entry como failed y programa retry
   */
  async markFailed(
    id: string,
    error: string,
    nextRetryAt?: Date
  ): Promise<void> {
    const updateData: any = {
      status: "failed" as SyncQueueStatus,
      error_message: error,
      updated_at: new Date().toISOString(),
    };

    // Si hay nextRetryAt, programar retry
    if (nextRetryAt) {
      updateData.status = "pending";
      updateData.scheduled_at = nextRetryAt.toISOString();
      // retry_count will be updated by incrementRetryCount method
    }

    await db.update(syncQueue).set(updateData).where(eq(syncQueue.id, id));
  }

  /**
   * Incrementa retry count
   */
  async incrementRetryCount(id: string): Promise<number> {
    // Get current retry count
    const [current] = await db
      .select({ retry_count: syncQueue.retry_count })
      .from(syncQueue)
      .where(eq(syncQueue.id, id));

    const newCount = current.retry_count + 1;

    await db
      .update(syncQueue)
      .set({
        retry_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .where(eq(syncQueue.id, id));

    return newCount;
  }

  // ==================== QUERY METHODS ====================

  /**
   * Obtiene entries by status
   */
  async getByStatus(status: SyncQueueStatus): Promise<SyncQueueEntry[]> {
    const entries = await db
      .select()
      .from(syncQueue)
      .where(eq(syncQueue.status, status))
      .orderBy(desc(syncQueue.created_at));

    return entries as SyncQueueEntry[];
  }

  /**
   * Queue size total
   */
  async getQueueSize(): Promise<number> {
    const [result] = await db
      .select({ count: db.$count(syncQueue.id) })
      .from(syncQueue)
      .where(eq(syncQueue.status, "pending"));

    return result.count;
  }

  /**
   * Health metrics
   */
  async getHealthMetrics(): Promise<{
    total: number;
    pending: number;
    failed: number;
    completed: number;
  }> {
    const results = await db
      .select({
        status: syncQueue.status,
        count: db.$count(syncQueue.id),
      })
      .from(syncQueue)
      .groupBy(syncQueue.status);

    const metrics = {
      total: 0,
      pending: 0,
      failed: 0,
      completed: 0,
    };

    results.forEach(({ status, count }) => {
      metrics.total += count;
      metrics[status as keyof typeof metrics] = count;
    });

    return metrics;
  }

  // ==================== CLEANUP ====================

  /**
   * Limpia entries completadas (older than X days)
   */
  async cleanupCompleted(daysOld: number = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await db
      .delete(syncQueue)
      .where(
        and(
          eq(syncQueue.status, "completed"),
          lte(syncQueue.updated_at, cutoffDate.toISOString())
        )
      );

    return result.changes;
  }

  /**
   * Purga entries failed permanentemente
   */
  async purgeFailed(): Promise<number> {
    const result = await db
      .delete(syncQueue)
      .where(eq(syncQueue.status, "failed"));

    return result.changes;
  }

  // ==================== ENGINE STATE ====================

  /**
   * Get current engine state
   */
  async getEngineState(): Promise<SyncEngineState | null> {
    const [state] = await db
      .select()
      .from(syncEngineState)
      .where(eq(syncEngineState.id, "singleton"))
      .limit(1);

    if (!state) return null;

    return {
      status: state.status,
      consecutiveFailures: state.consecutive_failures,
      lastFailureTime: state.last_failure_at
        ? new Date(state.last_failure_at)
        : null,
      backoffUntil: state.backoff_until ? new Date(state.backoff_until) : null,
      networkState: state.network_state,
      lastNetworkChange: state.last_network_change
        ? new Date(state.last_network_change)
        : null,
    };
  }

  /**
   * Update engine state
   */
  async updateEngineState(updates: Partial<SyncEngineState>): Promise<void> {
    const now = new Date().toISOString();

    const updateData: any = {
      updated_at: now,
    };

    if (updates.status) updateData.status = updates.status;
    if (updates.consecutiveFailures !== undefined)
      updateData.consecutive_failures = updates.consecutiveFailures;
    if (updates.lastFailureTime)
      updateData.last_failure_at = updates.lastFailureTime.toISOString();
    if (updates.backoffUntil)
      updateData.backoff_until = updates.backoffUntil.toISOString();
    if (updates.networkState) updateData.network_state = updates.networkState;
    if (updates.lastNetworkChange)
      updateData.last_network_change = updates.lastNetworkChange.toISOString();

    // Upsert pattern
    await db
      .insert(syncEngineState)
      .values({
        id: "singleton",
        created_at: now,
        ...updateData,
      })
      .onConflictDoUpdate({
        target: syncEngineState.id,
        set: updateData,
      });
  }
}
