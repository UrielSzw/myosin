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
      // Soft delete: actualizar deleted_at en lugar de eliminar
      const { error } = await this.supabase
        .from("routines")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", routineId);

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

  /**
   * Crea una rutina Quick Workout (is_quick_workout=true)
   */
  async createQuickWorkoutRoutine(routine: {
    id: string;
    name: string;
    created_by_user_id: string;
    is_quick_workout: boolean;
    show_rpe?: boolean;
    show_tempo?: boolean;
  }): Promise<void> {
    try {
      const { error } = await this.supabase.from("routines").insert({
        id: routine.id,
        name: routine.name,
        created_by_user_id: routine.created_by_user_id,
        is_quick_workout: routine.is_quick_workout,
        show_rpe: routine.show_rpe ?? false,
        show_tempo: routine.show_tempo ?? false,
      });

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "create quick workout routine");
    }
  }

  /**
   * Convierte un Quick Workout en una rutina normal (is_quick_workout=false)
   */
  async convertQuickWorkoutToRoutine(
    routineId: string,
    newName?: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("routines")
        .update({
          is_quick_workout: false,
          ...(newName && { name: newName }),
        })
        .eq("id", routineId);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "convert quick workout to routine");
    }
  }

  /**
   * Actualiza el folder_id de una rutina (mover a carpeta)
   */
  async updateRoutineFolderId(
    routineId: string,
    folderId: string | null
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("routines")
        .update({ folder_id: folderId })
        .eq("id", routineId);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "update routine folder");
    }
  }
}
