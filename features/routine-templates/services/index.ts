// ================================================================================
// ROUTINE TEMPLATES - SERVICE
// ================================================================================

import { createRoutineService } from "@/features/routine-form/service/routine";
import type { CreateRoutineData } from "@/shared/db/repository/routines";
import type {
  BlockInsert,
  ExerciseInBlockInsert,
  RoutineInsert,
  SetInsert,
} from "@/shared/db/schema";
import { generateUUID } from "@/shared/db/utils/uuid";
import {
  getProgramTemplateById,
  getRoutineTemplateDataById,
} from "../constants";
import type { RoutineTemplateData } from "../types";

/**
 * Convierte un RoutineTemplateData a CreateRoutineData
 * Similar a useSaveRoutine pero para templates
 */
export const convertTemplateToCreateData = (
  templateData: RoutineTemplateData,
  overrides?: {
    name?: string;
    folder_id?: string | null;
    training_days?: string[] | null;
  }
): CreateRoutineData => {
  const routineId = generateUUID();

  // 1. Preparar routine data
  const routine: RoutineInsert = {
    id: routineId,
    name: overrides?.name || templateData.routine.name,
    folder_id: overrides?.folder_id || templateData.routine.folder_id,
    created_by_user_id: "default-user",
    training_days:
      overrides?.training_days || templateData.routine.training_days,
    show_rpe: templateData.routine.show_rpe,
    show_tempo: templateData.routine.show_tempo,
  };

  // 2. Preparar blocks data
  const blocks: BlockInsert[] = templateData.blocks.map((blockTemplate) => ({
    id: generateUUID(),
    user_id: "default-user",
    routine_id: routineId,
    type: blockTemplate.type,
    order_index: blockTemplate.order_index,
    rest_time_seconds: blockTemplate.rest_time_seconds,
    rest_between_exercises_seconds:
      blockTemplate.rest_between_exercises_seconds,
    name: blockTemplate.name,
  }));

  // 3. Crear mapping block_index → block_id
  const blockIndexToId = new Map<number, string>();
  blocks.forEach((block, index) => {
    blockIndexToId.set(index, block.id);
  });

  // 4. Preparar exercises in block data
  const exercisesInBlock: ExerciseInBlockInsert[] =
    templateData.exercisesInBlock.map((exerciseTemplate) => ({
      id: generateUUID(),
      user_id: "default-user",
      block_id: blockIndexToId.get(exerciseTemplate.block_index)!,
      exercise_id: exerciseTemplate.exercise_id,
      order_index: exerciseTemplate.order_index,
      notes: exerciseTemplate.notes,
    }));

  // 5. Crear mapping (block_index, exercise_order_index) → exercise_in_block_id
  const exerciseKey = (blockIndex: number, orderIndex: number) =>
    `${blockIndex}-${orderIndex}`;
  const exerciseIndexToId = new Map<string, string>();

  templateData.exercisesInBlock.forEach((exerciseTemplate, index) => {
    const key = exerciseKey(
      exerciseTemplate.block_index,
      exerciseTemplate.order_index
    );
    exerciseIndexToId.set(key, exercisesInBlock[index].id);
  });

  // 6. Preparar sets data
  const sets: SetInsert[] = templateData.sets.map((setTemplate) => {
    const key = exerciseKey(
      setTemplate.exercise_block_index,
      setTemplate.exercise_order_index
    );
    const exerciseInBlockId = exerciseIndexToId.get(key);

    if (!exerciseInBlockId) {
      throw new Error(
        `No se encontró exerciseInBlockId para set: block ${setTemplate.exercise_block_index}, exercise ${setTemplate.exercise_order_index}`
      );
    }

    return {
      id: generateUUID(),
      user_id: "default-user",
      exercise_in_block_id: exerciseInBlockId,
      measurement_template: setTemplate.measurement_template,
      primary_value: setTemplate.primary_value,
      secondary_value: setTemplate.secondary_value,
      primary_range: setTemplate.primary_range,
      secondary_range: setTemplate.secondary_range,
      rpe: setTemplate.rpe,
      tempo: setTemplate.tempo,
      order_index: setTemplate.order_index,
      set_type: setTemplate.set_type,
    };
  });

  return {
    routine,
    blocks,
    exercisesInBlock,
    sets,
  };
};

/**
 * Crea una rutina desde un template
 */
export const createRoutineFromTemplate = async (
  templateId: string,
  overrides?: {
    name?: string;
    folder_id?: string | null;
    training_days?: string[] | null;
  }
): Promise<string> => {
  const templateData = getRoutineTemplateDataById(templateId);

  if (!templateData) {
    throw new Error(`Template con ID ${templateId} no encontrado`);
  }

  const createData = convertTemplateToCreateData(templateData, overrides);
  const savedRoutine = await createRoutineService.createRoutine(createData);

  return savedRoutine.id;
};

/**
 * Crea múltiples rutinas desde un programa
 */
export const createRoutinesFromProgram = async (
  programId: string,
  overrides?: {
    folder_id?: string | null;
  }
): Promise<string[]> => {
  const programTemplate = getProgramTemplateById(programId);

  if (!programTemplate) {
    throw new Error(`Programa con ID ${programId} no encontrado`);
  }

  const createdRoutineIds: string[] = [];

  for (const routineConfig of programTemplate.routines) {
    const routineName = routineConfig.name || routineConfig.routineId;

    const routineId = await createRoutineFromTemplate(routineConfig.routineId, {
      name: routineName,
      folder_id: overrides?.folder_id || null,
      training_days: routineConfig.assignedDays,
    });

    createdRoutineIds.push(routineId);
  }

  return createdRoutineIds;
};

/**
 * Servicio principal exportado
 */
export const templateService = {
  convertTemplateToCreateData,
  createRoutineFromTemplate,
  createRoutinesFromProgram,
} as const;
