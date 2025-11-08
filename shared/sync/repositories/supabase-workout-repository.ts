import type { CreateWorkoutSessionData } from "../../db/repository/workout-sessions";
import type { BaseWorkoutSession } from "../../db/schema/workout-session";
import { BaseSupabaseRepository } from "./base-supabase-repository";

export class SupabaseWorkoutRepository extends BaseSupabaseRepository {
  async createWorkoutSessionWithData(
    data: CreateWorkoutSessionData
  ): Promise<BaseWorkoutSession> {
    try {
      // Usar RPC function para transacción atómica
      const { data: result, error } = await this.supabase.rpc(
        "create_workout_session_with_data",
        {
          session_data: data.session,
          blocks_data: data.blocks,
          exercises_data: data.exercises,
          sets_data: data.sets,
        }
      );

      if (error) throw error;
      return result as BaseWorkoutSession;
    } catch (error) {
      return await this.handleError(error, "create workout session with data");
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      // Usar RPC function para cascade delete
      const { error } = await this.supabase.rpc("delete_workout_session", {
        session_id_param: sessionId,
      });

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete workout session");
    }
  }

  async updateSession(
    sessionId: string,
    data: Partial<any>
  ): Promise<BaseWorkoutSession> {
    try {
      const { data: result, error } = await this.supabase
        .from("workout_sessions")
        .update(data)
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "update workout session");
    }
  }
}
