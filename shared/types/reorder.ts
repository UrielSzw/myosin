import { BaseExercise, ExerciseInBlockInsert } from "@/shared/db/schema";

export type ReorderExercise = ExerciseInBlockInsert & {
  tempId: string;
  exercise: BaseExercise;
};

/**
 * Generic type for exercise data used in reorder components
 * Compatible with both routine-form and active-workout exercise types
 */
export type ReorderExerciseData = {
  tempId: string;
  exercise: BaseExercise;
  order_index: number;
};
