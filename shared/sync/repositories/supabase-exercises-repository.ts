import type { ExerciseInsert } from "../../db/schema";
import { BaseSupabaseRepository } from "./base-supabase-repository";

export class SupabaseExercisesRepository extends BaseSupabaseRepository {
  async getAllSystemExercises(): Promise<ExerciseInsert[]> {
    try {
      const { data, error } = await this.supabase
        .from("exercises")
        .select("*")
        .eq("source", "system")
        .order("name");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("No se encontraron ejercicios del sistema en Supabase");
      }

      return data as ExerciseInsert[];
    } catch (error) {
      return await this.handleError(error, "get all system exercises");
    }
  }

  async getExercisesByMuscleGroup(
    muscleGroup: string
  ): Promise<ExerciseInsert[]> {
    try {
      const { data, error } = await this.supabase
        .from("exercises")
        .select("*")
        .eq("source", "system")
        .eq("main_muscle_group", muscleGroup)
        .order("name");

      if (error) throw error;
      return data as ExerciseInsert[];
    } catch (error) {
      return await this.handleError(
        error,
        `get exercises for muscle group: ${muscleGroup}`
      );
    }
  }

  async getExerciseById(exerciseId: string): Promise<ExerciseInsert | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercises")
        .select("*")
        .eq("id", exerciseId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // No rows found
        throw error;
      }

      return data as ExerciseInsert;
    } catch (error) {
      return await this.handleError(error, `get exercise by id: ${exerciseId}`);
    }
  }
}
