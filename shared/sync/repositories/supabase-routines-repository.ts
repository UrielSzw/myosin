import type { CreateRoutineData } from "../../db/repository/routines";
import type { BaseRoutine } from "../../db/schema/routine";
import { BaseSupabaseRepository } from "./base-supabase-repository";

export class SupabaseRoutinesRepository extends BaseSupabaseRepository {
  async createRoutineWithData(data: CreateRoutineData): Promise<BaseRoutine> {
    try {
      // Usar RPC function para transacción atómica
      const { data: result, error } = await this.supabase.rpc(
        "create_routine_with_data",
        {
          routine_data: data.routine,
          blocks_data: data.blocks,
          exercises_data: data.exercisesInBlock,
          sets_data: data.sets,
        }
      );

      if (error) throw error;
      return result as BaseRoutine;
    } catch (error) {
      return await this.handleError(error, "create routine with data");
    }
  }

  async updateRoutineWithData(
    routineId: string,
    data: CreateRoutineData
  ): Promise<BaseRoutine> {
    try {
      // Usar RPC function para transacción atómica
      const { data: result, error } = await this.supabase.rpc(
        "update_routine_with_data",
        {
          routine_id_param: routineId,
          routine_data: data.routine,
          blocks_data: data.blocks,
          exercises_data: data.exercisesInBlock,
          sets_data: data.sets,
        }
      );

      if (error) throw error;
      return result as BaseRoutine;
    } catch (error) {
      return await this.handleError(error, "update routine with data");
    }
  }

  async deleteRoutineById(routineId: string): Promise<void> {
    try {
      // Usar RPC function para cascade delete
      const { error } = await this.supabase.rpc("delete_routine_by_id", {
        routine_id_param: routineId,
      });

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete routine");
    }
  }

  async clearRoutineTrainingDays(routineId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("routines")
        .update({ training_days: null })
        .eq("id", routineId);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "clear routine training days");
    }
  }
}
