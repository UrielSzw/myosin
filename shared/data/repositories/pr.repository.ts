/**
 * PR Repository - Repositorio de Personal Records con sync automático
 *
 * Maneja los PRs actuales y el historial de PRs.
 */

import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db/client";
import type {
  BasePRCurrent,
  BasePRHistory,
  PRCurrentInsert,
  PRHistoryInsert,
} from "../../db/schema/pr";
import { pr_current, pr_history } from "../../db/schema/pr";
import { exercises } from "../../db/schema/routine";
import { generateUUID } from "../../db/utils/uuid";
import { getSyncAdapter } from "../core/sync-adapter";

// =============================================================================
// TYPES
// =============================================================================

export type { BasePRCurrent, BasePRHistory, PRCurrentInsert, PRHistoryInsert };

/** PR actual con info del ejercicio */
export type PRWithExerciseInfo = BasePRCurrent & {
  exercise_name: string;
  exercise_muscle: string | null;
};

// =============================================================================
// INTERFACE
// =============================================================================

export interface IPRRepository {
  // Queries
  getCurrentPRsForExercises(
    userId: string,
    exerciseIds: string[]
  ): Promise<Record<string, BasePRCurrent | null>>;
  getCurrentPR(
    userId: string,
    exerciseId: string
  ): Promise<BasePRCurrent | null>;
  getPRHistory(
    userId: string,
    exerciseId: string,
    limit?: number
  ): Promise<BasePRHistory[]>;
  getTopPRs(userId: string, limit?: number): Promise<PRWithExerciseInfo[]>;
  getAllCurrentPRsWithExerciseInfo(
    userId: string
  ): Promise<PRWithExerciseInfo[]>;

  // Mutations (con sync automático)
  upsertCurrentPR(data: PRCurrentInsert): Promise<BasePRCurrent>;
  insertPRHistory(data: PRHistoryInsert): Promise<BasePRHistory>;
}

// =============================================================================
// LOCAL REPOSITORY (SQLite only)
// =============================================================================

const localRepository = {
  async getCurrentPRsForExercises(
    userId: string,
    exerciseIds: string[]
  ): Promise<Record<string, BasePRCurrent | null>> {
    if (exerciseIds.length === 0) return {} as Record<string, null>;

    const rows = await db
      .select()
      .from(pr_current)
      .where(
        and(
          eq(pr_current.user_id, userId),
          inArray(pr_current.exercise_id, exerciseIds)
        )
      );

    const map: Record<string, BasePRCurrent | null> = {};
    exerciseIds.forEach((id) => (map[id] = null));
    rows.forEach((r: BasePRCurrent) => {
      map[r.exercise_id] = r;
    });

    return map;
  },

  async getCurrentPR(
    userId: string,
    exerciseId: string
  ): Promise<BasePRCurrent | null> {
    const [row] = await db
      .select()
      .from(pr_current)
      .where(
        and(
          eq(pr_current.user_id, userId),
          eq(pr_current.exercise_id, exerciseId)
        )
      );

    return (row as BasePRCurrent) || null;
  },

  async getPRHistory(
    userId: string,
    exerciseId: string,
    limit = 100
  ): Promise<BasePRHistory[]> {
    const rows = await db
      .select()
      .from(pr_history)
      .where(
        and(
          eq(pr_history.user_id, userId),
          eq(pr_history.exercise_id, exerciseId)
        )
      )
      .orderBy(desc(pr_history.created_at))
      .limit(limit);

    return rows as BasePRHistory[];
  },

  async getTopPRs(userId: string, limit = 10): Promise<PRWithExerciseInfo[]> {
    const rows = await db
      .select({
        id: pr_current.id,
        user_id: pr_current.user_id,
        exercise_id: pr_current.exercise_id,
        measurement_template: pr_current.measurement_template,
        best_primary_value: pr_current.best_primary_value,
        best_secondary_value: pr_current.best_secondary_value,
        pr_score: pr_current.pr_score,
        achieved_at: pr_current.achieved_at,
        source: pr_current.source,
        created_at: pr_current.created_at,
        updated_at: pr_current.updated_at,
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(eq(pr_current.user_id, userId))
      .orderBy(desc(pr_current.pr_score))
      .limit(limit);

    return rows as PRWithExerciseInfo[];
  },

  async getAllCurrentPRsWithExerciseInfo(
    userId: string
  ): Promise<PRWithExerciseInfo[]> {
    const rows = await db
      .select({
        id: pr_current.id,
        user_id: pr_current.user_id,
        exercise_id: pr_current.exercise_id,
        measurement_template: pr_current.measurement_template,
        best_primary_value: pr_current.best_primary_value,
        best_secondary_value: pr_current.best_secondary_value,
        pr_score: pr_current.pr_score,
        achieved_at: pr_current.achieved_at,
        source: pr_current.source,
        created_at: pr_current.created_at,
        updated_at: pr_current.updated_at,
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(eq(pr_current.user_id, userId))
      .orderBy(desc(pr_current.pr_score));

    return rows as PRWithExerciseInfo[];
  },

  async upsertCurrentPR(data: PRCurrentInsert): Promise<BasePRCurrent> {
    const [existing] = await db
      .select()
      .from(pr_current)
      .where(
        and(
          eq(pr_current.user_id, data.user_id),
          eq(pr_current.exercise_id, data.exercise_id)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(pr_current)
        .set({
          measurement_template: data.measurement_template,
          best_primary_value: data.best_primary_value,
          best_secondary_value: data.best_secondary_value,
          pr_score: data.pr_score,
          achieved_at: data.achieved_at,
          source: data.source,
          updated_at: new Date().toISOString(),
        })
        .where(eq(pr_current.id, existing.id))
        .returning();

      return updated as BasePRCurrent;
    }

    const id = generateUUID();
    const [inserted] = await db
      .insert(pr_current)
      .values({ id, ...data })
      .returning();

    return inserted as BasePRCurrent;
  },

  async insertPRHistory(data: PRHistoryInsert): Promise<BasePRHistory> {
    const id = generateUUID();
    const [inserted] = await db
      .insert(pr_history)
      .values({ id, ...data })
      .returning();
    return inserted as BasePRHistory;
  },
};

// =============================================================================
// SYNC ADAPTER
// =============================================================================

const syncAdapter = getSyncAdapter();

// =============================================================================
// SYNCED REPOSITORY
// =============================================================================

export const createPRRepository = (): IPRRepository => {
  return {
    // Queries (sin sync)
    getCurrentPRsForExercises: localRepository.getCurrentPRsForExercises,
    getCurrentPR: localRepository.getCurrentPR,
    getPRHistory: localRepository.getPRHistory,
    getTopPRs: localRepository.getTopPRs,
    getAllCurrentPRsWithExerciseInfo:
      localRepository.getAllCurrentPRsWithExerciseInfo,

    // Mutations (con sync automático)
    async upsertCurrentPR(data: PRCurrentInsert): Promise<BasePRCurrent> {
      // 1. SQLite local
      const result = await localRepository.upsertCurrentPR(data);

      // 2. Sync automático
      syncAdapter.sync("PR_CREATE", data);

      return result;
    },

    async insertPRHistory(data: PRHistoryInsert): Promise<BasePRHistory> {
      // 1. SQLite local
      const result = await localRepository.insertPRHistory(data);

      // 2. Sync automático
      syncAdapter.sync("PR_UPDATE", data);

      return result;
    },
  };
};

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const prRepository = createPRRepository();
