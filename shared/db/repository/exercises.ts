import { db } from "../client";
import { BaseExercise, exercises } from "../schema";

export const exercisesRepository = {
  findAll: async (): Promise<BaseExercise[]> => {
    const rows = await db.select().from(exercises);

    return rows as BaseExercise[];
  },
};
