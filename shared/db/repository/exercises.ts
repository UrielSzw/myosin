import { eq } from "drizzle-orm";
import { db } from "../client";
import { BaseExercise, exercises } from "../schema";

export const exercisesRepository = {
  findAll: async (): Promise<BaseExercise[]> => {
    const rows = await db.select().from(exercises);

    return rows as BaseExercise[];
  },

  findById: async (id: string): Promise<BaseExercise | null> => {
    const rows = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id))
      .limit(1);

    return (rows[0] as BaseExercise) ?? null;
  },
};
