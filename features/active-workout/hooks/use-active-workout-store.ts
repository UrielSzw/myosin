import { routinesRepository } from "@/shared/db/repository/routines";
import { BaseExercise, BaseRoutine } from "@/shared/db/schema";
import {
  WorkoutBlockInsert,
  WorkoutExerciseInsert,
  WorkoutSessionInsert,
  WorkoutSetInsert,
} from "@/shared/db/schema/workout-session";
import { IRepsType, ISetType } from "@/shared/types/workout";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  convertBlockToIndividualBlocks,
  createExercises,
  createIndividualBlocks,
  createMultiBlock,
  createNewSetForExercise,
  generateTempId,
  shouldShowRestTimer,
} from "../utils/store-helpers";

// Tipos para el estado activo (extienden los Insert types con campos temporales)
export type ActiveWorkoutSession = WorkoutSessionInsert & {
  tempId: string;
  routine: BaseRoutine; // Snapshot de la rutina para referencia
  original_sets_count: number; // Para detectar eliminaciones
};

export type ActiveWorkoutBlock = WorkoutBlockInsert & {
  tempId: string;
  workout_session_id: string; // tempId de la sesión
};

export type ActiveWorkoutExercise = WorkoutExerciseInsert & {
  tempId: string;
  exercise: BaseExercise; // Snapshot del ejercicio para UI
};

export type ActiveWorkoutSet = WorkoutSetInsert & {
  tempId: string;
  completed_at: string | null; // Timestamp cuando se completa (no está en DB)
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
    currentSetId?: string | null;
    currentRestTime?: number | null;
    currentRestTimeType?: "between-exercises" | "between-rounds" | null;
    currentRepsType?: IRepsType | null;
    currentSetType?: ISetType | null;
    exerciseModalMode?: "add-new" | "replace" | "add-to-block" | null;

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
    initializeWorkout: (routineId: string) => Promise<void>;
    clearWorkout: () => void;
    setExerciseModalMode: (
      mode: "add-new" | "replace" | "add-to-block" | null
    ) => void;
    clearCurrentState: () => void;
    setCurrentState: (state: Store["currentState"]) => void;
    detectWorkoutChanges: () => boolean;
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
  };

  setActions: {
    addSet: (exerciseInBlockId: string) => void;
    completeSet: (
      exerciseId: string,
      setId: string,
      blockId: string,
      completionData: {
        actualWeight: number | null;
        actualReps: number | null;
        actualRpe: number | null;
      }
    ) => boolean;
    uncompleteSet: (setId: string) => void;
    deleteSet: () => void;
    updateSetType: (setType: ISetType) => void;
  };

  timerActions: {
    startRestTimer: (seconds: number) => void;
    skipRestTimer: () => void;
    adjustRestTimer: (newSeconds: number) => void;
  };
};

const useActiveWorkoutStore = create<Store>()(
  immer((set) => ({
    // Estado principal - null cuando no hay workout activo
    activeWorkout: {
      session: null,
      blocks: {},
      exercises: {},
      sets: {},
      blocksBySession: [],
      exercisesByBlock: {},
      setsByExercise: {},
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
      currentRepsType: null,
      currentSetType: null,
      exerciseModalMode: null,
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
      initializeWorkout: async (routineId: string) => {
        try {
          // 1. Obtener la rutina completa con todos sus datos
          const routineData = await routinesRepository.findRoutineById(
            routineId
          );

          if (!routineData) {
            throw new Error(`Rutina con ID ${routineId} no encontrada`);
          }

          const { routine, blocks, exercisesInBlock, sets } = routineData;

          set((state) => {
            // 2. Crear sesión de workout
            const sessionTempId = generateTempId();
            const session: ActiveWorkoutSession = {
              tempId: sessionTempId,
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
            };

            // 3. Transformar bloques de routine a active workout
            const activeBlocks: Record<string, ActiveWorkoutBlock> = {};
            const blocksBySession: string[] = [];

            Object.values(blocks).forEach((block) => {
              const blockTempId = generateTempId();
              const activeBlock: ActiveWorkoutBlock = {
                tempId: blockTempId,
                id: blockTempId,
                workout_session_id: sessionTempId,
                original_block_id: block.id,
                name: block.name,
                type: block.type,
                order_index: block.order_index,
                rest_time_seconds: block.rest_time_seconds,
                rest_between_exercises_seconds:
                  block.rest_between_exercises_seconds,
                was_added_during_workout: false,
              };

              activeBlocks[blockTempId] = activeBlock;
              blocksBySession.push(blockTempId);
            });

            // 4. Transformar ejercicios
            const activeExercises: Record<string, ActiveWorkoutExercise> = {};
            const exercisesByBlock: Record<string, string[]> = {};

            Object.values(exercisesInBlock).forEach((exerciseData) => {
              const { exerciseInBlock, exercise } = exerciseData;
              const exerciseTempId = generateTempId();

              // Encontrar el bloque activo correspondiente
              const originalBlock = Object.values(blocks).find(
                (b) => b.id === exerciseInBlock.block_id
              );
              const activeBlock = Object.values(activeBlocks).find(
                (ab) => ab.original_block_id === originalBlock?.id
              );

              if (!activeBlock) return;

              const activeExercise: ActiveWorkoutExercise = {
                tempId: exerciseTempId,
                id: exerciseTempId,
                workout_block_id: activeBlock.tempId,
                exercise_id: exerciseInBlock.exercise_id,
                exercise: exercise, // Snapshot del ejercicio
                original_exercise_in_block_id: exerciseInBlock.id,
                order_index: exerciseInBlock.order_index,
                execution_order: null, // Se asigna cuando se ejecuta
                notes: exerciseInBlock.notes,
                was_added_during_workout: false,
              };

              activeExercises[exerciseTempId] = activeExercise;

              // Agregar al índice
              if (!exercisesByBlock[activeBlock.tempId]) {
                exercisesByBlock[activeBlock.tempId] = [];
              }
              exercisesByBlock[activeBlock.tempId].push(exerciseTempId);
            });

            // 5. Transformar sets
            const activeSets: Record<string, ActiveWorkoutSet> = {};
            const setsByExercise: Record<string, string[]> = {};

            Object.values(sets).forEach((set) => {
              const setTempId = generateTempId();

              // Encontrar el ejercicio activo correspondiente
              const originalExerciseData = Object.values(exercisesInBlock).find(
                (data) => data.exerciseInBlock.id === set.exercise_in_block_id
              );
              const activeExercise = Object.values(activeExercises).find(
                (ae) =>
                  ae.original_exercise_in_block_id ===
                  originalExerciseData?.exerciseInBlock.id
              );

              if (!activeExercise) return;

              const activeSet: ActiveWorkoutSet = {
                tempId: setTempId,
                id: setTempId,
                workout_exercise_id: activeExercise.tempId,
                original_set_id: set.id,
                order_index: set.order_index,
                reps_type: set.reps_type,
                set_type: set.set_type,
                // Valores planificados (del routine)
                planned_weight: set.weight,
                planned_reps: set.reps,
                planned_rpe: set.rpe,
                reps_range: set.reps_range,
                // Valores reales (se completan durante workout)
                actual_weight: null,
                actual_reps: null,
                actual_rpe: null,
                completed: false,
                completed_at: null, // Campo extra para el timestamp
              };

              activeSets[setTempId] = activeSet;

              // Agregar al índice
              if (!setsByExercise[activeExercise.tempId]) {
                setsByExercise[activeExercise.tempId] = [];
              }
              setsByExercise[activeExercise.tempId].push(setTempId);
            });

            // 6. Ordenar índices por order_index
            Object.keys(exercisesByBlock).forEach((blockId) => {
              exercisesByBlock[blockId].sort((a, b) => {
                const exerciseA = activeExercises[a];
                const exerciseB = activeExercises[b];
                return (
                  (exerciseA?.order_index || 0) - (exerciseB?.order_index || 0)
                );
              });
            });

            Object.keys(setsByExercise).forEach((exerciseId) => {
              setsByExercise[exerciseId].sort((a, b) => {
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

            // 7. Actualizar estado
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
            };

            // 8. Actualizar stats
            state.stats = {
              totalSetsPlanned: Object.keys(activeSets).length,
              totalSetsCompleted: 0,
            };

            // 9. Limpiar estado temporal
            state.currentState = {
              currentBlockId: null,
              currentExerciseInBlockId: null,
              currentSetId: null,
              currentRestTime: null,
              currentRestTimeType: null,
              currentRepsType: null,
              currentSetType: null,
              exerciseModalMode: null,
              currentExercisesCount: null,
              currentExerciseName: null,
              isCurrentBlockMulti: false,
            };

            // 10. Limpiar timer
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
            currentRepsType: null,
            currentSetType: null,
            exerciseModalMode: null,
            currentExercisesCount: null,
            currentExerciseName: null,
            isCurrentBlockMulti: false,
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
            currentRepsType: null,
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
          if (exercise.original_exercise_in_block_id === null) return true;
        }

        // 3. Check sets agregados
        for (const set of Object.values(activeWorkout.sets)) {
          if (set.original_set_id === null) return true;
        }

        // 4. Check eliminaciones por diferencia de count
        const currentSetsCount = Object.keys(activeWorkout.sets).length;
        const originalSetsCount = activeWorkout.session.original_sets_count;

        if (currentSetsCount !== originalSetsCount) return true;

        return false; // Sin cambios
      },
    },

    blockActions: {
      addIndividualBlock: (selectedExercises) => {
        set((state) => {
          if (selectedExercises.length === 0) return;

          const currentBlockCount = state.activeWorkout.blocksBySession.length;

          const {
            newBlocks,
            newExercisesInBlock,
            newSets,
            exercisesByBlock,
            setsByExercise,
          } = createIndividualBlocks(selectedExercises, currentBlockCount);

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
      },
      addMultiBlock: (selectedExercises) => {
        set((state) => {
          if (selectedExercises.length === 0) return;

          const currentBlockCount = state.activeWorkout.blocksBySession.length;

          const {
            newBlock,
            newExercisesInBlock,
            newSets,
            exercisesByBlock,
            setsByExercise,
          } = createMultiBlock(selectedExercises, currentBlockCount);

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

          console.log("newExercisesInBlock", newExercisesInBlock);

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
      },
      deleteBlock: () => {
        set((state) => {
          const { currentBlockId } = state.currentState;

          if (!currentBlockId) return;

          delete state.activeWorkout.blocks[currentBlockId];
          delete state.activeWorkout.exercisesByBlock[currentBlockId];

          // Eliminar el bloque del índice
          state.activeWorkout.blocksBySession =
            state.activeWorkout.blocksBySession.filter(
              (bId) => bId !== currentBlockId
            );

          // Encontrar y eliminar ejercicios y sets asociados
          const exercisesToDelete = Object.values(
            state.activeWorkout.exercisesByBlock[currentBlockId] || []
          );

          exercisesToDelete.forEach((exerciseId) => {
            delete state.activeWorkout.exercises[exerciseId];
            delete state.activeWorkout.setsByExercise[exerciseId];
          });

          Object.values(exercisesToDelete).forEach((exerciseId) => {
            const setsToDelete =
              state.activeWorkout.setsByExercise[exerciseId] || [];
            setsToDelete.forEach((setId) => {
              delete state.activeWorkout.sets[setId];
            });
          });

          // Actualizar stats
          const setsRemoved = exercisesToDelete.reduce((acc, exerciseId) => {
            const setsForExercise =
              state.activeWorkout.setsByExercise[exerciseId] || [];
            return acc + setsForExercise.length;
          }, 0);

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
            .filter(Boolean);

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
            currentRepsType: null,
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
            id: newExerciseTempId, // Usar tempId como id temporal
            workout_block_id: currentExercise.workout_block_id,
            exercise_id: newExercise.id, // Nuevo ejercicio
            exercise: newExercise, // Nuevo snapshot
            original_exercise_in_block_id: null, // Ya no es original
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
                original_set_id: null, // Ya no es original
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
          if (exerciseIndex !== -1) {
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
          state.activeWorkout.exercisesByBlock[currentBlockId] =
            state.activeWorkout.exercisesByBlock[currentBlockId].filter(
              (id) => id !== currentExerciseInBlockId
            );

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
            currentRepsType: null,
            currentSetType: null,
            exerciseModalMode: null,
            currentExercisesCount: null,
            currentExerciseName: null,
            isCurrentBlockMulti: false,
          };
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
            state.activeWorkout.setsByExercise[exerciseInBlockId];

          const lastSet =
            state.activeWorkout.sets[currentSets[currentSets.length - 1]];

          const newSet: ActiveWorkoutSet = createNewSetForExercise(
            currentSets.length,
            lastSet?.planned_weight || null,
            lastSet?.planned_reps || null,
            lastSet?.reps_range || null,
            lastSet?.reps_type || "reps",
            exerciseInBlockId
          );

          // Agregar el nuevo set al estado
          state.activeWorkout.sets[newSet.tempId] = newSet;
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

          if (!set || set.completed) return;

          const { actualWeight, actualReps, actualRpe } = completionData;

          set.completed = true;
          set.completed_at = new Date().toISOString();
          set.actual_weight = actualWeight;
          set.actual_reps = actualReps;
          set.actual_rpe = actualRpe;

          state.stats.totalSetsCompleted += 1;

          const nextSetId = state.activeWorkout.setsByExercise[
            exerciseInBlockId
          ].find(
            (sId) =>
              state.activeWorkout.sets[sId].order_index === set.order_index + 1
          );
          const currentNextSet = nextSetId
            ? state.activeWorkout.sets[nextSetId]
            : null;

          const currentBlock = state.activeWorkout.blocks[blockId];
          const currentExercise =
            state.activeWorkout.exercises[exerciseInBlockId];

          const currentBlockExercises =
            state.activeWorkout.exercisesByBlock[blockId] || [];

          const isLastExercise =
            currentBlockExercises[currentBlockExercises.length - 1] ===
            currentExercise.tempId;

          if (
            shouldShowRestTimer(currentBlock, currentNextSet, isLastExercise)
          ) {
            const restTimeResult =
              currentBlock.type === "individual"
                ? currentBlock.rest_time_seconds
                : currentBlock.type === "superset"
                ? currentBlock.rest_time_seconds
                : currentBlock.rest_between_exercises_seconds;

            state.restTimer = {
              totalTime: restTimeResult,
              timeRemaining: restTimeResult,
              isActive: true,
              startedAt: Date.now(),
            };

            shouldStartTimer = true;
          }
        });

        return shouldStartTimer;
      },

      uncompleteSet: (setId) => {
        set((state) => {
          const set = state.activeWorkout.sets[setId];

          if (!set || !set.completed) return;

          set.completed = false;
          set.completed_at = null;
          set.actual_weight = null;
          set.actual_reps = null;
          set.actual_rpe = null;

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

          state.activeWorkout.setsByExercise[currentExerciseInBlockId] =
            state.activeWorkout.setsByExercise[currentExerciseInBlockId].filter(
              (id) => id !== currentSetId
            );

          state.stats.totalSetsPlanned -= 1;

          // Actualizar order index de los sets restantes
          state.activeWorkout.setsByExercise[currentExerciseInBlockId].forEach(
            (setId, index) => {
              const set = state.activeWorkout.sets[setId];

              if (set) {
                set.order_index = index;
              }
            }
          );
        });
      },

      updateSetType: (setType) => {
        set((state) => {
          const currentSetId = state.currentState.currentSetId;

          if (!currentSetId) return;

          const set = state.activeWorkout.sets[currentSetId];

          if (!set) return;

          set.set_type = setType;
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
