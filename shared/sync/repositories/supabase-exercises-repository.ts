import type { ExerciseInsert } from "../../db/schema";
import type { SupportedLanguage } from "../../types/language";
import { DEFAULT_LANGUAGE } from "../../types/language";
import { BaseSupabaseRepository } from "./base-supabase-repository";

/** @deprecated Use SupportedLanguage from shared/types/language instead */
export type LanguageCode = SupportedLanguage;

export class SupabaseExercisesRepository extends BaseSupabaseRepository {
  /**
   * Obtiene todos los ejercicios del sistema con traducciones en el idioma especificado
   * Usa la función RPC get_exercises_with_translations de Supabase
   */
  async getSystemExercisesWithTranslations(
    languageCode: SupportedLanguage = DEFAULT_LANGUAGE
  ): Promise<ExerciseInsert[]> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_exercises_with_translations",
        { p_language_code: languageCode }
      );

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          `No se encontraron ejercicios con traducciones para idioma: ${languageCode}`
        );
      }

      // Filtrar solo ejercicios del sistema y mapear al formato ExerciseInsert
      return data
        .filter((ex: any) => ex.source === "system")
        .map((ex: any) => ({
          id: ex.id,
          name: ex.name,
          name_search: ex.name_search,
          source: ex.source,
          created_by_user_id: ex.created_by_user_id,
          main_muscle_group: ex.main_muscle_group,
          primary_equipment: ex.primary_equipment,
          exercise_type: ex.exercise_type,
          secondary_muscle_groups: ex.secondary_muscle_groups ?? [],
          instructions: ex.instructions ?? [],
          equipment: ex.equipment ?? [],
          similar_exercises: ex.similar_exercises,
          default_measurement_template:
            ex.default_measurement_template ?? "weight_reps",
        })) as ExerciseInsert[];
    } catch (error) {
      return await this.handleError(
        error,
        `get system exercises with translations (${languageCode})`
      );
    }
  }

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
