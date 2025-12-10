import type {
  ExerciseProgressionInsert,
  ProgressionPathExerciseInsert,
  ProgressionPathInsert,
  UserExerciseUnlockInsert,
} from "../../db/schema/progressions";
import { BaseSupabaseRepository } from "./base-supabase-repository";

// ============================================================================
// Types for Supabase responses
// ============================================================================

interface SupabaseProgression {
  id: string;
  from_exercise_id: string;
  to_exercise_id: string;
  relationship_type: string;
  unlock_criteria: any;
  difficulty_delta: number;
  notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseProgressionPath {
  id: string;
  slug: string;
  name_key: string;
  description_key: string | null;
  category: string;
  ultimate_exercise_id: string | null;
  icon: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  exercises?: {
    id: string;
    exercise_id: string;
    level: number;
    is_main_path: boolean;
  }[];
}

interface SupabaseUserUnlock {
  id: string;
  user_id: string;
  exercise_id: string;
  status: string;
  unlocked_at: string | null;
  unlocked_by_exercise_id: string | null;
  unlocked_by_pr_id: string | null;
  current_progress: any;
  manually_unlocked: boolean;
  manually_unlocked_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Repository
// ============================================================================

export class SupabaseProgressionsRepository extends BaseSupabaseRepository {
  // ========================================
  // PROGRESSIONS (catalog data)
  // ========================================

  /**
   * Get all exercise progressions from Supabase
   */
  async getAllProgressions(): Promise<ExerciseProgressionInsert[]> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_progressions_for_sync"
      );

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      return (data as SupabaseProgression[]).map((p) => ({
        id: p.id,
        from_exercise_id: p.from_exercise_id,
        to_exercise_id: p.to_exercise_id,
        relationship_type: p.relationship_type as any,
        unlock_criteria: p.unlock_criteria,
        difficulty_delta: p.difficulty_delta,
        notes: p.notes,
        source: p.source as any,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching progressions:", error);
      return [];
    }
  }

  // ========================================
  // PROGRESSION PATHS (catalog data)
  // ========================================

  /**
   * Get all progression paths with their exercises
   */
  async getAllPathsWithExercises(): Promise<{
    paths: ProgressionPathInsert[];
    pathExercises: ProgressionPathExerciseInsert[];
  }> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_progression_paths_for_sync"
      );

      if (error) throw error;

      if (!data || data.length === 0) {
        return { paths: [], pathExercises: [] };
      }

      const paths: ProgressionPathInsert[] = [];
      const pathExercises: ProgressionPathExerciseInsert[] = [];

      for (const p of data as SupabaseProgressionPath[]) {
        paths.push({
          id: p.id,
          slug: p.slug,
          name_key: p.name_key,
          description_key: p.description_key,
          category: p.category as any,
          ultimate_exercise_id: p.ultimate_exercise_id,
          icon: p.icon,
          color: p.color,
          created_at: p.created_at,
          updated_at: p.updated_at,
        });

        if (p.exercises) {
          for (const ex of p.exercises) {
            pathExercises.push({
              id: ex.id,
              path_id: p.id,
              exercise_id: ex.exercise_id,
              level: ex.level,
              is_main_path: ex.is_main_path,
              created_at: p.created_at,
              updated_at: p.updated_at,
            });
          }
        }
      }

      return { paths, pathExercises };
    } catch (error) {
      console.error("Error fetching progression paths:", error);
      return { paths: [], pathExercises: [] };
    }
  }

  // ========================================
  // USER UNLOCKS (user data - bidirectional sync)
  // ========================================

  /**
   * Get all unlocks for a user from Supabase
   */
  async getUserUnlocks(userId: string): Promise<UserExerciseUnlockInsert[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_exercise_unlocks")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      return (data as SupabaseUserUnlock[]).map((u) => ({
        id: u.id,
        user_id: u.user_id,
        exercise_id: u.exercise_id,
        status: u.status as any,
        unlocked_at: u.unlocked_at,
        unlocked_by_exercise_id: u.unlocked_by_exercise_id,
        unlocked_by_pr_id: u.unlocked_by_pr_id,
        current_progress: u.current_progress,
        manually_unlocked: u.manually_unlocked,
        manually_unlocked_at: u.manually_unlocked_at,
        is_synced: true,
        created_at: u.created_at,
        updated_at: u.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching user unlocks:", error);
      return [];
    }
  }

  /**
   * Upsert a user unlock to Supabase
   */
  async upsertUserUnlock(
    unlock: UserExerciseUnlockInsert
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("user_exercise_unlocks")
        .upsert(this.stripLocalFields(unlock), {
          onConflict: "user_id,exercise_id",
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error("Error upserting user unlock:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Batch upsert user unlocks
   */
  async batchUpsertUserUnlocks(
    unlocks: UserExerciseUnlockInsert[]
  ): Promise<{ success: boolean; error?: string }> {
    if (unlocks.length === 0) return { success: true };

    try {
      const { error } = await this.supabase
        .from("user_exercise_unlocks")
        .upsert(this.stripLocalFieldsArray(unlocks), {
          onConflict: "user_id,exercise_id",
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error("Error batch upserting user unlocks:", error);
      return { success: false, error: error.message };
    }
  }
}
