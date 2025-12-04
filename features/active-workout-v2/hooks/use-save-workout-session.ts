import { prRepository } from "@/shared/db/repository/pr";
import {
  workoutSessionsRepository,
  type CreateWorkoutSessionData,
} from "@/shared/db/repository/workout-sessions";
import type { PRCurrentInsert, PRHistoryInsert } from "@/shared/db/schema/pr";
import type {
  WorkoutBlockInsert,
  WorkoutExerciseInsert,
  WorkoutSessionInsert,
  WorkoutSetInsert,
} from "@/shared/db/schema/workout-session";
import { generateUUID } from "@/shared/db/utils/uuid";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { queryKeys } from "@/shared/queries/query-keys";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { toSupportedLanguage } from "@/shared/types/language";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useActiveWorkout } from "./use-active-workout-store";

type SaveSessionState = "idle" | "saving" | "success" | "error";

export const useSaveWorkoutSession = () => {
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = activeWorkoutTranslations;
  const [saveState, setSaveState] = useState<SaveSessionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const activeWorkout = useActiveWorkout();
  const queryClient = useQueryClient();
  const { sync } = useSyncEngine();
  const { user } = useAuth();

  const saveWorkoutSession = async (): Promise<string | null> => {
    if (!user) {
      setError(t.userNotAuthenticated[lang]);
      return null;
    }

    if (!activeWorkout?.session) {
      setError(t.noActiveWorkout[lang]);
      return null;
    }

    setSaveState("saving");
    setError(null);

    try {
      const session = activeWorkout.session;
      const currentTime = new Date().toISOString();
      const startTime = new Date(session.started_at).getTime();
      const endTime = new Date(currentTime).getTime();
      const durationSeconds = Math.floor((endTime - startTime) / 1000);

      // 1. Calcular analytics de sets completados
      const completedSets = Object.values(activeWorkout.sets).filter(
        (set) => set.completed
      );

      const totalSetsPlanned = Object.keys(activeWorkout.sets).length;
      const totalSetsCompleted = completedSets.length;

      // Calcular volumen total (peso * reps de sets completados)
      // Calcular volumen para weight_reps y weight_reps_range templates (weight * reps)
      const totalVolumeKg = completedSets.reduce((total, set) => {
        if (
          (set.measurement_template === "weight_reps" ||
            set.measurement_template === "weight_reps_range") &&
          set.actual_primary_value &&
          set.actual_secondary_value
        ) {
          return total + set.actual_primary_value * set.actual_secondary_value;
        }
        return total;
      }, 0);

      // Calcular RPE promedio (solo sets completados con RPE)
      const setsWithRpe = completedSets.filter((set) => set.actual_rpe);
      const averageRpe =
        setsWithRpe.length > 0
          ? setsWithRpe.reduce((sum, set) => sum + (set.actual_rpe || 0), 0) /
            setsWithRpe.length
          : null;

      // 2. Preparar sesión con IDs reales y analytics
      const realSessionId = generateUUID();
      const sessionData: WorkoutSessionInsert = {
        id: realSessionId,
        user_id: user.id,
        routine_id: session.routine_id,
        started_at: session.started_at,
        finished_at: currentTime,
        total_duration_seconds: durationSeconds,
        total_sets_planned: totalSetsPlanned,
        total_sets_completed: totalSetsCompleted,
        total_volume_kg: totalVolumeKg > 0 ? totalVolumeKg : null,
        average_rpe: averageRpe,
      };

      // 3. Preparar bloques con IDs reales
      const blocksData: WorkoutBlockInsert[] = [];
      const blockIdMapping: Record<string, string> = {};

      activeWorkout.blocksBySession.forEach((tempBlockId, index) => {
        const block = activeWorkout.blocks[tempBlockId];
        const realBlockId = generateUUID();

        blockIdMapping[tempBlockId] = realBlockId;

        blocksData.push({
          id: realBlockId,
          user_id: user.id,
          workout_session_id: realSessionId,
          type: block.type,
          order_index: index,
          name: block.name,
          rest_time_seconds: block.rest_time_seconds,
          rest_between_exercises_seconds: block.rest_between_exercises_seconds,
          was_added_during_workout: block.was_added_during_workout,
        });
      });

      // 4. Preparar ejercicios con IDs reales y calcular execution_order
      const exercisesData: WorkoutExerciseInsert[] = [];
      const exerciseIdMapping: Record<string, string> = {};

      // Obtener orden de ejecución basado en completed_at de los sets
      const getExecutionOrder = (tempExerciseId: string): number | null => {
        const exerciseSets = activeWorkout.setsByExercise[tempExerciseId] || [];
        const completedSets = exerciseSets
          .map((setId) => activeWorkout.sets[setId])
          .filter((set) => set.completed && set.completed_at)
          .sort(
            (a, b) =>
              new Date(a.completed_at!).getTime() -
              new Date(b.completed_at!).getTime()
          );

        return completedSets.length > 0
          ? new Date(completedSets[0].completed_at!).getTime()
          : null;
      };

      // Crear array de ejercicios con execution_order para ordenar
      const exerciseExecutionData: {
        tempId: string;
        executionTime: number | null;
        blockId: string;
        orderIndex: number;
      }[] = [];

      activeWorkout.blocksBySession.forEach((tempBlockId) => {
        const exerciseIds = activeWorkout.exercisesByBlock[tempBlockId] || [];
        exerciseIds.forEach((tempExerciseId) => {
          const exercise = activeWorkout.exercises[tempExerciseId];
          const executionTime = getExecutionOrder(tempExerciseId);

          exerciseExecutionData.push({
            tempId: tempExerciseId,
            executionTime,
            blockId: tempBlockId,
            orderIndex: exercise.order_index,
          });
        });
      });

      // Ordenar por execution_order global
      exerciseExecutionData.sort((a, b) => {
        if (a.executionTime === null && b.executionTime === null) return 0;
        if (a.executionTime === null) return 1;
        if (b.executionTime === null) return -1;
        return a.executionTime - b.executionTime;
      });

      // Asignar execution_order y crear ejercicios
      exerciseExecutionData.forEach((execData, globalIndex) => {
        const exercise = activeWorkout.exercises[execData.tempId];
        const realExerciseId = generateUUID();

        exerciseIdMapping[execData.tempId] = realExerciseId;

        exercisesData.push({
          id: realExerciseId,
          user_id: user.id,
          workout_block_id: blockIdMapping[execData.blockId],
          exercise_id: exercise.exercise_id,
          order_index: exercise.order_index,
          execution_order: execData.executionTime ? globalIndex : null,
          notes: exercise.notes,
          was_added_during_workout: exercise.was_added_during_workout,
        });
      });

      // 5. Preparar sets con IDs reales (solo sets completados)
      const setsData: WorkoutSetInsert[] = [];

      Object.entries(activeWorkout.setsByExercise).forEach(
        ([tempExerciseId, setIds]) => {
          const realExerciseId = exerciseIdMapping[tempExerciseId];
          const exercise = activeWorkout.exercises[tempExerciseId];

          setIds.forEach((tempSetId) => {
            const set = activeWorkout.sets[tempSetId];

            // Solo guardar sets completados en el historial
            if (set.completed) {
              setsData.push({
                id: generateUUID(),
                user_id: user.id,
                workout_exercise_id: realExerciseId,
                exercise_id: exercise.exercise_id,
                order_index: set.order_index,
                measurement_template: set.measurement_template,
                planned_primary_value: set.planned_primary_value,
                planned_secondary_value: set.planned_secondary_value,
                planned_primary_range: set.planned_primary_range,
                planned_secondary_range: set.planned_secondary_range,
                planned_rpe: set.planned_rpe,
                planned_tempo: set.planned_tempo,
                actual_primary_value: set.actual_primary_value,
                actual_secondary_value: set.actual_secondary_value,
                actual_rpe: set.actual_rpe,
                set_type: set.set_type,
                completed: true,
              });
            }
          });
        }
      );

      // 6. Guardar en base de datos
      const createData: CreateWorkoutSessionData = {
        session: sessionData,
        blocks: blocksData,
        exercises: exercisesData,
        sets: setsData,
      };

      const savedSession =
        await workoutSessionsRepository.createWorkoutSessionWithData(
          createData
        );

      // Sync to Supabase after saving workout session
      await sync("WORKOUT_COMPLETE", {
        ...createData,
        id: savedSession.id,
      });

      // Persistir PRs buffer: usar sessionBestPRs (solo 1 PR por ejercicio máximo)
      try {
        const sessionPRs = Object.values(activeWorkout.sessionBestPRs || {});

        const prHistoryArray: PRHistoryInsert[] = sessionPRs.map((pr) => ({
          user_id: user.id,
          exercise_id: pr.exercise_id,
          weight: pr.weight,
          reps: pr.reps,
          estimated_1rm: pr.estimated_1rm,
          workout_session_id: savedSession.id,
          workout_set_id: null,
          source: "auto",
          created_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString(),
        }));

        const prCurrentArray: PRCurrentInsert[] = sessionPRs.map((pr) => ({
          user_id: user.id,
          exercise_id: pr.exercise_id,
          best_weight: pr.weight,
          best_reps: pr.reps,
          estimated_1rm: pr.estimated_1rm,
          achieved_at: pr.created_at,
          source: "auto",
          created_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString(),
        }));

        // Insert each history row
        for (const h of prHistoryArray) {
          try {
            await prRepository.insertPRHistory(h);
            // Sync PR history to Supabase
            await sync("PR_UPDATE", h);
          } catch (e) {
            console.warn("Failed to insert PR history", h.exercise_id, e);
          }
        }

        // Upsert each current PR
        for (const c of prCurrentArray) {
          try {
            await prRepository.upsertCurrentPR(c);
            // Sync current PR to Supabase
            await sync("PR_CREATE", c);
          } catch (e) {
            console.warn("Failed to upsert current PR", c.exercise_id, e);
          }
        }
      } catch (err) {
        console.warn("Error persisting session PRs:", err);
      }

      setSaveState("success");

      // Invalidar analíticas del dashboard
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });

      return savedSession.id;
    } catch (err) {
      console.error("Error saving workout session:", err);
      setError(t.errorSavingSession[lang]);
      setSaveState("error");
      return null;
    }
  };

  const resetSaveState = () => {
    setSaveState("idle");
    setError(null);
  };

  return {
    saveWorkoutSession,
    saveState,
    error,
    resetSaveState,
    isLoading: saveState === "saving",
    isSuccess: saveState === "success",
    isError: saveState === "error",
  };
};
