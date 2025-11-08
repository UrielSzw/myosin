import type {
  BasePRCurrent,
  BasePRHistory,
  PRCurrentInsert,
  PRHistoryInsert,
} from "../../db/schema/pr";
import { BaseSupabaseRepository } from "./base-supabase-repository";

export class SupabasePRRepository extends BaseSupabaseRepository {
  async upsertCurrentPR(data: PRCurrentInsert): Promise<BasePRCurrent> {
    try {
      // Check if exists
      const { data: existing, error: checkError } = await this.supabase
        .from("pr_current")
        .select("id")
        .eq("user_id", data.user_id)
        .eq("exercise_id", data.exercise_id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // Not found error
        throw checkError;
      }

      if (existing) {
        // Update existing
        const { data: updated, error: updateError } = await this.supabase
          .from("pr_current")
          .update({
            best_weight: data.best_weight,
            best_reps: data.best_reps,
            estimated_1rm: data.estimated_1rm,
            achieved_at: data.achieved_at,
            source: data.source,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updated;
      } else {
        // Insert new
        const { data: inserted, error: insertError } = await this.supabase
          .from("pr_current")
          .insert(data)
          .select()
          .single();

        if (insertError) throw insertError;
        return inserted;
      }
    } catch (error) {
      return await this.handleError(error, "upsert current PR");
    }
  }

  async insertPRHistory(data: PRHistoryInsert): Promise<BasePRHistory> {
    try {
      const { data: result, error } = await this.supabase
        .from("pr_history")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "insert PR history");
    }
  }

  async getCurrentPR(
    exerciseId: string,
    userId: string
  ): Promise<BasePRCurrent | null> {
    try {
      const { data, error } = await this.supabase
        .from("pr_current")
        .select("*")
        .eq("user_id", userId)
        .eq("exercise_id", exerciseId)
        .single();

      if (error && error.code === "PGRST116") {
        // Not found
        return null;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      return await this.handleError(error, "get current PR");
    }
  }

  async deletePRHistory(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("pr_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete PR history");
    }
  }
}
