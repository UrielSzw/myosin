import { BaseExercise, ExerciseInBlockInsert } from "@/shared/db/schema";

export type ReorderExercise = ExerciseInBlockInsert & {
  tempId: string;
  exercise: BaseExercise;
};
