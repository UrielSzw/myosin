import { db, sqlite } from "@/shared/db/client";
import { syncQueue } from "@/shared/db/schema/sync-queue";
import { useNetwork } from "@/shared/hooks/use-network";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eq, sql } from "drizzle-orm";
import { useCallback } from "react";

// =============================================================================
// QUERY KEYS
// =============================================================================

export const SYNC_STATUS_QUERY_KEY = ["sync-status"];

// =============================================================================
// TYPES
// =============================================================================

export interface QueueStats {
  pending: number;
  processing: number;
  failed: number;
  total: number;
}

export interface TableSyncStats {
  tableName: string;
  displayName: string;
  total: number;
  unsynced: number;
  synced: number;
}

export interface SyncStatusData {
  queue: QueueStats;
  tables: TableSyncStats[];
  lastFetch: Date;
}

// =============================================================================
// TABLES TO CHECK
// =============================================================================

const TABLES_TO_CHECK = [
  {
    name: "routines",
    displayName: "Routines",
  },
  {
    name: "folders",
    displayName: "Folders",
  },
  {
    name: "workout_sessions",
    displayName: "Workouts",
  },
  { name: "pr_current", displayName: "PRs" },
  {
    name: "tracker_metrics",
    displayName: "Tracker Metrics",
  },
  {
    name: "tracker_entries",
    displayName: "Tracker Entries",
  },
  {
    name: "macro_entries",
    displayName: "Macro Entries",
  },
] as const;

// =============================================================================
// FETCH FUNCTIONS
// =============================================================================

async function fetchQueueStats(): Promise<QueueStats> {
  try {
    const pending = await db
      .select({ count: sql<number>`count(*)` })
      .from(syncQueue)
      .where(eq(syncQueue.status, "pending"));

    const processing = await db
      .select({ count: sql<number>`count(*)` })
      .from(syncQueue)
      .where(eq(syncQueue.status, "processing"));

    const failed = await db
      .select({ count: sql<number>`count(*)` })
      .from(syncQueue)
      .where(eq(syncQueue.status, "failed"));

    return {
      pending: pending[0]?.count ?? 0,
      processing: processing[0]?.count ?? 0,
      failed: failed[0]?.count ?? 0,
      total:
        (pending[0]?.count ?? 0) +
        (processing[0]?.count ?? 0) +
        (failed[0]?.count ?? 0),
    };
  } catch (error) {
    console.error("[useSyncStatus] Error fetching queue stats:", error);
    return { pending: 0, processing: 0, failed: 0, total: 0 };
  }
}

async function fetchTableStats(): Promise<TableSyncStats[]> {
  const results: TableSyncStats[] = [];

  for (const table of TABLES_TO_CHECK) {
    try {
      // Get total count
      const totalResult = sqlite.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${table.name}`
      );
      const total = totalResult?.count ?? 0;

      // Get unsynced count (is_synced = 0 or is_synced IS NULL)
      const unsyncedResult = sqlite.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${table.name} WHERE is_synced = 0 OR is_synced IS NULL`
      );
      const unsynced = unsyncedResult?.count ?? 0;

      results.push({
        tableName: table.name,
        displayName: table.displayName,
        total,
        unsynced,
        synced: total - unsynced,
      });
    } catch {
      // Table might not exist or have is_synced column - skip silently
    }
  }

  return results;
}

async function fetchSyncStatus(): Promise<SyncStatusData> {
  const [queue, tables] = await Promise.all([
    fetchQueueStats(),
    fetchTableStats(),
  ]);

  return {
    queue,
    tables,
    lastFetch: new Date(),
  };
}

// =============================================================================
// HOOK
// =============================================================================

export function useSyncStatus() {
  const isOnline = useNetwork();
  const queryClient = useQueryClient();

  const query = useQuery<SyncStatusData>({
    queryKey: SYNC_STATUS_QUERY_KEY,
    queryFn: fetchSyncStatus,
    staleTime: 1000 * 5, // 5 segundos - datos cambian frecuentemente durante sync
    gcTime: 1000 * 60, // 1 minuto en cache
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: SYNC_STATUS_QUERY_KEY });
  }, [queryClient]);

  return {
    status: {
      isOnline,
      queue: query.data?.queue ?? {
        pending: 0,
        processing: 0,
        failed: 0,
        total: 0,
      },
      tables: query.data?.tables ?? [],
      lastSyncAttempt: query.data?.lastFetch ?? null,
      isLoading: query.isLoading,
      error: query.error?.message ?? null,
    },
    refresh,
  };
}

// =============================================================================
// UTILITY: Invalidate sync status (call from sync engine)
// =============================================================================

export function invalidateSyncStatus(
  queryClient: ReturnType<typeof useQueryClient>
) {
  queryClient.invalidateQueries({ queryKey: SYNC_STATUS_QUERY_KEY });
}
