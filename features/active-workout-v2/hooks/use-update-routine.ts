import type {
  BlockInsert,
  ExerciseInBlockInsert,
  RoutineInsert,
  SetInsert,
} from "@/shared/db/schema";
import { generateUUID } from "@/shared/db/utils/uuid";
import { queryKeys } from "@/shared/queries/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createRoutineService } from "../../routine-form-v2/service/routine";
import { useActiveWorkout } from "./use-active-workout-store";

type UpdateState = "idle" | "updating" | "success" | "error";

export const useUpdateRoutine = () => {
  const [updateState, setUpdateState] = useState<UpdateState>("idle");
  const [error, setError] = useState<string | null>(null);
  const activeWorkout = useActiveWorkout();
  const queryClient = useQueryClient();

  const updateRoutine = async (): Promise<string | null> => {
    if (!activeWorkout?.session) {
      setError("No hay workout activo para actualizar");
      return null;
    }

    const session = activeWorkout.session;
    const originalRoutineId = session.routine.id;

    setUpdateState("updating");
    setError(null);

    try {
      // 1. Preparar data de rutina (mantener datos originales)
      const routineData: RoutineInsert = {
        id: originalRoutineId,
        name: session.routine.name,
        folder_id: session.routine.folder_id || null,
        created_by_user_id: session.routine.created_by_user_id,
        show_rpe: session.routine.show_rpe,
        show_tempo: session.routine.show_tempo,
        training_days: session.routine.training_days,
        deleted_at: null, // Rutinas activas no están eliminadas
      };

      // 2. Preparar bloques con IDs reales
      const blocksData: BlockInsert[] = activeWorkout.blocksBySession.map(
        (tempBlockId, index) => {
          const block = activeWorkout.blocks[tempBlockId];
          return {
            id: generateUUID(),
            user_id: "default-user",
            routine_id: originalRoutineId,
            type: block.type,
            order_index: index,
            rest_time_seconds: block.rest_time_seconds,
            rest_between_exercises_seconds:
              block.rest_between_exercises_seconds,
            name: block.name,
          };
        }
      );

      // 3. Crear mapping de tempId → ID real para bloques
      const blockIdMapping: Record<string, string> = {};
      activeWorkout.blocksBySession.forEach((tempBlockId, index) => {
        blockIdMapping[tempBlockId] = blocksData[index].id;
      });

      // 4. Preparar exercisesInBlock con IDs reales
      const exercisesInBlockData: ExerciseInBlockInsert[] = [];
      const exerciseIdMapping: Record<string, string> = {};

      activeWorkout.blocksBySession.forEach((tempBlockId) => {
        const exerciseIds = activeWorkout.exercisesByBlock[tempBlockId] || [];

        exerciseIds.forEach((tempExerciseId) => {
          const exerciseInBlock = activeWorkout.exercises[tempExerciseId];
          const realExerciseId = generateUUID();

          exerciseIdMapping[tempExerciseId] = realExerciseId;

          exercisesInBlockData.push({
            id: realExerciseId,
            user_id: "default-user",
            block_id: blockIdMapping[tempBlockId],
            exercise_id: exerciseInBlock.exercise_id,
            order_index: exerciseInBlock.order_index,
            notes: exerciseInBlock.notes,
          });
        });
      });

      // 5. Preparar sets con IDs reales
      const setsData: SetInsert[] = [];

      Object.entries(activeWorkout.setsByExercise).forEach(
        ([tempExerciseId, setIds]) => {
          const realExerciseId = exerciseIdMapping[tempExerciseId];

          setIds.forEach((tempSetId) => {
            const set = activeWorkout.sets[tempSetId];

            setsData.push({
              id: generateUUID(),
              user_id: "default-user",
              exercise_in_block_id: realExerciseId,
              measurement_template: set.measurement_template,
              primary_value: set.planned_primary_value,
              secondary_value: set.planned_secondary_value,
              primary_range: set.planned_primary_range,
              secondary_range: set.planned_secondary_range,
              rpe: set.planned_rpe,
              tempo: set.planned_tempo,
              order_index: set.order_index,
              set_type: set.set_type,
            });
          });
        }
      );

      // 6. Ejecutar actualización completa (delete & recreate)
      const updatedRoutine = await createRoutineService.updateRoutine(
        originalRoutineId,
        {
          routine: routineData,
          blocks: blocksData,
          exercisesInBlock: exercisesInBlockData,
          sets: setsData,
        }
      );

      setUpdateState("success");
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });

      return updatedRoutine.id;
    } catch (err) {
      console.error("Error updating routine:", err);
      setError("Error al actualizar la rutina. Intenta nuevamente.");
      setUpdateState("error");
      return null;
    }
  };

  const resetUpdateState = () => {
    setUpdateState("idle");
    setError(null);
  };

  return {
    updateRoutine,
    updateState,
    error,
    resetUpdateState,
    isLoading: updateState === "updating",
    isSuccess: updateState === "success",
    isError: updateState === "error",
  };
};
