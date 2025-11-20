import { eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../client";
import {
  exercise_in_block,
  exercises,
  routine_blocks,
  routine_sets,
  routines,
} from "../schema";
import type {
  BaseRoutine,
  BlockInsert,
  ExerciseInBlockInsert,
  RoutineInsert,
  SetInsert,
} from "../schema/routine";

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

export const routinesRepository = {
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
        folderId ? eq(routines.folder_id, folderId) : isNull(routines.folder_id)
      )
      .groupBy(routines.id);

    // Normalizar/asegurar tipos: algunos drivers pueden devolver counts como string
    const normalized: RoutineWithMetrics[] = rows.map((r: any) => ({
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

    return normalized;
  },

  createRoutineWithData: async (
    data: CreateRoutineData
  ): Promise<BaseRoutine> => {
    return await db.transaction(async (tx) => {
      // 1. Insertar rutina principal
      const [createdRoutine] = await tx
        .insert(routines)
        .values(data.routine)
        .returning();

      // 2. Insertar bloques
      if (data.blocks.length > 0) {
        const blocksWithRoutineId = data.blocks.map((block) => ({
          ...block,
          routine_id: createdRoutine.id,
        }));

        await tx.insert(routine_blocks).values(blocksWithRoutineId);
      }

      // 3. Insertar ejercicios en bloques
      if (data.exercisesInBlock.length > 0) {
        await tx.insert(exercise_in_block).values(data.exercisesInBlock);
      }

      // 4. Insertar sets
      if (data.sets.length > 0) {
        await tx.insert(routine_sets).values(data.sets);
      }

      return createdRoutine;
    });
  },

  findRoutineById: async (routineId: string) => {
    // 1. Obtener rutina principal
    const [routine] = await db
      .select()
      .from(routines)
      .where(eq(routines.id, routineId));

    if (!routine) {
      throw new Error(`Routine with id ${routineId} not found`);
    }

    // 2. Obtener bloques ordenados
    const blocks = await db
      .select()
      .from(routine_blocks)
      .where(eq(routine_blocks.routine_id, routineId))
      .orderBy(routine_blocks.order_index);

    // 3. Obtener ejercicios con joins
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

    // 4. Obtener sets
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

  updateRoutineWithData: async (
    routineId: string,
    data: CreateRoutineData
  ): Promise<BaseRoutine> => {
    return await db.transaction(async (tx) => {
      // 1. Actualizar rutina principal
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

      // 2. Eliminar todo el contenido existente (cascade delete)
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

      // 3. Insertar nuevo contenido
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
    return await db.transaction(async (tx) => {
      // 1. Obtener todos los bloques de la rutina
      const blocks = await tx
        .select({ id: routine_blocks.id })
        .from(routine_blocks)
        .where(eq(routine_blocks.routine_id, routineId));

      if (blocks.length > 0) {
        const blockIds = blocks.map((block) => block.id);

        // 2. Obtener todos los exercise_in_block de esos bloques
        const exercisesInBlock = await tx
          .select({ id: exercise_in_block.id })
          .from(exercise_in_block)
          .where(inArray(exercise_in_block.block_id, blockIds));

        // Si hay ejercicios, eliminar sus sets
        if (exercisesInBlock.length > 0) {
          const exerciseInBlockIds = exercisesInBlock.map((ex) => ex.id);

          // 3. Eliminar todos los sets primero
          await tx
            .delete(routine_sets)
            .where(
              inArray(routine_sets.exercise_in_block_id, exerciseInBlockIds)
            );

          // 4. Eliminar todos los exercise_in_block
          await tx
            .delete(exercise_in_block)
            .where(inArray(exercise_in_block.block_id, blockIds));
        }

        // 5. Eliminar todos los bloques
        await tx
          .delete(routine_blocks)
          .where(inArray(routine_blocks.id, blockIds));
      }

      // 6. Finalmente, eliminar la rutina
      await tx.delete(routines).where(eq(routines.id, routineId));
    });
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

  getAllRoutinesCount: async (): Promise<number> => {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(routines)
      .limit(1);

    return result[0].count;
  },

  clearRoutineTrainingDays: async (routineId: string): Promise<void> => {
    await db
      .update(routines)
      .set({ training_days: null })
      .where(eq(routines.id, routineId));
  },
};
