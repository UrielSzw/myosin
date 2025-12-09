import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../client";
import type {
  BasePRCurrent,
  BasePRHistory,
  PRCurrentInsert,
  PRHistoryInsert,
} from "../schema/pr";
import { pr_current, pr_history } from "../schema/pr";
import { exercises } from "../schema/routine";
import { generateUUID } from "../utils/uuid";

export const prRepository = {
  getCurrentPRsForExercises: async (
    userId: string,
    exerciseIds: string[]
  ): Promise<Record<string, BasePRCurrent | null>> => {
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

  getCurrentPR: async (
    userId: string,
    exerciseId: string
  ): Promise<BasePRCurrent | null> => {
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

  upsertCurrentPR: async (data: PRCurrentInsert): Promise<BasePRCurrent> => {
    // If there's an existing row for user+exercise, update it; otherwise insert
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
          updated_at: new Date()?.toISOString(),
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

  insertPRHistory: async (data: PRHistoryInsert): Promise<BasePRHistory> => {
    const id = generateUUID();
    const [inserted] = await db
      .insert(pr_history)
      .values({ id, ...data })
      .returning();
    return inserted as BasePRHistory;
  },

  getPRHistory: async (
    userId: string,
    exerciseId: string,
    limit = 100
  ): Promise<BasePRHistory[]> => {
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

  getTopPRs: async (userId: string, limit = 10) => {
    const rows = await db
      .select({
        // Campos de pr_current
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
        // Campos de exercises
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(eq(pr_current.user_id, userId))
      .orderBy(desc(pr_current.pr_score))
      .limit(limit);

    return rows;
  },

  getAllCurrentPRsWithExerciseInfo: async (userId: string) => {
    const rows = await db
      .select({
        // Campos de pr_current
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
        // Campos de exercises
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(eq(pr_current.user_id, userId))
      .orderBy(desc(pr_current.achieved_at)); // Order by most recent

    return rows;
  },

  searchPRsByName: async (userId: string, searchQuery: string) => {
    const rows = await db
      .select({
        // Campos de pr_current
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
        // Campos de exercises
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(eq(pr_current.user_id, userId))
      .orderBy(desc(pr_current.achieved_at));

    // Filter by name in JavaScript since SQLite LIKE case sensitivity can vary
    return rows.filter((row) =>
      row.exercise_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  filterPRsByMuscleGroups: async (userId: string, muscleGroups: string[]) => {
    if (muscleGroups.length === 0) {
      return await prRepository.getAllCurrentPRsWithExerciseInfo(userId);
    }

    const rows = await db
      .select({
        // Campos de pr_current
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
        // Campos de exercises
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(
        and(
          eq(pr_current.user_id, userId),
          inArray(exercises.main_muscle_group, muscleGroups as any)
        )
      )
      .orderBy(desc(pr_current.achieved_at));

    return rows;
  },

  getPRHistoryDetailed: async (
    userId: string,
    exerciseId: string,
    limit = 100
  ) => {
    const [currentPR] = await db
      .select({
        // Campos de pr_current
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
        // Campos de exercises
        exercise_name: exercises.name,
        exercise_muscle: exercises.main_muscle_group,
      })
      .from(pr_current)
      .innerJoin(exercises, eq(pr_current.exercise_id, exercises.id))
      .where(
        and(
          eq(pr_current.user_id, userId),
          eq(pr_current.exercise_id, exerciseId)
        )
      );

    const history = await db
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

    return {
      currentPR,
      history: history as BasePRHistory[],
      exerciseInfo: currentPR
        ? {
            name: currentPR.exercise_name,
            muscleGroup: currentPR.exercise_muscle,
          }
        : null,
    };
  },
};

export default prRepository;
