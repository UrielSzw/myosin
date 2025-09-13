import {
  workoutSessionsRepository,
  type CreateWorkoutSessionData,
} from "@/shared/db/repository/workout-sessions";
import type {
  WorkoutBlockInsert,
  WorkoutExerciseInsert,
  WorkoutSessionInsert,
  WorkoutSetInsert,
} from "@/shared/db/schema/workout-session";
import { randomUUID } from "crypto";
import { useState } from "react";
import { useActiveWorkout } from "./use-active-workout-store";

type SaveSessionState = "idle" | "saving" | "success" | "error";

export const useSaveWorkoutSession = () => {
  const [saveState, setSaveState] = useState<SaveSessionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const activeWorkout = useActiveWorkout();

  const saveWorkoutSession = async (): Promise<string | null> => {
    if (!activeWorkout?.session) {
      setError("No hay workout activo para guardar");
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
      const totalVolumeKg = completedSets.reduce((total, set) => {
        if (set.actual_weight && set.actual_reps) {
          return total + set.actual_weight * set.actual_reps;
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
      const realSessionId = randomUUID();
      const sessionData: WorkoutSessionInsert = {
        id: realSessionId,
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
        const realBlockId = randomUUID();

        blockIdMapping[tempBlockId] = realBlockId;

        blocksData.push({
          id: realBlockId,
          workout_session_id: realSessionId,
          original_block_id: block.original_block_id,
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
        const realExerciseId = randomUUID();

        exerciseIdMapping[execData.tempId] = realExerciseId;

        exercisesData.push({
          id: realExerciseId,
          workout_block_id: blockIdMapping[execData.blockId],
          exercise_id: exercise.exercise_id,
          original_exercise_in_block_id: exercise.original_exercise_in_block_id,
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

          setIds.forEach((tempSetId) => {
            const set = activeWorkout.sets[tempSetId];

            // Solo guardar sets completados en el historial
            if (set.completed) {
              setsData.push({
                id: randomUUID(),
                workout_exercise_id: realExerciseId,
                original_set_id: set.original_set_id,
                order_index: set.order_index,
                planned_weight: set.planned_weight,
                planned_reps: set.planned_reps,
                planned_rpe: set.planned_rpe,
                actual_weight: set.actual_weight,
                actual_reps: set.actual_reps,
                actual_rpe: set.actual_rpe,
                set_type: set.set_type,
                reps_type: set.reps_type,
                reps_range: set.reps_range,
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

      setSaveState("success");
      return savedSession.id;
    } catch (err) {
      console.error("Error saving workout session:", err);
      setError("Error al guardar la sesión. Intenta nuevamente.");
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
