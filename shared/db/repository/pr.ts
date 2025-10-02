import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../client";
import type {
  BasePRCurrent,
  PRCurrentInsert,
  PRHistoryInsert,
} from "../schema/pr";
import { pr_current, pr_history } from "../schema/pr";
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
          best_weight: data.best_weight,
          best_reps: data.best_reps,
          estimated_1rm: data.estimated_1rm,
          achieved_at: data.achieved_at,
          source: data.source,
          updated_at: new Date(),
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

  insertPRHistory: async (data: PRHistoryInsert) => {
    const id = generateUUID();
    const [inserted] = await db
      .insert(pr_history)
      .values({ id, ...data })
      .returning();
    return inserted;
  },

  getPRHistory: async (userId: string, exerciseId: string, limit = 100) => {
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

    return rows;
  },

  getTopPRs: async (userId: string, limit = 10) => {
    const rows = await db
      .select()
      .from(pr_current)
      .where(eq(pr_current.user_id, userId))
      .orderBy(desc(pr_current.estimated_1rm))
      .limit(limit);

    return rows;
  },
};

export default prRepository;
