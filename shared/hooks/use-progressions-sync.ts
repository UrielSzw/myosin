import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { db } from "../db/client";
import {
  exerciseProgressions,
  progressionPathExercises,
  progressionPaths,
  userExerciseUnlocks,
} from "../db/schema/progressions";
import { SupabaseProgressionsRepository } from "../sync/repositories/supabase-progressions-repository";

// ============================================================================
// Constants
// ============================================================================

const LAST_PROGRESSIONS_SYNC_KEY = "last_progressions_sync";
const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================================
// Types
// ============================================================================

export interface ProgressionsSyncState {
  isSyncing: boolean;
  lastSyncTimestamp: number | null;
  error: Error | null;
}

export interface ProgressionsSyncOptions {
  /** Force sync ignoring time interval */
  force?: boolean;
}

export interface ProgressionsSyncResult {
  success: boolean;
  syncedProgressions: number;
  syncedPaths: number;
  syncedPathExercises: number;
  skipped: boolean;
  error?: Error;
}

export interface UserUnlocksSyncResult {
  success: boolean;
  syncedCount: number;
  error?: Error;
}

// ============================================================================
// Service (pure logic, no hooks)
// ============================================================================

const supabaseProgressionsRepo = new SupabaseProgressionsRepository();

/**
 * Check if sync is needed based on timestamp
 */
export const checkProgressionsSyncNeeded = async (): Promise<{
  needed: boolean;
  reason: "expired" | "never_synced" | null;
}> => {
  const lastSyncStr = await AsyncStorage.getItem(LAST_PROGRESSIONS_SYNC_KEY);

  if (!lastSyncStr) {
    return { needed: true, reason: "never_synced" };
  }

  const lastSync = parseInt(lastSyncStr, 10);
  const timeSinceLastSync = Date.now() - lastSync;

  if (timeSinceLastSync >= SYNC_INTERVAL_MS) {
    return { needed: true, reason: "expired" };
  }

  return { needed: false, reason: null };
};

/**
 * Get time remaining until next sync in hours
 */
export const getTimeUntilNextProgressionsSync = async (): Promise<
  number | null
> => {
  const lastSyncStr = await AsyncStorage.getItem(LAST_PROGRESSIONS_SYNC_KEY);

  if (!lastSyncStr) return null;

  const lastSync = parseInt(lastSyncStr, 10);
  const timeSinceLastSync = Date.now() - lastSync;
  const timeRemaining = SYNC_INTERVAL_MS - timeSinceLastSync;

  if (timeRemaining <= 0) return 0;

  return Math.ceil(timeRemaining / (60 * 60 * 1000));
};

/**
 * Sync progressions catalog (progressions, paths, path_exercises)
 * This is read-only catalog data from Supabase
 */
export const syncProgressionsCatalog = async (
  options: { force?: boolean } = {}
): Promise<ProgressionsSyncResult> => {
  const { force = false } = options;

  try {
    // Check if sync is needed
    if (!force) {
      const { needed } = await checkProgressionsSyncNeeded();

      if (!needed) {
        return {
          success: true,
          syncedProgressions: 0,
          syncedPaths: 0,
          syncedPathExercises: 0,
          skipped: true,
        };
      }
    }

    // Fetch progressions from Supabase
    const progressionsData =
      await supabaseProgressionsRepo.getAllProgressions();

    // Fetch paths with exercises from Supabase
    const { paths, pathExercises } =
      await supabaseProgressionsRepo.getAllPathsWithExercises();

    // Sync progressions
    for (const p of progressionsData) {
      await db
        .insert(exerciseProgressions)
        .values(p)
        .onConflictDoUpdate({
          target: exerciseProgressions.id,
          set: {
            from_exercise_id: p.from_exercise_id,
            to_exercise_id: p.to_exercise_id,
            relationship_type: p.relationship_type,
            unlock_criteria: p.unlock_criteria,
            difficulty_delta: p.difficulty_delta,
            notes: p.notes,
            source: p.source,
            updated_at: p.updated_at,
          },
        });
    }

    // Sync paths
    for (const path of paths) {
      await db
        .insert(progressionPaths)
        .values(path)
        .onConflictDoUpdate({
          target: progressionPaths.id,
          set: {
            slug: path.slug,
            name_key: path.name_key,
            description_key: path.description_key,
            category: path.category,
            ultimate_exercise_id: path.ultimate_exercise_id,
            icon: path.icon,
            color: path.color,
            updated_at: path.updated_at,
          },
        });
    }

    // Sync path exercises
    for (const pe of pathExercises) {
      await db
        .insert(progressionPathExercises)
        .values(pe)
        .onConflictDoUpdate({
          target: progressionPathExercises.id,
          set: {
            path_id: pe.path_id,
            exercise_id: pe.exercise_id,
            level: pe.level,
            is_main_path: pe.is_main_path,
            updated_at: pe.updated_at,
          },
        });
    }

    // Save sync timestamp
    const now = Date.now();
    await AsyncStorage.setItem(LAST_PROGRESSIONS_SYNC_KEY, now.toString());

    return {
      success: true,
      syncedProgressions: progressionsData.length,
      syncedPaths: paths.length,
      syncedPathExercises: pathExercises.length,
      skipped: false,
    };
  } catch (error) {
    console.error("❌ Error syncing progressions catalog:", error);
    return {
      success: false,
      syncedProgressions: 0,
      syncedPaths: 0,
      syncedPathExercises: 0,
      skipped: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

/**
 * Sync user unlocks from Supabase to local SQLite
 * Called when user logs in or when doing a full sync
 */
export const syncUserUnlocksFromSupabase = async (
  userId: string
): Promise<UserUnlocksSyncResult> => {
  try {
    const unlocks = await supabaseProgressionsRepo.getUserUnlocks(userId);

    for (const unlock of unlocks) {
      await db
        .insert(userExerciseUnlocks)
        .values({
          ...unlock,
          is_synced: true,
        })
        .onConflictDoUpdate({
          target: [
            userExerciseUnlocks.user_id,
            userExerciseUnlocks.exercise_id,
          ],
          set: {
            status: unlock.status,
            unlocked_at: unlock.unlocked_at,
            unlocked_by_exercise_id: unlock.unlocked_by_exercise_id,
            unlocked_by_pr_id: unlock.unlocked_by_pr_id,
            current_progress: unlock.current_progress,
            manually_unlocked: unlock.manually_unlocked,
            manually_unlocked_at: unlock.manually_unlocked_at,
            is_synced: true,
            updated_at: unlock.updated_at,
          },
        });
    }

    return {
      success: true,
      syncedCount: unlocks.length,
    };
  } catch (error) {
    console.error("❌ Error syncing user unlocks from Supabase:", error);
    return {
      success: false,
      syncedCount: 0,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

/**
 * Push local unsynced unlocks to Supabase
 * Called periodically or when connectivity is restored
 */
export const pushUnsyncedUnlocksToSupabase = async (
  userId: string
): Promise<UserUnlocksSyncResult> => {
  try {
    // Get unsynced local unlocks
    const { getUnsyncedUnlocks, markUnlocksAsSynced } = await import(
      "../db/repository/progressions"
    );

    const unsyncedUnlocks = await getUnsyncedUnlocks(userId);

    if (unsyncedUnlocks.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    // Push to Supabase
    const result = await supabaseProgressionsRepo.batchUpsertUserUnlocks(
      unsyncedUnlocks
    );

    if (!result.success) {
      return {
        success: false,
        syncedCount: 0,
        error: new Error(result.error),
      };
    }

    // Mark as synced locally
    const unlockIds = unsyncedUnlocks
      .map((u) => u.id)
      .filter(Boolean) as string[];
    await markUnlocksAsSynced(unlockIds);

    return {
      success: true,
      syncedCount: unsyncedUnlocks.length,
    };
  } catch (error) {
    console.error("❌ Error pushing unlocks to Supabase:", error);
    return {
      success: false,
      syncedCount: 0,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for syncing progressions data.
 *
 * @example
 * ```tsx
 * const { syncProgressions, syncUserUnlocks, isSyncing } = useProgressionsSync();
 *
 * // Sync catalog data (progressions, paths)
 * await syncProgressions();
 *
 * // Sync user unlocks
 * await syncUserUnlocks(userId);
 * ```
 */
export const useProgressionsSync = () => {
  const [state, setState] = useState<ProgressionsSyncState>({
    isSyncing: false,
    lastSyncTimestamp: null,
    error: null,
  });

  const syncProgressions = useCallback(
    async (
      options: ProgressionsSyncOptions = {}
    ): Promise<ProgressionsSyncResult> => {
      setState((prev) => ({ ...prev, isSyncing: true, error: null }));

      try {
        const result = await syncProgressionsCatalog(options);

        if (result.success && !result.skipped) {
          setState((prev) => ({
            ...prev,
            isSyncing: false,
            lastSyncTimestamp: Date.now(),
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isSyncing: false,
            error: result.error || null,
          }));
        }

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          isSyncing: false,
          error: err,
        }));

        return {
          success: false,
          syncedProgressions: 0,
          syncedPaths: 0,
          syncedPathExercises: 0,
          skipped: false,
          error: err,
        };
      }
    },
    []
  );

  const syncUserUnlocks = useCallback(
    async (userId: string): Promise<UserUnlocksSyncResult> => {
      setState((prev) => ({ ...prev, isSyncing: true, error: null }));

      try {
        // First pull from Supabase
        const pullResult = await syncUserUnlocksFromSupabase(userId);

        // Then push local changes
        const pushResult = await pushUnsyncedUnlocksToSupabase(userId);

        setState((prev) => ({
          ...prev,
          isSyncing: false,
          error: pullResult.error || pushResult.error || null,
        }));

        return {
          success: pullResult.success && pushResult.success,
          syncedCount: pullResult.syncedCount + pushResult.syncedCount,
          error: pullResult.error || pushResult.error,
        };
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          isSyncing: false,
          error: err,
        }));

        return {
          success: false,
          syncedCount: 0,
          error: err,
        };
      }
    },
    []
  );

  return {
    ...state,
    syncProgressions,
    syncUserUnlocks,
  };
};
