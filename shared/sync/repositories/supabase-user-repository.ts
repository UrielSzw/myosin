import type { BaseUserPreferences } from "../../db/schema/user";
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
          language: data.language || "es",
          show_rpe: data.show_rpe ?? false,
          show_tempo: data.show_tempo ?? false,
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
      const { data: result, error } = await this.supabase
        .from("user_preferences")
        .update({
          theme: data.theme,
          weight_unit: data.weight_unit,
          distance_unit: data.distance_unit,
          language: data.language,
          show_rpe: data.show_rpe,
          show_tempo: data.show_tempo,
          default_rest_time_seconds: data.default_rest_time_seconds,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return result as BaseUserPreferences;
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
