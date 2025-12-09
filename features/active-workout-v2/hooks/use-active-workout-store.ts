import { dataService } from "@/shared/data/data-service";
import { prRepository } from "@/shared/db/repository/pr";
import { routinesRepository } from "@/shared/db/repository/routines";
import { workoutSessionsRepository } from "@/shared/db/repository/workout-sessions";
import { BaseExercise, BaseRoutine } from "@/shared/db/schema";
import type { BasePRCurrent } from "@/shared/db/schema/pr";
import {
  WorkoutBlockInsert,
  WorkoutExerciseInsert,
  WorkoutSessionInsert,
  WorkoutSetInsert,
} from "@/shared/db/schema/workout-session";
import { computePRScore, isPRBetter } from "@/shared/db/utils/pr";
import { useUserPreferencesStore } from "@/shared/hooks/use-user-preferences-store";
import {
  getMeasurementTemplate,
  MeasurementTemplateId,
} from "@/shared/types/measurement";
import { ISetType, RPEValue } from "@/shared/types/workout";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  convertBlockToIndividualBlocks,
  createExercises,
  createIndividualBlocks,
  createMultiBlock,
  createNewSetForExercise,
  generateTempId,
  getCircuitRestType,
  shouldShowRestTimer,
} from "../utils/store-helpers";

// Tipos para el estado activo (extienden los Insert types con campos temporales)
export type ActiveWorkoutSession = WorkoutSessionInsert & {
  tempId: string;
  routine: BaseRoutine; // Snapshot de la rutina para referencia
  original_sets_count: number; // Para detectar eliminaciones
  hasBeenPerformed: boolean; // Si esta rutina ya fue realizada antes
};

export type ActiveWorkoutBlock = WorkoutBlockInsert & {
  tempId: string;
  workout_session_id: string; // tempId de la sesión
  was_modified_during_workout?: boolean; // NUEVO: para detectar modificaciones
};

export type ActiveWorkoutExercise = WorkoutExerciseInsert & {
  tempId: string;
  exercise: BaseExercise; // Snapshot del ejercicio para UI
  pr?: BasePRCurrent | null;
};

export type ActiveWorkoutSet = Omit<
  WorkoutSetInsert,
  "actual_primary_range" | "actual_secondary_range"
> & {
  tempId: string;
  completed_at: string | null; // Timestamp cuando se completa (no está en DB)
  was_pr?: boolean;
  was_modified_during_workout?: boolean; // NUEVO: para detectar modificaciones
};

// Tipo para previous sets history
export type PreviousSetData = {
  order_index: number;
  measurement_template: MeasurementTemplateId;
  actual_primary_value: number | null;
  actual_secondary_value: number | null;
  actual_rpe: number | null;
  session_date: string;
};

type Store = {
  // Estado principal del workout activo
  activeWorkout: {
    session: ActiveWorkoutSession | null; // null cuando no hay workout activo

    // Data normalizada (como routine-form)
    blocks: Record<string, ActiveWorkoutBlock>;
    exercises: Record<string, ActiveWorkoutExercise>;
    sets: Record<string, ActiveWorkoutSet>;

    // Índices para performance O(1)
    blocksBySession: string[]; // orden de bloques
    exercisesByBlock: Record<string, string[]>; // ejercicios por bloque
    setsByExercise: Record<string, string[]>; // sets por ejercicio

    // Previous sets history por ejercicio
    exercisePreviousSets: Record<string, PreviousSetData[]>; // exercise_id → last sets
    // Session-best PRs: solo UN PR por ejercicio máximo (el mejor de la sesión)
    // Now supports ALL measurement templates
    sessionBestPRs: Record<
      string,
      {
        tempSetId: string;
        exercise_id: string;
        measurement_template: MeasurementTemplateId;
        primary_value: number;
        secondary_value: number | null;
        pr_score: number;
        created_at: string;
      }
    >; // exercise_id → best PR data
    // User ID for current workout session
    userId: string | null;
  };

  // Timer de descanso
  restTimer: {
    timeRemaining: number;
    totalTime: number;
    isActive: boolean;
    startedAt: number; // timestamp
  } | null;

  // Estado de edición temporal (similar al routine-form)
  currentState: {
    currentBlockId?: string | null;
    currentExerciseInBlockId?: string | null;
    currentExerciseId?: string | null;
    currentSetId?: string | null;
    currentRestTime?: number | null;
    currentRestTimeType?: "between-exercises" | "between-rounds" | null;
    currentSetType?: ISetType | null;
    exerciseModalMode?: "add-new" | "replace" | "add-to-block" | null;
    currentRpeValue?: RPEValue | null;
    currentTempo?: string | null;

    currentExercisesCount?: number | null;
    currentExerciseName?: string | null;

    isCurrentBlockMulti?: boolean;
  };

  // Analytics en tiempo real (calculadas)
  stats: {
    totalSetsPlanned: number;
    totalSetsCompleted: number;
  };

  mainActions: {
    initializeWorkout: (routineId: string, userId: string) => Promise<void>;
    initializeQuickWorkout: (
      userId: string,
      name?: string
    ) => Promise<{
      id: string;
      name: string;
      created_by_user_id: string;
      is_quick_workout: boolean;
      show_rpe: boolean;
      show_tempo: boolean;
    }>;
    clearWorkout: () => void;
    setExerciseModalMode: (
      mode: "add-new" | "replace" | "add-to-block" | null
    ) => void;
    clearCurrentState: () => void;
    setCurrentState: (state: Store["currentState"]) => void;
    detectWorkoutChanges: () => boolean;
    loadPreviousSetsForExercises: (exerciseIds: string[]) => Promise<void>;

    // PR Management
    setSessionBestPR: (
      exerciseId: string,
      prData: {
        tempSetId: string;
        measurement_template: MeasurementTemplateId;
        primary_value: number;
        secondary_value: number | null;
        pr_score: number;
      }
    ) => void;
    removeSessionPR: (exerciseId: string) => void;
    clearAllSessionPRs: () => void;
  };

  blockActions: {
    addIndividualBlock: (selectedExercises: BaseExercise[]) => void;
    addMultiBlock: (selectedExercises: BaseExercise[]) => void;
    addToBlock: (selectedExercises: BaseExercise[]) => void;
    deleteBlock: () => void;
    updateRestTime: (restTime: number) => void;
    convertBlockToIndividual: () => void;
  };

  exerciseActions: {
    replaceExercise: (selectedExercises: BaseExercise[]) => void;
    deleteExercise: () => void;
    /**
     * Updates the measurement template for an exercise and all its sets.
     * Can only be called if no sets have been completed for this exercise.
     * @param exerciseInBlockId - The exercise to update
     * @param newTemplate - The new measurement template
     */
    updateExerciseMeasurementTemplate: (
      exerciseInBlockId: string,
      newTemplate: MeasurementTemplateId
    ) => void;
  };

  setActions: {
    addSet: (exerciseInBlockId: string) => void;
    completeSet: (
      exerciseId: string,
      setId: string,
      blockId: string,
      completionData: {
        primaryValue: number | null;
        secondaryValue: number | null;
        actualRpe: number | null;
        estimated1RM: number | null;
        isPR: boolean;
      }
    ) => boolean;
    uncompleteSet: (setId: string) => void;
    deleteSet: () => void;
    updateSetType: (setType: ISetType) => void;
    updateRpe: (rpe: RPEValue | null) => void;
    /**
     * Updates a set's actual value and triggers auto-fill for following sets
     * @param setId - The set to update
     * @param field - Which field to update ('primary' or 'secondary')
     * @param value - The new value
     * @param exerciseInBlockId - The exercise this set belongs to (for auto-fill)
     */
    updateSetValue: (
      setId: string,
      field: "primary" | "secondary",
      value: number | null,
      exerciseInBlockId: string
    ) => void;
    autoFillFollowingSets: (
      exerciseInBlockId: string,
      currentSetOrder: number,
      updates: {
        primaryValue?: number | null;
        secondaryValue?: number | null;
        previousPrimaryValue?: number | null;
        previousSecondaryValue?: number | null;
      }
    ) => void;
    /**
     * Auto-completes a time-based set from the Circuit Timer Mode
     * Marks the set as completed with the target duration
     */
    autoCompleteTimeSet: (
      setId: string,
      blockId: string,
      exerciseInBlockId: string,
      durationSeconds: number
    ) => void;
  };

  timerActions: {
    startRestTimer: (seconds: number) => void;
    skipRestTimer: () => void;
    adjustRestTimer: (newSeconds: number) => void;
  };

  sharedActions: {
    setNewOrderBlocks: (newOrder: Record<string, ActiveWorkoutBlock>) => void;
    setNewOrderBlocksIds: (newOrderIds: string[]) => void;
    setNewOrderExercises: (
      newOrder: Record<string, ActiveWorkoutExercise>
    ) => void;
    setNewOrderExercisesIds: (blockId: string, newOrderIds: string[]) => void;
  };
};

const useActiveWorkoutStore = create<Store>()(
  immer((set, get) => ({
    // Estado principal - null cuando no hay workout activo
    activeWorkout: {
      session: null,
      blocks: {},
      exercises: {},
      sets: {},
      blocksBySession: [],
      exercisesByBlock: {},
      setsByExercise: {},
      exercisePreviousSets: {},
      sessionBestPRs: {},
      userId: null, // User ID for current active workout
    },

    // Timer de descanso
    restTimer: null,

    // Estado de edición temporal
    currentState: {
      currentBlockId: null,
      currentExerciseInBlockId: null,
      currentSetId: null,
      currentRestTime: null,
      currentRestTimeType: null,
      currentSetType: null,
      exerciseModalMode: null,
      currentExercisesCount: null,
      currentRpeValue: null,
      currentExerciseName: null,
      currentExerciseId: null,
    },

    // Stats calculadas
    stats: {
      totalSetsPlanned: 0,
      totalSetsCompleted: 0,
      totalVolume: 0,
      averageRpe: null,
      completionPercentage: 0,
      currentExerciseExecutionOrder: 1,
    },

    mainActions: {
      initializeWorkout: async (routineId: string, userId: string) => {
        try {
          // 1. Obtener la rutina completa con todos sus datos
          const routineData = await routinesRepository.findRoutineById(
            routineId
          );

          if (!routineData) {
            throw new Error(`Rutina con ID ${routineId} no encontrada`);
          }

          const { routine, blocks, exercisesInBlock, sets } = routineData;

          // 2. Load previous sets for all exercises
          const exercisePreviousSets: Record<string, PreviousSetData[]> = {};

          // Get unique exercise IDs from all exercises in the routine
          const uniqueExerciseIds = Array.from(
            new Set(
              Object.values(exercisesInBlock).map(
                (data) => data.exerciseInBlock.exercise_id
              )
            )
          );

          // Load previous sets for each unique exercise
          for (const exerciseId of uniqueExerciseIds) {
            try {
              const previousSets =
                await workoutSessionsRepository.getLastSetsForExercise(
                  exerciseId,
                  userId
                );
              exercisePreviousSets[exerciseId] = previousSets;
            } catch (error) {
              console.warn(
                `Failed to load previous sets for exercise ${exerciseId}:`,
                error
              );
              // Continue with empty previous sets for this exercise
              exercisePreviousSets[exerciseId] = [];
            }
          }

          // 3. Load current PRs for all exercises in the routine
          let prMap: Record<string, BasePRCurrent | null> = {};
          try {
            prMap = await prRepository.getCurrentPRsForExercises(
              userId,
              uniqueExerciseIds
            );
          } catch (error) {
            console.warn("Failed to load PRs for exercises:", error);
            prMap = {};
          }

          // 4. Check if this routine has been performed before
          let hasBeenPerformed = false;
          try {
            hasBeenPerformed =
              await workoutSessionsRepository.hasRoutineBeenPerformed(
                routineId,
                userId
              );
          } catch (error) {
            console.warn("Failed to check routine performance history:", error);
            hasBeenPerformed = false;
          }

          set((state) => {
            // 5. Crear sesión de workout
            const sessionTempId = generateTempId();
            const session: ActiveWorkoutSession = {
              tempId: sessionTempId,
              user_id: userId,
              id: sessionTempId,
              routine_id: routine.id,
              routine: routine, // Snapshot para referencia
              started_at: new Date().toISOString(),
              finished_at: new Date().toISOString(), // Se actualizará al terminar
              total_duration_seconds: 0, // Se calculará al terminar
              total_sets_planned: 0, // Se calculará después
              total_sets_completed: 0,
              total_volume_kg: null,
              average_rpe: null,
              original_sets_count: 0, // Se calculará después
              hasBeenPerformed, // Boolean si esta rutina ya fue realizada antes
            };

            // 6. Transformar bloques de routine a active workout
            // Usamos Maps locales para mapear IDs originales → tempIds
            const activeBlocks: Record<string, ActiveWorkoutBlock> = {};
            const blocksBySession: string[] = [];
            const blockIdToTempId = new Map<string, string>(); // NUEVO: mapeo para lookup

            Object.values(blocks).forEach((block) => {
              const blockTempId = generateTempId();
              const activeBlock: ActiveWorkoutBlock = {
                tempId: blockTempId,
                user_id: userId,
                id: blockTempId,
                workout_session_id: sessionTempId,
                name: block.name,
                type: block.type,
                order_index: block.order_index,
                rest_time_seconds: block.rest_time_seconds,
                rest_between_exercises_seconds:
                  block.rest_between_exercises_seconds,
                was_added_during_workout: false,
                was_modified_during_workout: false,
              };

              activeBlocks[blockTempId] = activeBlock;
              blocksBySession.push(blockTempId);
              blockIdToTempId.set(block.id, blockTempId); // NUEVO: guardar mapeo
            });

            // 7. Transformar ejercicios
            const activeExercises: Record<string, ActiveWorkoutExercise> = {};
            const exercisesByBlock: Record<string, string[]> = {};
            const exerciseInBlockIdToTempId = new Map<string, string>(); // NUEVO: mapeo para lookup

            Object.values(exercisesInBlock).forEach((exerciseData) => {
              const { exerciseInBlock, exercise } = exerciseData;
              const exerciseTempId = generateTempId();

              // Encontrar el bloque activo correspondiente usando el mapeo
              const activeBlockTempId = blockIdToTempId.get(
                exerciseInBlock.block_id
              );
              if (!activeBlockTempId) return;

              const activeExercise: ActiveWorkoutExercise = {
                tempId: exerciseTempId,
                user_id: userId,
                id: exerciseTempId,
                workout_block_id: activeBlockTempId,
                exercise_id: exerciseInBlock.exercise_id,
                exercise: exercise as BaseExercise,
                order_index: exerciseInBlock.order_index,
                execution_order: null,
                notes: exerciseInBlock.notes,
                was_added_during_workout: false,
                pr: prMap[exerciseInBlock.exercise_id] || null,
              };

              activeExercises[exerciseTempId] = activeExercise;
              exerciseInBlockIdToTempId.set(exerciseInBlock.id, exerciseTempId); // NUEVO: guardar mapeo

              // Agregar al índice
              if (!exercisesByBlock[activeBlockTempId]) {
                exercisesByBlock[activeBlockTempId] = [];
              }
              exercisesByBlock[activeBlockTempId].push(exerciseTempId);
            });

            // 8. Transformar sets
            const activeSets: Record<string, ActiveWorkoutSet> = {};
            const setsByExercise: Record<string, string[]> = {};

            Object.values(sets).forEach((set) => {
              const setTempId = generateTempId();

              // Encontrar el ejercicio activo correspondiente usando el mapeo
              const activeExerciseTempId = exerciseInBlockIdToTempId.get(
                set.exercise_in_block_id
              );
              if (!activeExerciseTempId) return;

              const activeExercise = activeExercises[activeExerciseTempId];
              if (!activeExercise) return;

              const activeSet: ActiveWorkoutSet = {
                tempId: setTempId,
                user_id: userId,
                exercise_id: activeExercise.exercise_id,
                id: setTempId,
                workout_exercise_id: activeExercise.tempId,
                order_index: set.order_index,
                measurement_template: set.measurement_template,
                set_type: set.set_type,
                planned_tempo: set.tempo,
                // Valores planificados (del routine)
                planned_primary_value: set.primary_value,
                planned_secondary_value: set.secondary_value,
                planned_primary_range: set.primary_range,
                planned_secondary_range: set.secondary_range,
                planned_rpe: set.rpe,
                // Valores reales (se completan durante workout)
                actual_primary_value: null,
                actual_secondary_value: null,
                actual_rpe: null,
                completed: false,
                completed_at: null, // Campo extra para el timestamp
                was_modified_during_workout: false, // NUEVO: inicializar en false
              };

              activeSets[setTempId] = activeSet;

              // Agregar al índice
              if (!setsByExercise[activeExercise.tempId]) {
                setsByExercise[activeExercise.tempId] = [];
              }
              setsByExercise[activeExercise.tempId]?.push(setTempId);
            });

            // 9. Ordenar índices por order_index
            Object.keys(exercisesByBlock).forEach((blockId) => {
              exercisesByBlock[blockId]?.sort((a, b) => {
                const exerciseA = activeExercises[a];
                const exerciseB = activeExercises[b];
                return (
                  (exerciseA?.order_index || 0) - (exerciseB?.order_index || 0)
                );
              });
            });

            Object.keys(setsByExercise).forEach((exerciseId) => {
              setsByExercise[exerciseId]?.sort((a, b) => {
                const setA = activeSets[a];
                const setB = activeSets[b];
                return (setA?.order_index || 0) - (setB?.order_index || 0);
              });
            });

            // Ordenar bloques por order_index
            blocksBySession.sort((a, b) => {
              const blockA = activeBlocks[a];
              const blockB = activeBlocks[b];
              return (blockA?.order_index || 0) - (blockB?.order_index || 0);
            });

            // 10. Actualizar estado
            state.activeWorkout = {
              session: {
                ...session,
                total_sets_planned: Object.keys(activeSets).length,
                original_sets_count: Object.keys(activeSets).length,
              },
              blocks: activeBlocks,
              exercises: activeExercises,
              sets: activeSets,
              blocksBySession,
              exercisesByBlock,
              setsByExercise,
              exercisePreviousSets, // Use the loaded previous sets
              sessionBestPRs: {},
              userId, // Store userId for later use
            };

            // 11. Actualizar stats
            state.stats = {
              totalSetsPlanned: Object.keys(activeSets).length,
              totalSetsCompleted: 0,
            };

            // 12. Limpiar estado temporal
            state.currentState = {
              currentBlockId: null,
              currentExerciseInBlockId: null,
              currentSetId: null,
              currentRestTime: null,
              currentRestTimeType: null,
              currentSetType: null,
              exerciseModalMode: null,
              currentExercisesCount: null,
              currentExerciseName: null,
              isCurrentBlockMulti: false,
            };

            // 13. Limpiar timer
            state.restTimer = null;
          });
        } catch (error) {
          console.error("Error inicializando workout:", error);
          throw error;
        }
      },

      clearWorkout: () => {
        set((state) => {
          // Reiniciar todo el estado a valores iniciales
          state.activeWorkout = {
            session: null,
            blocks: {},
            exercises: {},
            sets: {},
            blocksBySession: [],
            exercisesByBlock: {},
            setsByExercise: {},
            exercisePreviousSets: {},
            sessionBestPRs: {},
            userId: null, // Clear userId on workout clear
          };

          state.stats = {
            totalSetsPlanned: 0,
            totalSetsCompleted: 0,
          };

          state.currentState = {
            currentBlockId: null,
            currentExerciseInBlockId: null,
            currentSetId: null,
            currentRestTime: null,
            currentRestTimeType: null,
            currentSetType: null,
            exerciseModalMode: null,
            currentExercisesCount: null,
            currentExerciseName: null,
            isCurrentBlockMulti: false,
            currentExerciseId: null,
          };

          state.restTimer = null;
        });
      },

      setExerciseModalMode: (mode) => {
        set((state) => {
          state.currentState.exerciseModalMode = mode;
        });
      },
      clearCurrentState: () => {
        set((state) => {
          state.currentState = {
            currentBlockId: null,
            currentExerciseInBlockId: null,
            currentSetId: null,
            currentRestTimeType: null,
            currentRestTime: null,
            currentExercisesCount: null,
            currentSetType: null,
            currentExerciseName: null,
            isCurrentBlockMulti: false,
            exerciseModalMode: null,
            currentRpeValue: null,
            currentTempo: null,
          };
        });
      },
      setCurrentState: (stateUpdate) => {
        set((state) => {
          state.currentState = {
            ...state.currentState,
            ...stateUpdate,
          };
        });
      },

      detectWorkoutChanges: () => {
        const state = useActiveWorkoutStore.getState();
        const { activeWorkout } = state;

        if (!activeWorkout.session) return false;

        // 1. Check bloques agregados
        for (const block of Object.values(activeWorkout.blocks)) {
          if (block.was_added_during_workout) return true;
        }

        // 2. Check ejercicios agregados/reemplazados
        for (const exercise of Object.values(activeWorkout.exercises)) {
          if (exercise.was_added_during_workout) return true;
        }

        // 3. Check eliminaciones por diferencia de count
        const currentSetsCount = Object.keys(activeWorkout.sets).length;
        const originalSetsCount = activeWorkout.session.original_sets_count;

        if (currentSetsCount !== originalSetsCount) return true;

        // 4. Check sets modificados (valores planificados cambiados)
        for (const set of Object.values(activeWorkout.sets)) {
          if (set.was_modified_during_workout) return true;
        }

        // 5. Check bloques modificados (rest time, etc)
        for (const block of Object.values(activeWorkout.blocks)) {
          if (block.was_modified_during_workout) return true;
        }

        return false; // Sin cambios
      },

      // Helper method to load previous sets for new exercises
      loadPreviousSetsForExercises: async (exerciseIds: string[]) => {
        try {
          const userId = get().activeWorkout.userId;
          if (!userId) {
            console.warn("No userId available, cannot load previous sets");
            return;
          }

          const newPreviousSets: Record<string, PreviousSetData[]> = {};

          // Load previous sets for each exercise
          for (const exerciseId of exerciseIds) {
            try {
              const previousSets =
                await workoutSessionsRepository.getLastSetsForExercise(
                  exerciseId,
                  userId
                );
              newPreviousSets[exerciseId] = previousSets;
            } catch (error) {
              console.warn(
                `Failed to load previous sets for exercise ${exerciseId}:`,
                error
              );
              newPreviousSets[exerciseId] = [];
            }
          }

          // Update the store with the loaded previous sets
          set((state) => {
            Object.assign(
              state.activeWorkout.exercisePreviousSets,
              newPreviousSets
            );
          });
        } catch (error) {
          console.error(
            "Failed to load previous sets for new exercises:",
            error
          );
        }
      },

      // PR Management Actions
      setSessionBestPR: (exerciseId: string, prData) => {
        set((state) => {
          state.activeWorkout.sessionBestPRs[exerciseId] = {
            tempSetId: prData.tempSetId,
            exercise_id: exerciseId,
            measurement_template: prData.measurement_template,
            primary_value: prData.primary_value,
            secondary_value: prData.secondary_value,
            pr_score: prData.pr_score,
            created_at: new Date().toISOString(),
          };
        });
      },

      removeSessionPR: (exerciseId: string) => {
        set((state) => {
          delete state.activeWorkout.sessionBestPRs[exerciseId];
        });
      },

      clearAllSessionPRs: () => {
        set((state) => {
          state.activeWorkout.sessionBestPRs = {};
        });
      },

      initializeQuickWorkout: async (userId: string, name?: string) => {
        try {
          // 1. Obtener preferencias del usuario para show_rpe y show_tempo
          const prefs = useUserPreferencesStore.getState().prefs;

          // 2. Crear rutina temporal vacía con is_quick_workout=true (sync automático)
          const quickRoutine =
            await dataService.routines.createQuickWorkoutRoutine(userId, {
              show_rpe: prefs?.show_rpe ?? false,
              show_tempo: prefs?.show_tempo ?? false,
              name,
            });

          set((state) => {
            // 2. Crear sesión de workout VACÍA
            const sessionTempId = generateTempId();
            const session: ActiveWorkoutSession = {
              tempId: sessionTempId,
              user_id: userId,
              id: sessionTempId,
              routine_id: quickRoutine.id,
              routine: quickRoutine, // Snapshot
              started_at: new Date().toISOString(),
              finished_at: new Date().toISOString(),
              total_duration_seconds: 0,
              total_sets_planned: 0,
              total_sets_completed: 0,
              total_volume_kg: null,
              average_rpe: null,
              original_sets_count: 0,
              hasBeenPerformed: false,
            };

            // 3. Inicializar estado VACÍO (sin bloques/ejercicios/sets)
            state.activeWorkout = {
              session,
              blocks: {},
              exercises: {},
              sets: {},
              blocksBySession: [],
              exercisesByBlock: {},
              setsByExercise: {},
              exercisePreviousSets: {},
              sessionBestPRs: {},
              userId, // Store userId for later use
            };

            state.stats = {
              totalSetsPlanned: 0,
              totalSetsCompleted: 0,
            };

            state.currentState = {
              currentBlockId: null,
              currentExerciseInBlockId: null,
              currentSetId: null,
              currentRestTime: null,
              currentRestTimeType: null,
              currentSetType: null,
              exerciseModalMode: null,
              currentExercisesCount: null,
              currentExerciseName: null,
              isCurrentBlockMulti: false,
            };

            state.restTimer = null;
          });

          // 4. Retornar datos de la rutina para sync
          return {
            id: quickRoutine.id,
            name: quickRoutine.name,
            created_by_user_id: quickRoutine.created_by_user_id,
            is_quick_workout: quickRoutine.is_quick_workout ?? true,
            show_rpe: quickRoutine.show_rpe,
            show_tempo: quickRoutine.show_tempo,
          };
        } catch (error) {
          console.error("Error initializing quick workout:", error);
          throw error;
        }
      },
    },

    blockActions: {
      addIndividualBlock: (selectedExercises) => {
        // Extract exercise IDs first
        const exerciseIds = selectedExercises.map((exercise) => exercise.id);

        set((state) => {
          if (selectedExercises.length === 0) return;

          const currentBlockCount = state.activeWorkout.blocksBySession.length;

          const prefs = useUserPreferencesStore.getState().prefs;
          const defaultRestTime = prefs?.default_rest_time_seconds ?? 60;

          const {
            newBlocks,
            newExercisesInBlock,
            newSets,
            exercisesByBlock,
            setsByExercise,
          } = createIndividualBlocks(
            selectedExercises,
            currentBlockCount,
            defaultRestTime
          );

          // Agregar nuevos bloques
          newBlocks.forEach((block) => {
            state.activeWorkout.blocks[block.tempId] = block;
            state.activeWorkout.blocksBySession.push(block.tempId);
          });

          // Agregar nuevos ejercicios
          newExercisesInBlock.forEach((exercise) => {
            state.activeWorkout.exercises[exercise.tempId] = exercise;
          });

          // Agregar nuevos sets
          newSets.forEach((set) => {
            state.activeWorkout.sets[set.tempId] = set;
          });

          // Actualizar índices
          Object.entries(exercisesByBlock).forEach(([blockId, exerciseIds]) => {
            state.activeWorkout.exercisesByBlock[blockId] = exerciseIds;
          });
          Object.entries(setsByExercise).forEach(([exerciseId, setIds]) => {
            state.activeWorkout.setsByExercise[exerciseId] = setIds;
          });

          // Actualizar stats
          state.stats.totalSetsPlanned += newSets.length;
        });

        // Load previous sets for newly added exercises (async, non-blocking)
        if (exerciseIds.length > 0) {
          // Use setTimeout to ensure this runs after the set operation is complete
          setTimeout(() => {
            useActiveWorkoutStore
              .getState()
              .mainActions.loadPreviousSetsForExercises(exerciseIds);
          }, 0);
        }
      },
      addMultiBlock: (selectedExercises) => {
        set((state) => {
          if (selectedExercises.length === 0) return;

          const currentBlockCount = state.activeWorkout.blocksBySession.length;

          const prefs = useUserPreferencesStore.getState().prefs;
          const defaultRestTime = prefs?.default_rest_time_seconds ?? 60;

          const {
            newBlock,
            newExercisesInBlock,
            newSets,
            exercisesByBlock,
            setsByExercise,
          } = createMultiBlock(
            selectedExercises,
            currentBlockCount,
            defaultRestTime
          );

          // Agregar nuevo bloque
          state.activeWorkout.blocks[newBlock.tempId] = newBlock;
          state.activeWorkout.blocksBySession.push(newBlock.tempId);

          // Agregar nuevos ejercicios
          newExercisesInBlock.forEach((exercise) => {
            state.activeWorkout.exercises[exercise.tempId] = exercise;
          });

          // Agregar nuevos sets
          newSets.forEach((set) => {
            state.activeWorkout.sets[set.tempId] = set;
          });

          // Actualizar índices
          Object.entries(exercisesByBlock).forEach(([blockId, exerciseIds]) => {
            state.activeWorkout.exercisesByBlock[blockId] = exerciseIds;
          });

          Object.entries(setsByExercise).forEach(([exerciseId, setIds]) => {
            state.activeWorkout.setsByExercise[exerciseId] = setIds;
          });

          // Actualizar stats
          state.stats.totalSetsPlanned += newSets.length;
        });
      },
      addToBlock: (selectedExercises) => {
        // Extract exercise IDs first
        const exerciseIds = selectedExercises.map((exercise) => exercise.id);

        set((state) => {
          if (selectedExercises.length === 0) return;

          const { currentBlockId } = state.currentState;

          if (!currentBlockId) return;

          const currentBlock = state.activeWorkout.blocks[currentBlockId];

          if (!currentBlock) return;

          const currentExercisesCount =
            state.activeWorkout.exercisesByBlock[currentBlockId]?.length || 0;

          const { newExercisesInBlock, newSets, setsByExercise } =
            createExercises(
              selectedExercises,
              currentBlockId,
              currentExercisesCount
            );

          // Agregar nuevos ejercicios
          newExercisesInBlock.forEach((exercise) => {
            state.activeWorkout.exercises[exercise.tempId] = exercise;
          });

          // Agregar nuevos sets
          newSets.forEach((set) => {
            state.activeWorkout.sets[set.tempId] = set;
          });

          // Actualizar índices
          if (!state.activeWorkout.exercisesByBlock[currentBlockId]) {
            state.activeWorkout.exercisesByBlock[currentBlockId] = [];
          }
          state.activeWorkout.exercisesByBlock[currentBlockId].push(
            ...newExercisesInBlock.map((ex) => ex.tempId)
          );

          Object.entries(setsByExercise).forEach(([exerciseId, setIds]) => {
            state.activeWorkout.setsByExercise[exerciseId] = setIds;
          });

          // Actualizar stats
          state.stats.totalSetsPlanned += newSets.length;

          // Si el bloque no era multi, convertirlo
          if (currentBlock.type === "individual") {
            currentBlock.type = "superset";
            currentBlock.name = "Superserie";
            currentBlock.rest_between_exercises_seconds = 0;
          }
        });

        // Load previous sets for newly added exercises (async, non-blocking)
        if (exerciseIds.length > 0) {
          // Use setTimeout to ensure this runs after the set operation is complete
          setTimeout(() => {
            useActiveWorkoutStore
              .getState()
              .mainActions.loadPreviousSetsForExercises(exerciseIds);
          }, 0);
        }
      },
      deleteBlock: () => {
        set((state) => {
          const { currentBlockId } = state.currentState;

          if (!currentBlockId) return;

          // ✅ PRIMERO: Obtener ejercicios antes de eliminar índices
          const exercisesToDelete =
            state.activeWorkout.exercisesByBlock[currentBlockId] || [];

          // ✅ SEGUNDO: Calcular sets antes de eliminar
          const setsRemoved = exercisesToDelete.reduce((acc, exerciseId) => {
            const setsForExercise =
              state.activeWorkout.setsByExercise[exerciseId] || [];
            return acc + setsForExercise.length;
          }, 0);

          // ✅ TERCERO: Ahora eliminar todo
          delete state.activeWorkout.blocks[currentBlockId];
          delete state.activeWorkout.exercisesByBlock[currentBlockId];

          // Eliminar el bloque del índice
          state.activeWorkout.blocksBySession =
            state.activeWorkout.blocksBySession.filter(
              (bId) => bId !== currentBlockId
            );

          // Eliminar ejercicios y sets asociados
          exercisesToDelete.forEach((exerciseId) => {
            delete state.activeWorkout.exercises[exerciseId];

            // Eliminar sets del ejercicio
            const setsToDelete =
              state.activeWorkout.setsByExercise[exerciseId] || [];
            setsToDelete.forEach((setId) => {
              delete state.activeWorkout.sets[setId];
            });

            delete state.activeWorkout.setsByExercise[exerciseId];
          });

          // ✅ CUARTO: Actualizar stats con el cálculo correcto
          state.stats.totalSetsPlanned -= setsRemoved;
        });
      },
      updateRestTime: (restTime) => {
        set((state) => {
          const { currentBlockId, currentRestTimeType } = state.currentState;

          if (!currentBlockId) return;

          const currentBlock = state.activeWorkout.blocks[currentBlockId];

          if (!currentBlock) return;

          if (currentRestTimeType === "between-exercises") {
            currentBlock.rest_between_exercises_seconds = restTime;

            if (restTime > 0) {
              currentBlock.type = "circuit";
              currentBlock.name = "Circuito";
            } else {
              currentBlock.type = "superset";
              currentBlock.name = "Superserie";
            }
          } else {
            currentBlock.rest_time_seconds = restTime;
          }

          // Marcar como modificado si no es un bloque nuevo
          if (!currentBlock.was_added_during_workout) {
            currentBlock.was_modified_during_workout = true;
          }
        });
      },
      convertBlockToIndividual: () => {
        set((state) => {
          const { currentBlockId } = state.currentState;

          if (!currentBlockId) return;

          const originalBlock = state.activeWorkout.blocks[currentBlockId];

          if (!originalBlock || originalBlock.type === "individual") return;

          // Obtener ejercicios del bloque
          const exerciseIds =
            state.activeWorkout.exercisesByBlock[currentBlockId] || [];
          const exercisesInBlock = exerciseIds
            .map((id) => state.activeWorkout.exercises[id])
            .filter((e): e is ActiveWorkoutExercise => e !== undefined);

          if (exercisesInBlock.length === 0) return;

          // Convertir a bloques individuales
          const {
            newBlocks,
            newExercisesInBlock,
            newSets,
            newExercisesByBlock,
            newSetsByExercise,
          } = convertBlockToIndividualBlocks(
            originalBlock,
            exercisesInBlock,
            state.activeWorkout.sets,
            state.activeWorkout.setsByExercise
          );

          // Remover bloque original y sus referencias
          delete state.activeWorkout.blocks[currentBlockId];
          delete state.activeWorkout.exercisesByBlock[currentBlockId];

          // Remover exercisesInBlock originales
          exerciseIds.forEach((exerciseId) => {
            delete state.activeWorkout.exercises[exerciseId];
            // Remover sets originales
            const setIds = state.activeWorkout.setsByExercise[exerciseId] || [];
            setIds.forEach((setId) => {
              delete state.activeWorkout.sets[setId];
            });
            delete state.activeWorkout.setsByExercise[exerciseId];
          });

          // Encontrar índice del bloque original en blocksBySession
          const originalBlockIndex =
            state.activeWorkout.blocksBySession.findIndex(
              (id) => id === currentBlockId
            );

          // Remover bloque original del array
          state.activeWorkout.blocksBySession =
            state.activeWorkout.blocksBySession.filter(
              (id) => id !== currentBlockId
            );

          // Agregar nuevos bloques al estado
          newBlocks.forEach((block, index) => {
            state.activeWorkout.blocks[block.tempId] = block;
            // Insertar en la posición original + índice
            state.activeWorkout.blocksBySession.splice(
              originalBlockIndex + index,
              0,
              block.tempId
            );
          });

          // Agregar nuevos exercisesInBlock
          newExercisesInBlock.forEach((exerciseInBlock) => {
            state.activeWorkout.exercises[exerciseInBlock.tempId] =
              exerciseInBlock;
          });

          // Agregar nuevos sets
          newSets.forEach((set) => {
            state.activeWorkout.sets[set.tempId] = set;
          });

          // Actualizar índices
          Object.assign(
            state.activeWorkout.exercisesByBlock,
            newExercisesByBlock
          );
          Object.assign(state.activeWorkout.setsByExercise, newSetsByExercise);

          // Limpiar currentState
          state.currentState = {
            currentBlockId: null,
            currentExerciseInBlockId: null,
            currentSetId: null,
            currentRestTimeType: null,
            currentRestTime: null,
            currentExercisesCount: null,
            currentSetType: null,
            currentExerciseName: null,
            isCurrentBlockMulti: false,
            exerciseModalMode: null,
          };
        });
      },
    },

    exerciseActions: {
      replaceExercise: (selectedExercises) => {
        set((state) => {
          const { currentExerciseInBlockId, currentBlockId } =
            state.currentState;

          if (
            !currentExerciseInBlockId ||
            !currentBlockId ||
            selectedExercises.length === 0
          )
            return;

          const currentExercise =
            state.activeWorkout.exercises[currentExerciseInBlockId];
          const currentBlock = state.activeWorkout.blocks[currentBlockId];
          const newExercise = selectedExercises[0];

          if (!currentExercise || !currentBlock || !newExercise) return;

          const currentExercisesInBlock =
            state.activeWorkout.exercisesByBlock[currentBlockId] || [];

          if (!currentExercisesInBlock.includes(currentExerciseInBlockId))
            return;

          // 1. Generar nuevo tempId para el ejercicio reemplazado
          const newExerciseTempId = generateTempId();

          // 2. Crear nuevo ejercicio manteniendo valores importantes
          const replacedExercise: ActiveWorkoutExercise = {
            tempId: newExerciseTempId,
            user_id: state.activeWorkout.userId ?? "",
            id: newExerciseTempId, // Usar tempId como id temporal
            workout_block_id: currentExercise.workout_block_id,
            exercise_id: newExercise.id, // Nuevo ejercicio
            exercise: newExercise, // Nuevo snapshot
            order_index: currentExercise.order_index, // Mantener posición
            execution_order: currentExercise.execution_order, // Mantener si ya se ejecutó
            notes: currentExercise.notes, // Mantener notas
            was_added_during_workout: true, // Marcar como modificado
          };

          // 3. Obtener sets actuales y crear nuevos con nuevos tempIds
          const oldSetIds =
            state.activeWorkout.setsByExercise[currentExerciseInBlockId] || [];
          const newSetIds: string[] = [];

          oldSetIds.forEach((oldSetId) => {
            const oldSet = state.activeWorkout.sets[oldSetId];
            if (oldSet) {
              const newSetTempId = generateTempId();

              // Crear nuevo set manteniendo todos los valores
              const newSet: ActiveWorkoutSet = {
                ...oldSet, // Mantener TODOS los valores (weights, reps, completed, etc.)
                tempId: newSetTempId, // Nuevo tempId
                id: newSetTempId, // Usar tempId como id temporal
                workout_exercise_id: newExerciseTempId, // Apuntar al nuevo ejercicio
              };

              // Guardar nuevo set
              state.activeWorkout.sets[newSetTempId] = newSet;
              newSetIds.push(newSetTempId);
            }
          });

          // 4. Eliminar ejercicio y sets viejos
          delete state.activeWorkout.exercises[currentExerciseInBlockId];
          delete state.activeWorkout.setsByExercise[currentExerciseInBlockId];

          oldSetIds.forEach((setId) => {
            delete state.activeWorkout.sets[setId];
          });

          // 5. Agregar ejercicio y sets nuevos
          state.activeWorkout.exercises[newExerciseTempId] = replacedExercise;
          state.activeWorkout.setsByExercise[newExerciseTempId] = newSetIds;

          // 6. Actualizar índice del bloque (reemplazar en la misma posición)
          const exerciseIndex = currentExercisesInBlock.indexOf(
            currentExerciseInBlockId
          );
          if (
            exerciseIndex !== -1 &&
            state.activeWorkout.exercisesByBlock[currentBlockId]
          ) {
            state.activeWorkout.exercisesByBlock[currentBlockId][
              exerciseIndex
            ] = newExerciseTempId;
          }

          // 7. Actualizar currentState para que apunte al nuevo ejercicio
          state.currentState.currentExerciseInBlockId = newExerciseTempId;
        });
      },
      deleteExercise: () => {
        set((state) => {
          const { currentExerciseInBlockId, currentBlockId } =
            state.currentState;

          if (!currentExerciseInBlockId || !currentBlockId) return;

          const currentExercise =
            state.activeWorkout.exercises[currentExerciseInBlockId];
          const currentBlock = state.activeWorkout.blocks[currentBlockId];

          if (!currentExercise || !currentBlock) return;

          // 1. Obtener y eliminar sets asociados al ejercicio
          const setIds =
            state.activeWorkout.setsByExercise[currentExerciseInBlockId] || [];
          setIds.forEach((setId) => {
            delete state.activeWorkout.sets[setId];
          });

          // 2. Eliminar del índice setsByExercise
          delete state.activeWorkout.setsByExercise[currentExerciseInBlockId];

          // 3. Eliminar ejercicio del Record principal
          delete state.activeWorkout.exercises[currentExerciseInBlockId];

          // 4. Eliminar del índice exercisesByBlock
          state.activeWorkout.exercisesByBlock[currentBlockId] = (
            state.activeWorkout.exercisesByBlock[currentBlockId] || []
          ).filter((id) => id !== currentExerciseInBlockId);

          // 5. Actualizar stats
          state.stats.totalSetsPlanned -= setIds.length;

          // 6. Si el bloque queda sin ejercicios, eliminar el bloque también
          if (
            state.activeWorkout.exercisesByBlock[currentBlockId].length === 0
          ) {
            delete state.activeWorkout.blocks[currentBlockId];
            delete state.activeWorkout.exercisesByBlock[currentBlockId];

            // Eliminar del índice blocksBySession
            state.activeWorkout.blocksBySession =
              state.activeWorkout.blocksBySession.filter(
                (bId) => bId !== currentBlockId
              );
          } else if (
            currentBlock.type !== "individual" &&
            state.activeWorkout.exercisesByBlock[currentBlockId].length === 1
          ) {
            // Si el bloque no es individual y queda 1 solo ejercicio, convertir a individual
            currentBlock.type = "individual";
            currentBlock.name = "Individual";
            currentBlock.rest_between_exercises_seconds = 0;
          }

          // 7. Limpiar currentState
          state.currentState = {
            currentBlockId: null,
            currentExerciseInBlockId: null,
            currentSetId: null,
            currentRestTime: null,
            currentRestTimeType: null,
            currentSetType: null,
            exerciseModalMode: null,
            currentExercisesCount: null,
            currentExerciseName: null,
            isCurrentBlockMulti: false,
          };
        });
      },
      updateExerciseMeasurementTemplate: (exerciseInBlockId, newTemplate) => {
        set((state) => {
          const setIds =
            state.activeWorkout.setsByExercise[exerciseInBlockId] || [];

          // Safety check: don't allow if any set is completed
          const hasCompletedSets = setIds.some(
            (setId) => state.activeWorkout.sets[setId]?.completed_at != null
          );
          if (hasCompletedSets) return;

          // Update all sets with the new measurement template
          // and clear values that don't apply to the new template
          setIds.forEach((setId) => {
            const set = state.activeWorkout.sets[setId];
            if (set) {
              set.measurement_template = newTemplate;
              // Clear all actual values since template changed
              set.actual_primary_value = null;
              set.actual_secondary_value = null;
              // Mark as modified so detectWorkoutChanges() suggests routine update
              set.was_modified_during_workout = true;
            }
          });
        });
      },
    },

    setActions: {
      addSet: (exerciseInBlockId) => {
        set((state) => {
          const exerciseInBlock =
            state.activeWorkout.exercises[exerciseInBlockId];

          if (!exerciseInBlock) return;

          const currentSets =
            state.activeWorkout.setsByExercise[exerciseInBlockId] || [];

          const lastSetId = currentSets[currentSets.length - 1];
          const lastSet = lastSetId
            ? state.activeWorkout.sets[lastSetId]
            : undefined;

          // Obtener lastPrevSet para herencia
          const exercisePrevSets =
            state.activeWorkout.exercisePreviousSets[
              exerciseInBlock.exercise_id
            ] || [];
          const lastPrevSet =
            exercisePrevSets[exercisePrevSets.length - 1] || null;

          const newSet: ActiveWorkoutSet = createNewSetForExercise(
            currentSets.length,
            lastSet?.planned_primary_value || null,
            lastSet?.planned_secondary_value || null,
            lastSet?.planned_primary_range || null,
            lastSet?.planned_secondary_range || null,
            lastSet?.measurement_template || "weight_reps",
            exerciseInBlockId,
            exerciseInBlock.exercise_id,
            lastPrevSet // Pasar como fallback
          );

          // Auto-fill BEGIN
          // Auto-fill actual values from last COMPLETED set (Option B)
          // Only for weight and distance fields (not reps, time, etc.)
          const lastCompletedSet = currentSets
            .slice()
            .reverse()
            .map((setId) => state.activeWorkout.sets[setId])
            .find((s) => s?.completed_at !== null);
          if (lastCompletedSet) {
            const template = getMeasurementTemplate(
              lastCompletedSet.measurement_template,
              "kg"
            );

            // Primary field: copy only if weight or distance
            const primaryFieldType = template.fields[0]?.type;
            if (
              (primaryFieldType === "weight" ||
                primaryFieldType === "distance") &&
              lastCompletedSet.actual_primary_value !== null
            ) {
              newSet.actual_primary_value =
                lastCompletedSet.actual_primary_value;
            }

            // Secondary field: copy only if weight or distance
            const secondaryFieldType = template.fields[1]?.type;
            if (
              (secondaryFieldType === "weight" ||
                secondaryFieldType === "distance") &&
              lastCompletedSet.actual_secondary_value !== null
            ) {
              newSet.actual_secondary_value =
                lastCompletedSet.actual_secondary_value;
            }
          }
          // Auto-fill END

          // Agregar el nuevo set al estado
          state.activeWorkout.sets[newSet.tempId] = newSet;
          if (!state.activeWorkout.setsByExercise[exerciseInBlockId]) {
            state.activeWorkout.setsByExercise[exerciseInBlockId] = [];
          }
          state.activeWorkout.setsByExercise[exerciseInBlockId].push(
            newSet.tempId
          );

          // Actualizar stats
          state.stats.totalSetsPlanned += 1;
        });
      },
      completeSet: (exerciseInBlockId, setId, blockId, completionData) => {
        let shouldStartTimer = false;

        set((state) => {
          const set = state.activeWorkout.sets[setId];
          const exerciseInBlock =
            state.activeWorkout.exercises[exerciseInBlockId];

          if (!set || set.completed || !exerciseInBlock) return;

          const { primaryValue, secondaryValue, actualRpe, isPR } =
            completionData;

          set.completed = true;
          set.completed_at = new Date().toISOString();
          set.actual_primary_value = primaryValue;
          set.actual_secondary_value = secondaryValue;
          set.actual_rpe = actualRpe;
          set.was_pr = isPR || false;

          // Handle PR detection and session-best tracking for ALL measurement templates
          if (isPR && primaryValue != null) {
            const exerciseId = set.exercise_id;
            const template = set.measurement_template;

            // Calculate PR score for this template
            const prScore = computePRScore(
              template,
              primaryValue,
              secondaryValue
            );

            const currentSessionBest =
              state.activeWorkout.sessionBestPRs[exerciseId];

            // Only keep the best PR per exercise in the session
            if (
              !currentSessionBest ||
              isPRBetter(prScore, currentSessionBest.pr_score)
            ) {
              // Clear was_pr from previous best set if it exists
              if (currentSessionBest) {
                const prevBestSet =
                  state.activeWorkout.sets[currentSessionBest.tempSetId];
                if (prevBestSet) {
                  prevBestSet.was_pr = false;
                }
              }

              // Set new session best
              state.activeWorkout.sessionBestPRs[exerciseId] = {
                tempSetId: set.tempId,
                exercise_id: exerciseId,
                measurement_template: template,
                primary_value: primaryValue,
                secondary_value: secondaryValue ?? null,
                pr_score: prScore,
                created_at: new Date().toISOString(),
              };
            } else {
              // This PR is not better than current session best
              set.was_pr = false;
            }
          }

          state.stats.totalSetsCompleted += 1;

          const setsForExercise =
            state.activeWorkout.setsByExercise[exerciseInBlockId] || [];
          const nextSetId = setsForExercise.find(
            (sId) =>
              state.activeWorkout.sets[sId]?.order_index === set.order_index + 1
          );
          const currentNextSet = nextSetId
            ? state.activeWorkout.sets[nextSetId] ?? null
            : null;

          const currentBlock = state.activeWorkout.blocks[blockId];
          const currentExercise =
            state.activeWorkout.exercises[exerciseInBlockId];

          if (!currentBlock || !currentExercise) return;

          const currentBlockExercises =
            state.activeWorkout.exercisesByBlock[blockId] || [];

          const isLastExercise =
            currentBlockExercises[currentBlockExercises.length - 1] ===
            currentExercise.tempId;

          if (
            shouldShowRestTimer(currentBlock, currentNextSet, isLastExercise)
          ) {
            let restTimeResult = 0;

            if (currentBlock.type === "individual") {
              restTimeResult = currentBlock.rest_time_seconds;
            } else if (currentBlock.type === "superset") {
              restTimeResult = currentBlock.rest_time_seconds;
            } else if (currentBlock.type === "circuit") {
              // Para circuitos, determinar si es entre ejercicios o entre rounds
              const exercisesInBlock = currentBlockExercises
                .map((exId) => state.activeWorkout.exercises[exId])
                .filter((e): e is ActiveWorkoutExercise => e !== undefined)
                .sort((a, b) => a.order_index - b.order_index);

              const circuitRestType = getCircuitRestType(
                currentBlock,
                set.order_index, // El set que acabamos de completar
                exercisesInBlock,
                state.activeWorkout.sets,
                state.activeWorkout.setsByExercise
              );

              if (circuitRestType === "between-rounds") {
                restTimeResult = currentBlock.rest_time_seconds;
              } else if (circuitRestType === "between-exercises") {
                restTimeResult = currentBlock.rest_between_exercises_seconds;
              } else {
                // circuitRestType es null, no mostrar timer
                return;
              }
            }

            if (restTimeResult > 0) {
              // ✅ Si hay un timer activo, actualizarlo en vez de resetearlo
              // Esto evita que el sheet se cierre y se vuelva a abrir
              if (state.restTimer?.isActive) {
                state.restTimer.totalTime = restTimeResult;
                state.restTimer.timeRemaining = restTimeResult;
                state.restTimer.startedAt = Date.now();
              } else {
                // Solo crear nuevo timer si no había uno activo
                state.restTimer = {
                  totalTime: restTimeResult,
                  timeRemaining: restTimeResult,
                  isActive: true,
                  startedAt: Date.now(),
                };
              }

              shouldStartTimer = true;
            }
          }
        });

        return shouldStartTimer;
      },

      uncompleteSet: (setId) => {
        set((state) => {
          const set = state.activeWorkout.sets[setId];

          if (!set || !set.completed) return;

          // If this set was the session-best PR, handle accordingly
          if (set.was_pr) {
            const exerciseId = set.exercise_id;
            const template = set.measurement_template;
            const currentSessionBest =
              state.activeWorkout.sessionBestPRs[exerciseId];

            // If this was the session-best PR, remove it and find new best
            if (
              currentSessionBest &&
              currentSessionBest.tempSetId === set.tempId
            ) {
              delete state.activeWorkout.sessionBestPRs[exerciseId];

              // Find the next best completed set for this exercise (excluding the one being uncompleted)
              const completedSetsForExercise = Object.values(
                state.activeWorkout.sets
              ).filter(
                (s) =>
                  s.exercise_id === exerciseId &&
                  s.completed &&
                  s.tempId !== setId &&
                  s.actual_primary_value != null
              );

              if (completedSetsForExercise.length > 0) {
                // Find the set with the highest PR score for this template
                const newBestSet = completedSetsForExercise.reduce((max, s) => {
                  const currentScore = computePRScore(
                    template,
                    s.actual_primary_value!,
                    s.actual_secondary_value
                  );
                  const maxScore = computePRScore(
                    template,
                    max.actual_primary_value!,
                    max.actual_secondary_value
                  );
                  return currentScore > maxScore ? s : max;
                });

                const newBestScore = computePRScore(
                  template,
                  newBestSet.actual_primary_value!,
                  newBestSet.actual_secondary_value
                );

                // Check if this new best is still a PR compared to historical PR
                const exerciseInBlock = Object.values(
                  state.activeWorkout.exercises
                ).find((ex) => ex.exercise_id === exerciseId);

                // Always set as session best if it's the best in session
                // Mark as PR if: 1) no historical PR, or 2) beats historical PR
                const isHistoricalPR = exerciseInBlock?.pr
                  ? isPRBetter(newBestScore, exerciseInBlock.pr.pr_score)
                  : true; // If no historical PR, any session best is a "PR"

                if (isHistoricalPR) {
                  // Set new session best
                  state.activeWorkout.sessionBestPRs[exerciseId] = {
                    tempSetId: newBestSet.tempId,
                    exercise_id: exerciseId,
                    measurement_template: template,
                    primary_value: newBestSet.actual_primary_value!,
                    secondary_value: newBestSet.actual_secondary_value ?? null,
                    pr_score: newBestScore,
                    created_at:
                      newBestSet.completed_at || new Date().toISOString(),
                  };

                  newBestSet.was_pr = true;
                }
              }
            }

            set.was_pr = false;
          }

          set.completed = false;
          set.completed_at = null;
          // Keep actual values so user can edit and re-complete
          // set.actual_primary_value, set.actual_secondary_value, set.actual_rpe are preserved

          state.stats.totalSetsCompleted -= 1;
        });
      },

      deleteSet: () => {
        set((state) => {
          const currentSetId = state.currentState.currentSetId;
          const currentExerciseInBlockId =
            state.currentState.currentExerciseInBlockId;

          if (!currentSetId || !currentExerciseInBlockId) return;

          delete state.activeWorkout.sets[currentSetId];

          state.activeWorkout.setsByExercise[currentExerciseInBlockId] = (
            state.activeWorkout.setsByExercise[currentExerciseInBlockId] || []
          ).filter((id) => id !== currentSetId);

          state.stats.totalSetsPlanned -= 1;

          // Actualizar order index de los sets restantes
          (
            state.activeWorkout.setsByExercise[currentExerciseInBlockId] || []
          ).forEach((setId, index) => {
            const set = state.activeWorkout.sets[setId];

            if (set) {
              set.order_index = index;
            }
          });
        });
      },

      updateSetType: (setType) => {
        set((state) => {
          const currentSetId = state.currentState.currentSetId;

          if (!currentSetId) return;

          const set = state.activeWorkout.sets[currentSetId];

          if (!set) return;

          set.set_type = setType;
          // Marcar como modificado - esto indica que el set fue cambiado
          set.was_modified_during_workout = true;
        });
      },

      updateRpe: (rpe) => {
        set((state) => {
          if (!state.currentState.currentSetId) return;

          const setId = state.currentState.currentSetId;
          const set = state.activeWorkout.sets[setId];

          if (set) {
            state.activeWorkout.sets[setId] = {
              ...set,
              actual_rpe: rpe,
            };
          }
        });
      },

      updateSetValue: (setId, field, value, exerciseInBlockId) => {
        const state = get();
        const currentSet = state.activeWorkout.sets[setId];
        if (!currentSet) return;

        // Get the previous value BEFORE updating (for auto-fill comparison)
        const previousValue =
          field === "primary"
            ? currentSet.actual_primary_value
            : currentSet.actual_secondary_value;

        // Update the current set's value
        set((state) => {
          const setToUpdate = state.activeWorkout.sets[setId];
          if (!setToUpdate) return;

          if (field === "primary") {
            setToUpdate.actual_primary_value = value;
          } else {
            setToUpdate.actual_secondary_value = value;
          }
        });

        // Trigger auto-fill for following sets (only for weight/distance fields)
        if (value !== null) {
          const firstSetId =
            state.activeWorkout.setsByExercise[exerciseInBlockId]?.[0];
          const firstSet = firstSetId
            ? state.activeWorkout.sets[firstSetId]
            : null;

          if (firstSet) {
            const template = getMeasurementTemplate(
              firstSet.measurement_template,
              "kg"
            );
            const fieldIndex = field === "primary" ? 0 : 1;
            const fieldType = template?.fields[fieldIndex]?.type;

            // Only auto-fill for weight and distance fields
            if (fieldType === "weight" || fieldType === "distance") {
              // Check if this exercise has planned values - if so, don't auto-fill
              const hasPrimaryPlanned =
                firstSet.planned_primary_value !== null &&
                firstSet.planned_primary_value !== 0;
              const hasSecondaryPlanned =
                firstSet.planned_secondary_value !== null &&
                firstSet.planned_secondary_value !== 0;

              const shouldAutoFill =
                field === "primary" ? !hasPrimaryPlanned : !hasSecondaryPlanned;

              if (shouldAutoFill) {
                get().setActions.autoFillFollowingSets(
                  exerciseInBlockId,
                  currentSet.order_index,
                  field === "primary"
                    ? {
                        primaryValue: value,
                        previousPrimaryValue: previousValue,
                      }
                    : {
                        secondaryValue: value,
                        previousSecondaryValue: previousValue,
                      }
                );
              }
            }
          }
        }
      },

      autoFillFollowingSets: (exerciseInBlockId, currentSetOrder, updates) => {
        set((state) => {
          // Guard: Check if there's an active workout
          if (!state.activeWorkout.session) return;

          // Get all sets for this exercise
          const setIds =
            state.activeWorkout.setsByExercise[exerciseInBlockId] || [];
          if (setIds.length === 0) return;

          // Get following sets (order_index > currentSetOrder, not completed)
          const followingSets = setIds
            .map((id) => state.activeWorkout.sets[id])
            .filter(
              (s): s is NonNullable<typeof s> =>
                s !== undefined &&
                s.order_index > currentSetOrder &&
                !s.completed_at
            );

          // Auto-fill logic: Update following sets that have the SAME value as the previous value
          followingSets.forEach((nextSet) => {
            // Handle primary value
            if (
              updates.primaryValue !== undefined &&
              updates.previousPrimaryValue !== undefined
            ) {
              // Only update if the next set's current value equals the previous value of the edited set
              if (
                nextSet.actual_primary_value === updates.previousPrimaryValue
              ) {
                nextSet.actual_primary_value = updates.primaryValue;
              }
            }

            // Handle secondary value
            if (
              updates.secondaryValue !== undefined &&
              updates.previousSecondaryValue !== undefined
            ) {
              if (
                nextSet.actual_secondary_value ===
                updates.previousSecondaryValue
              ) {
                nextSet.actual_secondary_value = updates.secondaryValue;
              }
            }
          });
        });
      },

      autoCompleteTimeSet: (
        setId,
        blockId,
        exerciseInBlockId,
        durationSeconds
      ) => {
        set((state) => {
          const setToComplete = state.activeWorkout.sets[setId];
          const exerciseInBlock =
            state.activeWorkout.exercises[exerciseInBlockId];

          if (!setToComplete || setToComplete.completed || !exerciseInBlock)
            return;

          // Mark as completed with the actual duration
          setToComplete.completed = true;
          setToComplete.completed_at = new Date().toISOString();
          // For time_only template, primary_value is the duration in seconds
          setToComplete.actual_primary_value = durationSeconds;

          // Update stats
          state.stats.totalSetsCompleted += 1;

          // Note: We don't trigger rest timer here because Circuit Timer Mode
          // handles its own rest timing internally
        });
      },
    },

    timerActions: {
      startRestTimer: (seconds) => {
        set((state) => {
          state.restTimer = {
            totalTime: seconds,
            timeRemaining: seconds,
            isActive: true,
            startedAt: Date.now(),
          };
        });
      },
      skipRestTimer: () => {
        set((state) => {
          state.restTimer = null;
        });
      },
      adjustRestTimer: (newSeconds) => {
        set((state) => {
          if (!state.restTimer) return;

          state.restTimer.timeRemaining = Math.max(0, newSeconds);
        });
      },
    },

    sharedActions: {
      setNewOrderBlocks: (newOrder) => {
        set((state) => {
          if (!state.activeWorkout) return;

          // Mark all reordered blocks as modified
          Object.values(newOrder).forEach((block) => {
            block.was_modified_during_workout = true;
          });

          state.activeWorkout.blocks = newOrder;
        });
      },
      setNewOrderBlocksIds: (newOrderIds) => {
        set((state) => {
          if (!state.activeWorkout) return;

          state.activeWorkout.blocksBySession = newOrderIds;
        });
      },
      setNewOrderExercises: (newOrder) => {
        set((state) => {
          if (!state.activeWorkout) return;

          state.activeWorkout.exercises = newOrder;
        });
      },
      setNewOrderExercisesIds: (blockId, newOrderIds) => {
        set((state) => {
          if (!state.activeWorkout) return;

          // Mark the block as modified when exercises are reordered
          if (state.activeWorkout.blocks[blockId]) {
            state.activeWorkout.blocks[blockId].was_modified_during_workout =
              true;
          }

          state.activeWorkout.exercisesByBlock = {
            ...state.activeWorkout.exercisesByBlock,
            [blockId]: newOrderIds,
          };
        });
      },
    },
  }))
);

export const useActiveWorkout = () =>
  useActiveWorkoutStore((state) => state.activeWorkout);

export const useActiveMainActions = () =>
  useActiveWorkoutStore((state) => state.mainActions);

export const useActiveSetActions = () =>
  useActiveWorkoutStore((state) => state.setActions);

export const useActiveWorkoutState = () =>
  useActiveWorkoutStore((state) => state.currentState);

export const useActiveBlockActions = () =>
  useActiveWorkoutStore((state) => state.blockActions);

export const useActiveExerciseActions = () =>
  useActiveWorkoutStore((state) => state.exerciseActions);

export const useActiveRestTimer = () =>
  useActiveWorkoutStore((state) => state.restTimer);

export const useActiveRestTimerActions = () =>
  useActiveWorkoutStore((state) => state.timerActions);

export const useActiveWorkoutStats = () =>
  useActiveWorkoutStore((state) => state.stats);

export const useActiveSharedActions = () =>
  useActiveWorkoutStore((state) => state.sharedActions);
