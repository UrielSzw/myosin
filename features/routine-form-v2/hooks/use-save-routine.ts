import { dataService } from "@/shared/data/data-service";
import type {
  BlockInsert,
  ExerciseInBlockInsert,
  RoutineInsert,
  SetInsert,
} from "@/shared/db/schema";
import { generateUUID } from "@/shared/db/utils/uuid";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { toSupportedLanguage } from "@/shared/types/language";
import { useState } from "react";
import { useRoutineFormState } from "./use-routine-form-store";
import { useRoutineValidation } from "./use-routine-validation";

type SaveState = "idle" | "saving" | "success" | "error";

export const useSaveRoutine = () => {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const formState = useRoutineFormState();
  const validation = useRoutineValidation();
  const { show_rpe, show_tempo } = useUserPreferences() || {};
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = routineFormTranslations;

  const saveRoutine = async (): Promise<string | null> => {
    if (!user) {
      setError(t.userNotAuthenticated[lang]);
      setSaveState("error");
      return null;
    }

    // Usar la validación centralizada
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError || t.validationErrors[lang]);
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
          : user.id,
        training_days: formState.routine.training_days || null,
        show_rpe: formState.routine.show_rpe ?? show_rpe ?? false,
        show_tempo: formState.routine.show_tempo ?? show_tempo ?? false,
      };

      // 2. Preparar bloques (eliminar tempId y asignar IDs reales)
      const blocksData: BlockInsert[] = formState.blocksByRoutine.map(
        (tempBlockId, index) => {
          const block = formState.blocks[tempBlockId];
          if (!block) throw new Error(`Block not found: ${tempBlockId}`);
          return {
            id: generateUUID(),
            user_id: user.id,
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
        const blockData = blocksData[index];
        if (blockData) {
          blockIdMapping[tempBlockId] = blockData.id;
        }
      });

      // 4. Preparar exercisesInBlock (eliminar tempId y asignar IDs reales)
      const exercisesInBlockData: ExerciseInBlockInsert[] = [];
      const exerciseIdMapping: Record<string, string> = {};

      formState.blocksByRoutine.forEach((tempBlockId) => {
        const exerciseIds = formState.exercisesByBlock[tempBlockId] || [];
        const blockId = blockIdMapping[tempBlockId];
        if (!blockId) return;

        exerciseIds.forEach((tempExerciseId) => {
          const exerciseInBlock = formState.exercisesInBlock[tempExerciseId];
          if (!exerciseInBlock) return;

          const realExerciseId = generateUUID();
          exerciseIdMapping[tempExerciseId] = realExerciseId;

          exercisesInBlockData.push({
            id: realExerciseId,
            user_id: user.id,
            block_id: blockId,
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
          if (!realExerciseId) return;

          setIds.forEach((tempSetId) => {
            const set = formState.sets[tempSetId];
            if (!set) return;

            setsData.push({
              id: generateUUID(),
              user_id: user.id,
              exercise_in_block_id: realExerciseId,
              measurement_template: set.measurement_template,
              primary_value: set.primary_value,
              secondary_value: set.secondary_value,
              primary_range: set.primary_range,
              secondary_range: set.secondary_range,
              rpe: set.rpe,
              order_index: set.order_index,
              set_type: set.set_type,
              tempo: set.tempo,
            });
          });
        }
      );

      // 6. Ejecutar transacción (create o update) - dataService hace SQLite + sync automático
      const formattedRoutineData = {
        routine: routineData,
        blocks: blocksData,
        exercisesInBlock: exercisesInBlockData,
        sets: setsData,
      };

      const savedRoutine = isEditMode
        ? await dataService.routines.updateRoutineWithData(
            formState.originalRoutineId!,
            formattedRoutineData
          )
        : await dataService.routines.createRoutineWithData(
            formattedRoutineData
          );

      setSaveState("success");
      return savedRoutine.id;
    } catch (err) {
      console.error("Error saving routine:", err);
      setError(t.errorSavingRoutine[lang]);
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
