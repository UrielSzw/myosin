import type {
  BlockInsert,
  ExerciseInBlockInsert,
  RoutineInsert,
  SetInsert,
} from "@/shared/db/schema";
import { generateUUID } from "@/shared/db/utils/uuid";
import { useState } from "react";
import { createRoutineService } from "../service/routine";
import { useRoutineFormState } from "./use-routine-form-store";
import { useRoutineValidation } from "./use-routine-validation";

type SaveState = "idle" | "saving" | "success" | "error";

export const useSaveRoutine = () => {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const formState = useRoutineFormState();
  const validation = useRoutineValidation();

  const saveRoutine = async (): Promise<string | null> => {
    // Usar la validación centralizada
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError || "La rutina tiene errores de validación");
      setSaveState("error");
      return null;
    }

    setSaveState("saving");
    setError(null);

    try {
      const isEditMode = formState.mode === "edit";

      // 1. Preparar data de rutina
      const routineData: RoutineInsert = {
        id: isEditMode ? formState.routine.id : generateUUID(),
        name: formState.routine.name.trim(),
        folder_id: formState.routine.folder_id || null,
        created_by_user_id: isEditMode
          ? formState.routine.created_by_user_id
          : "default-user",
      };

      // 2. Preparar bloques (eliminar tempId y asignar IDs reales)
      const blocksData: BlockInsert[] = formState.blocksByRoutine.map(
        (tempBlockId, index) => {
          const block = formState.blocks[tempBlockId];
          return {
            id: generateUUID(),
            user_id: "default-user",
            routine_id: routineData.id,
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
      formState.blocksByRoutine.forEach((tempBlockId, index) => {
        blockIdMapping[tempBlockId] = blocksData[index].id;
      });

      // 4. Preparar exercisesInBlock (eliminar tempId y asignar IDs reales)
      const exercisesInBlockData: ExerciseInBlockInsert[] = [];
      const exerciseIdMapping: Record<string, string> = {};

      formState.blocksByRoutine.forEach((tempBlockId) => {
        const exerciseIds = formState.exercisesByBlock[tempBlockId] || [];

        exerciseIds.forEach((tempExerciseId) => {
          const exerciseInBlock = formState.exercisesInBlock[tempExerciseId];
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

      // 5. Preparar sets (eliminar tempId y asignar IDs reales)
      const setsData: SetInsert[] = [];

      Object.entries(formState.setsByExercise).forEach(
        ([tempExerciseId, setIds]) => {
          const realExerciseId = exerciseIdMapping[tempExerciseId];

          setIds.forEach((tempSetId) => {
            const set = formState.sets[tempSetId];

            setsData.push({
              id: generateUUID(),
              user_id: "default-user",
              exercise_in_block_id: realExerciseId,
              reps: set.reps,
              weight: set.weight,
              rpe: set.rpe,
              order_index: set.order_index,
              set_type: set.set_type,
              reps_type: set.reps_type,
              reps_range: set.reps_range,
              tempo: set.tempo,
            });
          });
        }
      );

      // 6. Ejecutar transacción (create o update)
      const savedRoutine = isEditMode
        ? await createRoutineService.updateRoutine(
            formState.originalRoutineId!,
            {
              routine: routineData,
              blocks: blocksData,
              exercisesInBlock: exercisesInBlockData,
              sets: setsData,
            }
          )
        : await createRoutineService.createRoutine({
            routine: routineData,
            blocks: blocksData,
            exercisesInBlock: exercisesInBlockData,
            sets: setsData,
          });

      setSaveState("success");
      return savedRoutine.id;
    } catch (err) {
      console.error("Error saving routine:", err);
      setError("Error al guardar la rutina. Intenta nuevamente.");
      setSaveState("error");
      return null;
    }
  };

  const resetSaveState = () => {
    setSaveState("idle");
    setError(null);
  };

  return {
    saveRoutine,
    saveState,
    error,
    resetSaveState,
    isLoading: saveState === "saving",
    isSuccess: saveState === "success",
    isError: saveState === "error",
  };
};
