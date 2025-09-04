import { eq, isNull, sql } from "drizzle-orm";
import { db } from "../client";
import { exercise_in_block, routine_blocks, routines } from "../schema";
import type { BaseRoutine } from "../schema/routine";

export type RoutineWithMetrics = BaseRoutine & {
  blocksCount: number;
  exercisesCount: number;
};

export const routinesRepository = {
  findAllWithMetrics: async (
    folderId: string | null
  ): Promise<RoutineWithMetrics[]> => {
    const rows = await db
      .select({
        id: routines.id,
        name: routines.name,
        created_at: routines.created_at,
        updated_at: routines.updated_at,
        blocksCount: sql<number>`COUNT(DISTINCT ${routine_blocks.id})`,
        exercisesCount: sql<number>`COUNT(${exercise_in_block.id})`,
      })
      .from(routines)
      .leftJoin(routine_blocks, eq(routine_blocks.routine_id, routines.id))
      .leftJoin(
        exercise_in_block,
        eq(exercise_in_block.block_id, routine_blocks.id)
      )
      .where(
        folderId ? eq(routines.folder_id, folderId) : isNull(routines.folder_id)
      )
      .groupBy(routines.id);

    // Normalizar/asegurar tipos: algunos drivers pueden devolver counts como string
    const normalized: RoutineWithMetrics[] = rows.map((r: any) => ({
      ...r,
      blocksCount:
        typeof r.blocksCount === "number"
          ? r.blocksCount
          : Number(r.blocksCount || 0),
      exercisesCount:
        typeof r.exercisesCount === "number"
          ? r.exercisesCount
          : Number(r.exercisesCount || 0),
    }));

    return normalized;
  },
};
