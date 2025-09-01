import { eq, isNull, sql } from "drizzle-orm";
import { db } from "../client";
import { exercise_in_block, routine_blocks, routines } from "../schema";

export const routinesRepository = {
  findAllWithMetrics: async (folderId?: string) => {
    const result = await db
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

    return result;
  },
};
