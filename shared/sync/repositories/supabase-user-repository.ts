import type { BaseUserPreferences } from "../../db/schema/user";
import { DEFAULT_LANGUAGE } from "../../types/language";
import { BaseSupabaseRepository } from "./base-supabase-repository";

export class SupabaseUserRepository extends BaseSupabaseRepository {
  async createUserPreferences(
    userId: string,
    data: Partial<BaseUserPreferences>
  ): Promise<BaseUserPreferences> {
    try {
      const { data: result, error } = await this.supabase
        .from("user_preferences")
        .insert({
          user_id: userId,
          theme: data.theme || "dark",
          weight_unit: data.weight_unit || "kg",
          distance_unit: data.distance_unit || "metric",
          language: data.language || DEFAULT_LANGUAGE,
          show_rpe: data.show_rpe ?? false,
          show_tempo: data.show_tempo ?? false,
          keep_screen_awake: data.keep_screen_awake ?? true,
          haptic_feedback_enabled: data.haptic_feedback_enabled ?? true,
          default_rest_time_seconds: data.default_rest_time_seconds ?? 60,
        })
        .select()
        .single();

      if (error) throw error;
      return result as BaseUserPreferences;
    } catch (error) {
      return await this.handleError(error, "create user preferences");
    }
  }

  async updateUserPreferences(
    userId: string,
    data: Partial<BaseUserPreferences>
  ): Promise<BaseUserPreferences> {
    try {
      // Primero verificar si existe la fila
      const { data: existing } = await this.supabase
        .from("user_preferences")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        // UPDATE - la fila existe
        const { data: result, error } = await this.supabase
          .from("user_preferences")
          .update({
            theme: data.theme,
            weight_unit: data.weight_unit,
            distance_unit: data.distance_unit,
            language: data.language,
            show_rpe: data.show_rpe,
            show_tempo: data.show_tempo,
            keep_screen_awake: data.keep_screen_awake,
            haptic_feedback_enabled: data.haptic_feedback_enabled,
            default_rest_time_seconds: data.default_rest_time_seconds,
            // Onboarding fields
            biological_sex: data.biological_sex,
            birth_date: data.birth_date,
            height_cm: data.height_cm,
            initial_weight_kg: data.initial_weight_kg,
            fitness_goal: data.fitness_goal,
            activity_level: data.activity_level,
            onboarding_completed: data.onboarding_completed,
            onboarding_completed_at: data.onboarding_completed_at,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;
        return result as BaseUserPreferences;
      } else {
        // INSERT - la fila no existe
        const { data: result, error } = await this.supabase
          .from("user_preferences")
          .insert({
            user_id: userId,
            theme: data.theme ?? "dark",
            weight_unit: data.weight_unit ?? "kg",
            distance_unit: data.distance_unit ?? "metric",
            language: data.language ?? "en",
            show_rpe: data.show_rpe ?? false,
            show_tempo: data.show_tempo ?? false,
            keep_screen_awake: data.keep_screen_awake ?? true,
            haptic_feedback_enabled: data.haptic_feedback_enabled ?? true,
            default_rest_time_seconds: data.default_rest_time_seconds ?? 60,
            // Onboarding fields
            biological_sex: data.biological_sex,
            birth_date: data.birth_date,
            height_cm: data.height_cm,
            initial_weight_kg: data.initial_weight_kg,
            fitness_goal: data.fitness_goal,
            activity_level: data.activity_level,
            onboarding_completed: data.onboarding_completed,
            onboarding_completed_at: data.onboarding_completed_at,
          })
          .select()
          .single();

        if (error) throw error;
        return result as BaseUserPreferences;
      }
    } catch (error) {
      return await this.handleError(error, "update user preferences");
    }
  }

  async getUserPreferences(
    userId: string
  ): Promise<BaseUserPreferences | null> {
    try {
      const { data: result, error } = await this.supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows found
          return null;
        }
        throw error;
      }

      return result as BaseUserPreferences;
    } catch (error) {
      return await this.handleError(error, "get user preferences");
    }
  }
}
