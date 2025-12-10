import { and, eq, inArray } from "drizzle-orm";
import { db } from "../client";
import {
  exerciseProgressions,
  progressionPathExercises,
  progressionPaths,
  userExerciseUnlocks,
  type ExerciseProgression,
  type ExerciseProgressionInsert,
  type ProgressionPath,
  type ProgressionPathCategory,
  type ProgressionPathExercise,
  type ProgressionPathExerciseInsert,
  type ProgressionPathInsert,
  type UnlockProgress,
  type UserExerciseUnlock,
  type UserExerciseUnlockInsert,
  type UserExerciseUnlockStatus,
} from "../schema/progressions";
import { generateUUID } from "../utils/uuid";

// ============================================================================
// EXERCISE PROGRESSIONS REPOSITORY (read-only catalog)
// ============================================================================

export const exerciseProgressionsRepository = {
  /**
   * Get all progressions FROM a specific exercise (what can be unlocked next)
   */
  getProgressionsFrom: async (
    exerciseId: string
  ): Promise<ExerciseProgression[]> => {
    const rows = await db
      .select()
      .from(exerciseProgressions)
      .where(eq(exerciseProgressions.from_exercise_id, exerciseId));

    return rows;
  },

  /**
   * Get all progressions TO a specific exercise (what's easier/prerequisite)
   */
  getProgressionsTo: async (
    exerciseId: string
  ): Promise<ExerciseProgression[]> => {
    const rows = await db
      .select()
      .from(exerciseProgressions)
      .where(eq(exerciseProgressions.to_exercise_id, exerciseId));

    return rows;
  },

  /**
   * Get progression between two specific exercises
   */
  getProgression: async (
    fromExerciseId: string,
    toExerciseId: string
  ): Promise<ExerciseProgression | null> => {
    const [row] = await db
      .select()
      .from(exerciseProgressions)
      .where(
        and(
          eq(exerciseProgressions.from_exercise_id, fromExerciseId),
          eq(exerciseProgressions.to_exercise_id, toExerciseId)
        )
      );

    return row || null;
  },

  /**
   * Get all progressions (for initial sync)
   */
  findAll: async (): Promise<ExerciseProgression[]> => {
    return await db.select().from(exerciseProgressions);
  },

  /**
   * Check if exercise has any progressions defined
   */
  hasProgressions: async (exerciseId: string): Promise<boolean> => {
    const [fromRow] = await db
      .select({ id: exerciseProgressions.id })
      .from(exerciseProgressions)
      .where(eq(exerciseProgressions.from_exercise_id, exerciseId))
      .limit(1);

    if (fromRow) return true;

    const [toRow] = await db
      .select({ id: exerciseProgressions.id })
      .from(exerciseProgressions)
      .where(eq(exerciseProgressions.to_exercise_id, exerciseId))
      .limit(1);

    return !!toRow;
  },

  /**
   * Bulk insert progressions (for sync)
   */
  bulkInsert: async (data: ExerciseProgressionInsert[]): Promise<void> => {
    if (data.length === 0) return;

    await db
      .insert(exerciseProgressions)
      .values(data)
      .onConflictDoUpdate({
        target: exerciseProgressions.id,
        set: {
          from_exercise_id: exerciseProgressions.from_exercise_id,
          to_exercise_id: exerciseProgressions.to_exercise_id,
          relationship_type: exerciseProgressions.relationship_type,
          unlock_criteria: exerciseProgressions.unlock_criteria,
          difficulty_delta: exerciseProgressions.difficulty_delta,
          notes: exerciseProgressions.notes,
          source: exerciseProgressions.source,
          updated_at: new Date().toISOString(),
        },
      });
  },

  /**
   * Clear all progressions (for re-sync)
   */
  deleteAll: async (): Promise<void> => {
    await db.delete(exerciseProgressions);
  },
};

// ============================================================================
// PROGRESSION PATHS REPOSITORY (read-only catalog)
// ============================================================================

export const progressionPathsRepository = {
  /**
   * Get all paths
   */
  findAll: async (): Promise<ProgressionPath[]> => {
    return await db.select().from(progressionPaths);
  },

  /**
   * Get path by slug
   */
  getBySlug: async (slug: string): Promise<ProgressionPath | null> => {
    const [row] = await db
      .select()
      .from(progressionPaths)
      .where(eq(progressionPaths.slug, slug));

    return row || null;
  },

  /**
   * Get path by ID
   */
  getById: async (id: string): Promise<ProgressionPath | null> => {
    const [row] = await db
      .select()
      .from(progressionPaths)
      .where(eq(progressionPaths.id, id));

    return row || null;
  },

  /**
   * Get paths by category
   */
  getByCategory: async (
    category: ProgressionPathCategory
  ): Promise<ProgressionPath[]> => {
    return await db
      .select()
      .from(progressionPaths)
      .where(eq(progressionPaths.category, category));
  },

  /**
   * Get paths that contain a specific exercise
   */
  getPathsForExercise: async (
    exerciseId: string
  ): Promise<ProgressionPath[]> => {
    const pathExercises = await db
      .select({ path_id: progressionPathExercises.path_id })
      .from(progressionPathExercises)
      .where(eq(progressionPathExercises.exercise_id, exerciseId));

    if (pathExercises.length === 0) return [];

    const pathIds = pathExercises.map((pe) => pe.path_id);
    return await db
      .select()
      .from(progressionPaths)
      .where(inArray(progressionPaths.id, pathIds));
  },

  /**
   * Bulk insert paths (for sync)
   */
  bulkInsert: async (data: ProgressionPathInsert[]): Promise<void> => {
    if (data.length === 0) return;

    await db
      .insert(progressionPaths)
      .values(data)
      .onConflictDoUpdate({
        target: progressionPaths.id,
        set: {
          slug: progressionPaths.slug,
          name_key: progressionPaths.name_key,
          description_key: progressionPaths.description_key,
          category: progressionPaths.category,
          ultimate_exercise_id: progressionPaths.ultimate_exercise_id,
          icon: progressionPaths.icon,
          color: progressionPaths.color,
          updated_at: new Date().toISOString(),
        },
      });
  },

  /**
   * Clear all paths (for re-sync)
   */
  deleteAll: async (): Promise<void> => {
    await db.delete(progressionPaths);
  },
};

// ============================================================================
// PROGRESSION PATH EXERCISES REPOSITORY (read-only catalog)
// ============================================================================

export const progressionPathExercisesRepository = {
  /**
   * Get exercises for a path, ordered by level
   */
  getExercisesForPath: async (
    pathId: string
  ): Promise<ProgressionPathExercise[]> => {
    return await db
      .select()
      .from(progressionPathExercises)
      .where(eq(progressionPathExercises.path_id, pathId))
      .orderBy(progressionPathExercises.level);
  },

  /**
   * Get all path exercises (for initial sync)
   */
  findAll: async (): Promise<ProgressionPathExercise[]> => {
    return await db.select().from(progressionPathExercises);
  },

  /**
   * Get paths and levels for a specific exercise
   */
  getPathInfoForExercise: async (
    exerciseId: string
  ): Promise<
    { path_id: string; level: number; is_main_path: boolean | null }[]
  > => {
    return await db
      .select({
        path_id: progressionPathExercises.path_id,
        level: progressionPathExercises.level,
        is_main_path: progressionPathExercises.is_main_path,
      })
      .from(progressionPathExercises)
      .where(eq(progressionPathExercises.exercise_id, exerciseId));
  },

  /**
   * Bulk insert (for sync)
   */
  bulkInsert: async (data: ProgressionPathExerciseInsert[]): Promise<void> => {
    if (data.length === 0) return;

    await db
      .insert(progressionPathExercises)
      .values(data)
      .onConflictDoUpdate({
        target: progressionPathExercises.id,
        set: {
          path_id: progressionPathExercises.path_id,
          exercise_id: progressionPathExercises.exercise_id,
          level: progressionPathExercises.level,
          is_main_path: progressionPathExercises.is_main_path,
          updated_at: new Date().toISOString(),
        },
      });
  },

  /**
   * Clear all (for re-sync)
   */
  deleteAll: async (): Promise<void> => {
    await db.delete(progressionPathExercises);
  },
};

// ============================================================================
// USER EXERCISE UNLOCKS REPOSITORY (user data, synced bidirectionally)
// ============================================================================

export const userExerciseUnlocksRepository = {
  /**
   * Get unlock status for a specific exercise
   */
  getUnlock: async (
    userId: string,
    exerciseId: string
  ): Promise<UserExerciseUnlock | null> => {
    const [row] = await db
      .select()
      .from(userExerciseUnlocks)
      .where(
        and(
          eq(userExerciseUnlocks.user_id, userId),
          eq(userExerciseUnlocks.exercise_id, exerciseId)
        )
      );

    return row || null;
  },

  /**
   * Get all unlocks for a user
   */
  getAllForUser: async (userId: string): Promise<UserExerciseUnlock[]> => {
    return await db
      .select()
      .from(userExerciseUnlocks)
      .where(eq(userExerciseUnlocks.user_id, userId));
  },

  /**
   * Get unlocks for multiple exercises
   */
  getUnlocksForExercises: async (
    userId: string,
    exerciseIds: string[]
  ): Promise<Record<string, UserExerciseUnlock | null>> => {
    if (exerciseIds.length === 0) return {};

    const rows = await db
      .select()
      .from(userExerciseUnlocks)
      .where(
        and(
          eq(userExerciseUnlocks.user_id, userId),
          inArray(userExerciseUnlocks.exercise_id, exerciseIds)
        )
      );

    const map: Record<string, UserExerciseUnlock | null> = {};
    exerciseIds.forEach((id) => (map[id] = null));
    rows.forEach((r) => {
      map[r.exercise_id] = r;
    });

    return map;
  },

  /**
   * Get unlocks by status
   */
  getByStatus: async (
    userId: string,
    status: UserExerciseUnlockStatus
  ): Promise<UserExerciseUnlock[]> => {
    return await db
      .select()
      .from(userExerciseUnlocks)
      .where(
        and(
          eq(userExerciseUnlocks.user_id, userId),
          eq(userExerciseUnlocks.status, status)
        )
      );
  },

  /**
   * Create or update an unlock
   */
  upsert: async (
    userId: string,
    exerciseId: string,
    data: {
      status?: UserExerciseUnlockStatus;
      unlocked_at?: string;
      unlocked_by_exercise_id?: string;
      unlocked_by_pr_id?: string;
      current_progress?: UnlockProgress | null;
      manually_unlocked?: boolean;
      manually_unlocked_at?: string;
    }
  ): Promise<UserExerciseUnlock> => {
    const existing = await userExerciseUnlocksRepository.getUnlock(
      userId,
      exerciseId
    );

    if (existing) {
      const [updated] = await db
        .update(userExerciseUnlocks)
        .set({
          ...data,
          is_synced: false,
          updated_at: new Date().toISOString(),
        })
        .where(eq(userExerciseUnlocks.id, existing.id))
        .returning();

      return updated!;
    }

    const id = generateUUID();
    const [inserted] = await db
      .insert(userExerciseUnlocks)
      .values({
        id,
        user_id: userId,
        exercise_id: exerciseId,
        status: data.status || "locked",
        ...data,
        is_synced: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returning();

    return inserted!;
  },

  /**
   * Mark exercise as unlocked
   */
  markUnlocked: async (
    userId: string,
    exerciseId: string,
    unlockedByExerciseId?: string,
    unlockedByPrId?: string
  ): Promise<UserExerciseUnlock> => {
    return await userExerciseUnlocksRepository.upsert(userId, exerciseId, {
      status: "unlocked",
      unlocked_at: new Date().toISOString(),
      unlocked_by_exercise_id: unlockedByExerciseId,
      unlocked_by_pr_id: unlockedByPrId,
      current_progress: {
        current_value: 100,
        target_value: 100,
        percentage: 100,
      },
    });
  },

  /**
   * Mark exercise as mastered
   */
  markMastered: async (
    userId: string,
    exerciseId: string
  ): Promise<UserExerciseUnlock> => {
    return await userExerciseUnlocksRepository.upsert(userId, exerciseId, {
      status: "mastered",
    });
  },

  /**
   * Manually unlock an exercise
   */
  manuallyUnlock: async (
    userId: string,
    exerciseId: string
  ): Promise<UserExerciseUnlock> => {
    return await userExerciseUnlocksRepository.upsert(userId, exerciseId, {
      status: "unlocked",
      manually_unlocked: true,
      manually_unlocked_at: new Date().toISOString(),
    });
  },

  /**
   * Update progress towards an unlock
   */
  updateProgress: async (
    userId: string,
    exerciseId: string,
    progress: UnlockProgress
  ): Promise<UserExerciseUnlock> => {
    const status: UserExerciseUnlockStatus =
      progress.percentage >= 100
        ? "unlocked"
        : progress.percentage > 50
        ? "unlocking"
        : "locked";

    return await userExerciseUnlocksRepository.upsert(userId, exerciseId, {
      status,
      current_progress: progress,
      unlocked_at: status === "unlocked" ? new Date().toISOString() : undefined,
    });
  },

  /**
   * Get unsynced unlocks
   */
  getUnsynced: async (userId: string): Promise<UserExerciseUnlock[]> => {
    return await db
      .select()
      .from(userExerciseUnlocks)
      .where(
        and(
          eq(userExerciseUnlocks.user_id, userId),
          eq(userExerciseUnlocks.is_synced, false)
        )
      );
  },

  /**
   * Mark as synced
   */
  markAsSynced: async (ids: string[]): Promise<void> => {
    if (ids.length === 0) return;

    await db
      .update(userExerciseUnlocks)
      .set({ is_synced: true })
      .where(inArray(userExerciseUnlocks.id, ids));
  },

  /**
   * Bulk insert (for sync from server)
   */
  bulkInsert: async (data: UserExerciseUnlockInsert[]): Promise<void> => {
    if (data.length === 0) return;

    for (const unlock of data) {
      await db
        .insert(userExerciseUnlocks)
        .values(unlock)
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
            updated_at: new Date().toISOString(),
          },
        });
    }
  },
};

// ============================================================================
// CONVENIENCE FUNCTIONS (for use in sync hooks)
// ============================================================================

/**
 * Get unsynced unlocks for a user (wrapper for sync hook)
 */
export const getUnsyncedUnlocks = async (
  userId: string
): Promise<UserExerciseUnlockInsert[]> => {
  const unlocks = await userExerciseUnlocksRepository.getUnsynced(userId);
  return unlocks.map((u) => ({
    id: u.id,
    user_id: u.user_id,
    exercise_id: u.exercise_id,
    status: u.status,
    unlocked_at: u.unlocked_at,
    unlocked_by_exercise_id: u.unlocked_by_exercise_id,
    unlocked_by_pr_id: u.unlocked_by_pr_id,
    current_progress: u.current_progress,
    manually_unlocked: u.manually_unlocked,
    manually_unlocked_at: u.manually_unlocked_at,
    is_synced: u.is_synced,
    created_at: u.created_at,
    updated_at: u.updated_at,
  }));
};

/**
 * Mark unlocks as synced (wrapper for sync hook)
 */
export const markUnlocksAsSynced = async (ids: string[]): Promise<void> => {
  await userExerciseUnlocksRepository.markAsSynced(ids);
};
