/**
 * Routines Repository - Repositorio de rutinas con sync automático
 *
 * Maneja todas las operaciones de rutinas incluyendo bloques, ejercicios y sets.
 */

import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../db/client";
import {
  exercise_in_block,
  exercises,
  routine_blocks,
  routine_sets,
  routines,
} from "../../db/schema";
import type {
  BaseRoutine,
  BlockInsert,
  ExerciseInBlockInsert,
  RoutineInsert,
  SetInsert,
} from "../../db/schema/routine";
import { generateUUID } from "../../db/utils/uuid";
import { getSyncAdapter } from "../core/sync-adapter";

// =============================================================================
// TYPES
// =============================================================================

export type RoutineWithMetrics = BaseRoutine & {
  blocksCount: number;
  exercisesCount: number;
};

export type CreateRoutineData = {
  routine: RoutineInsert;
  blocks: BlockInsert[];
  exercisesInBlock: ExerciseInBlockInsert[];
  sets: SetInsert[];
};

export type RoutineWithFullData = {
  routine: BaseRoutine;
  blocks: any[];
  exercisesInBlock: any[];
  sets: any[];
};

// =============================================================================
// INTERFACE
// =============================================================================

export interface IRoutinesRepository {
  // Queries
  findAllWithMetrics(folderId: string | null): Promise<RoutineWithMetrics[]>;
  findRoutineById(routineId: string): Promise<RoutineWithFullData>;
  getAllRoutinesCount(): Promise<number>;

  // Mutations (con sync automático)
  createRoutineWithData(data: CreateRoutineData): Promise<BaseRoutine>;
  updateRoutineWithData(
    routineId: string,
    data: CreateRoutineData
  ): Promise<BaseRoutine>;
  deleteRoutineById(routineId: string): Promise<void>;
  updateRoutineFolderId(
    routineId: string,
    folderId: string | null
  ): Promise<void>;
  createQuickWorkoutRoutine(
    userId: string,
    options?: { show_rpe?: boolean; show_tempo?: boolean; name?: string }
  ): Promise<BaseRoutine>;
  convertQuickWorkoutToRoutine(
    routineId: string,
    newName?: string
  ): Promise<void>;
  clearRoutineTrainingDays(routineId: string): Promise<void>;
}

// =============================================================================
// LOCAL REPOSITORY (SQLite only)
// =============================================================================

const localRepository = {
  findAllWithMetrics: async (
    folderId: string | null
  ): Promise<RoutineWithMetrics[]> => {
    const rows = await db
      .select({
        id: routines.id,
        name: routines.name,
        created_at: routines.created_at,
        updated_at: routines.updated_at,
        blocksCount: sql<number>`COUNT(DISTINCT ${routine_blocks.id})`,
        exercisesCount: sql<number>`COUNT(${exercise_in_block.id})`,
        folder_id: routines.folder_id,
        training_days: routines.training_days,
      })
      .from(routines)
      .leftJoin(routine_blocks, eq(routine_blocks.routine_id, routines.id))
      .leftJoin(
        exercise_in_block,
        eq(exercise_in_block.block_id, routine_blocks.id)
      )
      .where(
        and(
          isNull(routines.deleted_at),
          eq(routines.is_quick_workout, false),
          folderId
            ? eq(routines.folder_id, folderId)
            : isNull(routines.folder_id)
        )
      )
      .groupBy(routines.id);

    return rows.map((r: any) => ({
      ...r,
      blocksCount:
        typeof r.blocksCount === "number"
          ? r.blocksCount
          : Number(r.blocksCount || 0),
      exercisesCount:
        typeof r.exercisesCount === "number"
          ? r.exercisesCount
          : Number(r.exercisesCount || 0),
    }));
  },

  findRoutineById: async (routineId: string): Promise<RoutineWithFullData> => {
    const [routine] = await db
      .select()
      .from(routines)
      .where(eq(routines.id, routineId));

    if (!routine) {
      throw new Error(`Routine with id ${routineId} not found`);
    }

    const blocks = await db
      .select()
      .from(routine_blocks)
      .where(eq(routine_blocks.routine_id, routineId))
      .orderBy(routine_blocks.order_index);

    const exercisesWithDetails = await db
      .select({
        exerciseInBlock: exercise_in_block,
        exercise: {
          id: exercises.id,
          name: exercises.name,
          source: exercises.source,
          created_by_user_id: exercises.created_by_user_id,
          main_muscle_group: exercises.main_muscle_group,
          primary_equipment: exercises.primary_equipment,
          secondary_muscle_groups: exercises.secondary_muscle_groups,
          instructions: exercises.instructions,
          equipment: exercises.equipment,
          created_at: exercises.created_at,
          updated_at: exercises.updated_at,
          primary_media_url: exercises.primary_media_url,
          primary_media_type: exercises.primary_media_type,
        },
      })
      .from(exercise_in_block)
      .innerJoin(exercises, eq(exercise_in_block.exercise_id, exercises.id))
      .where(
        inArray(
          exercise_in_block.block_id,
          blocks.map((b) => b.id)
        )
      )
      .orderBy(exercise_in_block.order_index);

    const sets = await db
      .select()
      .from(routine_sets)
      .where(
        inArray(
          routine_sets.exercise_in_block_id,
          exercisesWithDetails.map((e) => e.exerciseInBlock.id)
        )
      )
      .orderBy(routine_sets.order_index);

    return {
      routine,
      blocks,
      exercisesInBlock: exercisesWithDetails,
      sets,
    };
  },

  getAllRoutinesCount: async (): Promise<number> => {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(routines)
      .where(
        and(isNull(routines.deleted_at), eq(routines.is_quick_workout, false))
      )
      .limit(1);

    return result[0]?.count ?? 0;
  },

  createRoutineWithData: async (
    data: CreateRoutineData
  ): Promise<BaseRoutine> => {
    return await db.transaction(async (tx) => {
      const [createdRoutine] = await tx
        .insert(routines)
        .values(data.routine)
        .returning();

      if (!createdRoutine) {
        throw new Error("Failed to create routine");
      }

      if (data.blocks.length > 0) {
        const blocksWithRoutineId = data.blocks.map((block) => ({
          ...block,
          routine_id: createdRoutine.id,
        }));
        await tx.insert(routine_blocks).values(blocksWithRoutineId);
      }

      if (data.exercisesInBlock.length > 0) {
        await tx.insert(exercise_in_block).values(data.exercisesInBlock);
      }

      if (data.sets.length > 0) {
        await tx.insert(routine_sets).values(data.sets);
      }

      return createdRoutine;
    });
  },

  updateRoutineWithData: async (
    routineId: string,
    data: CreateRoutineData
  ): Promise<BaseRoutine> => {
    return await db.transaction(async (tx) => {
      const [updatedRoutine] = await tx
        .update(routines)
        .set({
          name: data.routine.name,
          folder_id: data.routine.folder_id,
          training_days: data.routine.training_days,
          show_rpe: data.routine.show_rpe,
          show_tempo: data.routine.show_tempo,
        })
        .where(eq(routines.id, routineId))
        .returning();

      if (!updatedRoutine) {
        throw new Error(`Routine with id ${routineId} not found`);
      }

      // Delete existing content
      const blocks = await tx
        .select({ id: routine_blocks.id })
        .from(routine_blocks)
        .where(eq(routine_blocks.routine_id, routineId));

      if (blocks.length > 0) {
        const blockIds = blocks.map((block) => block.id);
        const exercisesInBlock = await tx
          .select({ id: exercise_in_block.id })
          .from(exercise_in_block)
          .where(inArray(exercise_in_block.block_id, blockIds));

        if (exercisesInBlock.length > 0) {
          const exerciseInBlockIds = exercisesInBlock.map((ex) => ex.id);
          await tx
            .delete(routine_sets)
            .where(
              inArray(routine_sets.exercise_in_block_id, exerciseInBlockIds)
            );
          await tx
            .delete(exercise_in_block)
            .where(inArray(exercise_in_block.block_id, blockIds));
        }
        await tx
          .delete(routine_blocks)
          .where(inArray(routine_blocks.id, blockIds));
      }

      // Insert new content
      if (data.blocks.length > 0) {
        const blocksWithRoutineId = data.blocks.map((block) => ({
          ...block,
          routine_id: routineId,
        }));
        await tx.insert(routine_blocks).values(blocksWithRoutineId);
      }

      if (data.exercisesInBlock.length > 0) {
        await tx.insert(exercise_in_block).values(data.exercisesInBlock);
      }

      if (data.sets.length > 0) {
        await tx.insert(routine_sets).values(data.sets);
      }

      return updatedRoutine;
    });
  },

  deleteRoutineById: async (routineId: string): Promise<void> => {
    await db
      .update(routines)
      .set({ deleted_at: new Date().toISOString() })
      .where(eq(routines.id, routineId));
  },

  updateRoutineFolderId: async (
    routineId: string,
    folderId: string | null
  ): Promise<void> => {
    await db
      .update(routines)
      .set({ folder_id: folderId })
      .where(eq(routines.id, routineId));
  },

  createQuickWorkoutRoutine: async (
    userId: string,
    options?: { show_rpe?: boolean; show_tempo?: boolean; name?: string }
  ): Promise<BaseRoutine> => {
    const quickRoutine: RoutineInsert = {
      id: generateUUID(),
      name: options?.name ?? "Quick Workout",
      folder_id: null,
      created_by_user_id: userId,
      show_rpe: options?.show_rpe ?? false,
      show_tempo: options?.show_tempo ?? false,
      training_days: null,
      is_quick_workout: true,
    };

    const [created] = await db
      .insert(routines)
      .values(quickRoutine)
      .returning();

    if (!created) {
      throw new Error("Failed to create quick workout routine");
    }

    return created;
  },

  convertQuickWorkoutToRoutine: async (
    routineId: string,
    newName?: string
  ): Promise<void> => {
    await db
      .update(routines)
      .set({
        is_quick_workout: false,
        ...(newName && { name: newName }),
      })
      .where(eq(routines.id, routineId));
  },

  clearRoutineTrainingDays: async (routineId: string): Promise<void> => {
    await db
      .update(routines)
      .set({ training_days: null })
      .where(eq(routines.id, routineId));
  },
};

// =============================================================================
// SYNC ADAPTER
// =============================================================================

const syncAdapter = getSyncAdapter();

// =============================================================================
// SYNCED REPOSITORY
// =============================================================================

export const createRoutinesRepository = (): IRoutinesRepository => {
  return {
    // Queries (sin sync)
    findAllWithMetrics: localRepository.findAllWithMetrics,
    findRoutineById: localRepository.findRoutineById,
    getAllRoutinesCount: localRepository.getAllRoutinesCount,

    // Mutations (con sync automático)
    async createRoutineWithData(data: CreateRoutineData): Promise<BaseRoutine> {
      const result = await localRepository.createRoutineWithData(data);
      syncAdapter.sync("ROUTINE_CREATE", {
        routine: data.routine,
        blocks: data.blocks,
        exercisesInBlock: data.exercisesInBlock,
        sets: data.sets,
      });
      return result;
    },

    async updateRoutineWithData(
      routineId: string,
      data: CreateRoutineData
    ): Promise<BaseRoutine> {
      const result = await localRepository.updateRoutineWithData(
        routineId,
        data
      );
      syncAdapter.sync("ROUTINE_UPDATE", {
        routineId,
        routine: data.routine,
        blocks: data.blocks,
        exercisesInBlock: data.exercisesInBlock,
        sets: data.sets,
      });
      return result;
    },

    async deleteRoutineById(routineId: string): Promise<void> {
      await localRepository.deleteRoutineById(routineId);
      syncAdapter.sync("ROUTINE_DELETE", { id: routineId });
    },

    async updateRoutineFolderId(
      routineId: string,
      folderId: string | null
    ): Promise<void> {
      await localRepository.updateRoutineFolderId(routineId, folderId);
      syncAdapter.sync("ROUTINE_UPDATE_FOLDER", { routineId, folderId });
    },

    async createQuickWorkoutRoutine(
      userId: string,
      options?: { show_rpe?: boolean; show_tempo?: boolean; name?: string }
    ): Promise<BaseRoutine> {
      const result = await localRepository.createQuickWorkoutRoutine(
        userId,
        options
      );
      syncAdapter.sync("ROUTINE_CREATE_QUICK_WORKOUT", {
        routine: result,
      });
      return result;
    },

    async convertQuickWorkoutToRoutine(
      routineId: string,
      newName?: string
    ): Promise<void> {
      await localRepository.convertQuickWorkoutToRoutine(routineId, newName);
      syncAdapter.sync("ROUTINE_CONVERT_FROM_QUICK", {
        routineId,
        newName,
      });
    },

    async clearRoutineTrainingDays(routineId: string): Promise<void> {
      await localRepository.clearRoutineTrainingDays(routineId);
      syncAdapter.sync("ROUTINE_CLEAR_TRAINING_DAYS", { routineId });
    },
  };
};

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const routinesRepository = createRoutinesRepository();
