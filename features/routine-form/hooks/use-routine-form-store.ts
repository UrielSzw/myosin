import {
  BaseExercise,
  BlockInsert,
  ExerciseInBlockInsert,
  RoutineInsert,
  SetInsert,
} from "@/shared/db/schema";
import { generateUUID } from "@/shared/db/utils/uuid";
import { ReorderExercise } from "@/shared/types/reorder";
import { IRepsType, ISetType, RPEValue } from "@/shared/types/workout";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { routinesService } from "../../workouts/service/routines";
import {
  convertBlockToIndividualBlocks,
  createExercises,
  createIndividualBlocks,
  createMultiBlock,
  createNewSetForExercise,
} from "../utils/store-helpers";

type Store = {
  exerciseModalState: {
    exerciseModalMode: "add-new" | "replace" | "add-to-block" | null;
    isExerciseModalOpen: boolean;
  };

  formState: {
    mode: "create" | "edit";
    originalRoutineId?: string;
    routine: RoutineInsert;
    blocks: Record<string, BlockInsert & { tempId: string }>;
    exercisesInBlock: Record<
      string,
      ExerciseInBlockInsert & { tempId: string; exercise: BaseExercise }
    >;
    sets: Record<string, SetInsert & { tempId: string }>;

    // Índices para performance O(1)
    blocksByRoutine: string[];
    exercisesByBlock: Record<string, string[]>;
    setsByExercise: Record<string, string[]>;
  };

  currentState: {
    currentBlockId?: string | null;
    currentExerciseInBlockId?: string | null;
    currentSetId?: string | null;

    currentRepsType?: IRepsType | null;
    currentRestTimeType?: "between-exercises" | "between-rounds" | null;
    currentRestTime?: number | null;
    currentSetType?: ISetType | null;
    currentSetTempo?: string | null;

    currentExercisesCount?: number | null;
    currentExerciseName?: string | null;

    isCurrentBlockMulti?: boolean;
  };

  sharedActions: {
    setNewOrderBlocks: (
      newOrder: Record<string, BlockInsert & { tempId: string }>
    ) => void;
    setNewOrderBlocksIds: (newOrderIds: string[]) => void;

    setNewOrderExercises: (newOrder: Record<string, ReorderExercise>) => void;
    setNewOrderExercisesIds: (blockId: string, newOrderIds: string[]) => void;
  };

  mainActions: {
    initializeForm: (
      routineId?: string,
      show_rpe?: boolean,
      show_tempo?: boolean
    ) => Promise<void>;
    clearForm: () => void;
    setIsExerciseModalOpen: (isOpen: boolean) => void;
    setExerciseModalMode: (
      mode: "add-new" | "replace" | "add-to-block" | null
    ) => void;
    clearCurrentState: () => void;
    setCurrentState: (state: Store["currentState"]) => void;
    setRoutineName: (name: string) => void;
    setTrainingDays: (days: string[]) => void;
    setRoutineFlags: (
      flags: Partial<{ show_rpe: boolean; show_tempo: boolean }>
    ) => void;
  };

  blockActions: {
    deleteBlock: () => void;
    addIndividualBlock: (selectedExercises: BaseExercise[]) => void;
    addMultiBlock: (selectedExercises: BaseExercise[]) => void;
    updateRestTime: (restTime: number) => void;
    convertBlockToIndividual: () => void;
    addToBlock: (selectedExercises: BaseExercise[]) => void;
  };

  exerciseActions: {
    deleteExercise: () => void;
    updateRepsType: (repsType: IRepsType) => void;
    replaceExercise: (selectedExercises: BaseExercise[]) => void;
  };

  setActions: {
    addSet: (exerciseInBlockId: string, repsType: IRepsType) => void;
    updateSet: (
      setId: string,
      updates: Partial<SetInsert & { tempId: string }>
    ) => void;
    deleteSet: () => void;
    updateSetType: (setType: ISetType) => void;
    updateRpe: (rpe: RPEValue | null) => void;
    updateTempo: (tempo: string | null) => void;
  };
};

const useRoutineFormStore = create<Store>()(
  immer((set, get) => ({
    formState: {
      mode: "create",
      routine: {
        id: "",
        name: "",
        folder_id: null,
        created_by_user_id: "",
        training_days: [],
        show_rpe: false,
        show_tempo: false,
      },
      blocks: {},
      exercisesInBlock: {},
      sets: {},
      blocksByRoutine: [],
      exercisesByBlock: {},
      setsByExercise: {},
    },
    selectedExercises: [],
    exerciseModalState: {
      isExerciseModalOpen: false,
      exerciseModalMode: null,
    },
    routineName: null,
    currentState: {
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
      currentSetTempo: null,
    },

    sharedActions: {
      setNewOrderBlocks: (newOrder) => {
        set((state) => {
          if (!state.formState) return;

          state.formState.blocks = newOrder;
        });
      },
      setNewOrderBlocksIds: (newOrderIds) => {
        set((state) => {
          if (!state.formState) return;

          state.formState.blocksByRoutine = newOrderIds;
        });
      },
      setNewOrderExercises: (newOrder) => {
        set((state) => {
          if (!state.formState) return;

          state.formState.exercisesInBlock = newOrder;
        });
      },
      setNewOrderExercisesIds: (blockId, newOrderIds) => {
        set((state) => {
          if (!state.formState) return;

          state.formState.exercisesByBlock = {
            ...state.formState.exercisesByBlock,
            [blockId]: newOrderIds,
          };
        });
      },
    },

    mainActions: {
      initializeForm: async (routineId, show_rpe, show_tempo) => {
        set((state) => {
          // Para crear nueva rutina
          if (!routineId) {
            state.formState = {
              mode: "create",
              routine: {
                id: "",
                name: "",
                folder_id: null,
                created_by_user_id: "", // Se asigna al guardar
                training_days: [],
                show_rpe: show_rpe ?? false,
                show_tempo: show_tempo ?? false,
              },
              blocks: {},
              exercisesInBlock: {},
              sets: {},
              blocksByRoutine: [],
              exercisesByBlock: {},
              setsByExercise: {},
            };
          }
        });

        // Para editar rutina existente
        if (routineId) {
          try {
            const routineData = await routinesService.getRoutineForEdit(
              routineId
            );

            set((state) => {
              // 1. Generar tempIds para bloques
              const blocksWithTempId: Record<
                string,
                BlockInsert & { tempId: string }
              > = {};
              const blockIdMapping: Record<string, string> = {}; // dbId -> tempId
              const blocksByRoutine: string[] = [];

              routineData.blocks.forEach((block) => {
                const tempId = `temp-block-${generateUUID()}`;
                blockIdMapping[block.id] = tempId;

                blocksWithTempId[tempId] = {
                  ...block,
                  tempId,
                  routine_id: routineId,
                };
                blocksByRoutine.push(tempId);
              });

              // 2. Generar tempIds para exercisesInBlock
              const exercisesInBlockWithTempId: Record<
                string,
                ExerciseInBlockInsert & {
                  tempId: string;
                  exercise: BaseExercise;
                }
              > = {};
              const exerciseIdMapping: Record<string, string> = {}; // dbId -> tempId
              const exercisesByBlock: Record<string, string[]> = {};

              routineData.exercisesInBlock.forEach(
                ({ exerciseInBlock, exercise }) => {
                  const tempId = `temp-exercise-${generateUUID()}`;
                  const blockTempId = blockIdMapping[exerciseInBlock.block_id];

                  exerciseIdMapping[exerciseInBlock.id] = tempId;

                  exercisesInBlockWithTempId[tempId] = {
                    ...exerciseInBlock,
                    tempId,
                    block_id: blockTempId,
                    exercise: exercise as BaseExercise,
                  };

                  // Agregar al índice exercisesByBlock
                  if (!exercisesByBlock[blockTempId]) {
                    exercisesByBlock[blockTempId] = [];
                  }
                  exercisesByBlock[blockTempId].push(tempId);
                }
              );

              // 3. Generar tempIds para sets
              const setsWithTempId: Record<
                string,
                SetInsert & { tempId: string }
              > = {};
              const setsByExercise: Record<string, string[]> = {};

              routineData.sets.forEach((set) => {
                const tempId = `temp-set-${generateUUID()}`;
                const exerciseTempId =
                  exerciseIdMapping[set.exercise_in_block_id];

                setsWithTempId[tempId] = {
                  ...set,
                  tempId,
                  exercise_in_block_id: exerciseTempId,
                };

                // Agregar al índice setsByExercise
                if (!setsByExercise[exerciseTempId]) {
                  setsByExercise[exerciseTempId] = [];
                }
                setsByExercise[exerciseTempId].push(tempId);
              });

              // 4. Actualizar el estado
              state.formState = {
                mode: "edit",
                originalRoutineId: routineId,
                routine: {
                  id: routineData.routine.id,
                  name: routineData.routine.name,
                  folder_id: routineData.routine.folder_id,
                  created_by_user_id: routineData.routine.created_by_user_id,
                  training_days: routineData.routine.training_days || [],
                  show_rpe: routineData.routine.show_rpe || false,
                  show_tempo: routineData.routine.show_tempo || false,
                },
                blocks: blocksWithTempId,
                exercisesInBlock: exercisesInBlockWithTempId,
                sets: setsWithTempId,
                blocksByRoutine,
                exercisesByBlock,
                setsByExercise,
              };
            });
          } catch (error) {
            console.error("Error loading routine for edit:", error);

            // Fallback a modo create si hay error
            set((state) => {
              state.formState = {
                mode: "create",
                routine: {
                  id: "",
                  name: "",
                  folder_id: null,
                  created_by_user_id: "",
                  training_days: [],
                  show_rpe: show_rpe || false,
                  show_tempo: show_tempo || false,
                },
                blocks: {},
                exercisesInBlock: {},
                sets: {},
                blocksByRoutine: [],
                exercisesByBlock: {},
                setsByExercise: {},
              };
            });
          }
        }
      },
      clearForm: () => {
        set((state) => {
          state.formState = {
            mode: "create",
            routine: {
              id: "",
              name: "",
              folder_id: null,
              created_by_user_id: "",
              training_days: [],
              show_rpe: false,
              show_tempo: false,
            },
            blocks: {},
            exercisesInBlock: {},
            sets: {},
            blocksByRoutine: [],
            exercisesByBlock: {},
            setsByExercise: {},
          };
        });
      },
      setIsExerciseModalOpen: (isOpen) => {
        set((state) => {
          state.exerciseModalState.isExerciseModalOpen = isOpen;
        });
      },
      setExerciseModalMode: (mode) => {
        set((state) => {
          state.exerciseModalState.exerciseModalMode = mode;
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
            currentSetTempo: null,
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
      setRoutineName: (name: string) => {
        set((state) => {
          state.formState.routine.name = name;
        });
      },
      setTrainingDays: (days: string[]) => {
        set((state) => {
          state.formState.routine.training_days = days;
        });
      },
      setRoutineFlags: (
        flags: Partial<{ show_rpe: boolean; show_tempo: boolean }>
      ) => {
        set((state) => {
          if (!state.formState) return;

          const current = state.formState.routine as any;
          state.formState.routine = { ...(current || {}), ...flags } as any;
        });
      },
    },

    blockActions: {
      deleteBlock: () => {
        set((state) => {
          const { currentState, formState } = state;

          if (!formState || !currentState.currentBlockId) return;

          const blockId = currentState.currentBlockId;

          // 1. Obtener ejercicios del bloque que se va a eliminar
          const exerciseIds = formState.exercisesByBlock[blockId] || [];

          // 2. Eliminar todos los sets de esos ejercicios
          exerciseIds.forEach((exerciseId) => {
            const setIds = formState.setsByExercise[exerciseId] || [];

            // Eliminar cada set del Record principal
            setIds.forEach((setId) => {
              delete state.formState.sets[setId];
            });

            // Eliminar entrada del índice setsByExercise
            delete state.formState.setsByExercise[exerciseId];
          });

          // 3. Eliminar todos los exercisesInBlock del bloque
          exerciseIds.forEach((exerciseId) => {
            delete state.formState.exercisesInBlock[exerciseId];
          });

          // 4. Eliminar el bloque del Record principal
          delete state.formState.blocks[blockId];

          // 5. Eliminar del índice blocksByRoutine
          state.formState.blocksByRoutine =
            state.formState.blocksByRoutine.filter((id) => id !== blockId);

          // 6. Eliminar del índice exercisesByBlock
          delete state.formState.exercisesByBlock[blockId];

          // 7. Limpiar currentState
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
          };
        });
      },
      addIndividualBlock: (selectedExercises) => {
        set((state) => {
          const { formState } = get();

          if (selectedExercises.length === 0 || !formState) return;

          const currentBlockCount = formState.blocks
            ? Object.keys(formState.blocks).length
            : 0;

          const {
            newBlocks,
            newExercisesInBlock,
            newSets,
            exercisesByBlock,
            setsByExercise,
          } = createIndividualBlocks(selectedExercises, currentBlockCount);

          if (!state.formState) return;

          // Agregar bloques al estado
          newBlocks.forEach((block) => {
            if (!state.formState) return;
            state.formState.blocks[block.tempId] = block;
            state.formState.blocksByRoutine.push(block.tempId);
          });

          // Agregar exercisesInBlock al estado
          newExercisesInBlock.forEach((exerciseInBlock) => {
            if (!state.formState) return;
            state.formState.exercisesInBlock[exerciseInBlock.tempId] =
              exerciseInBlock;
          });

          // Agregar sets al estado
          newSets.forEach((set) => {
            if (!state.formState) return;
            state.formState.sets[set.tempId] = set;
          });

          // Actualizar índices
          Object.assign(state.formState.exercisesByBlock, exercisesByBlock);
          Object.assign(state.formState.setsByExercise, setsByExercise);
        });
      },
      addMultiBlock: (selectedExercises) => {
        set((state) => {
          const { formState } = get();

          if (selectedExercises.length === 0 || !formState) return;

          const currentBlockCount = formState.blocks
            ? Object.keys(formState.blocks).length
            : 0;

          const {
            newBlock,
            newExercisesInBlock,
            newSets,
            exercisesByBlock,
            setsByExercise,
          } = createMultiBlock(selectedExercises, currentBlockCount);

          if (!state.formState) return;

          // Agregar el bloque al estado
          state.formState.blocks[newBlock.tempId] = newBlock;
          state.formState.blocksByRoutine.push(newBlock.tempId);

          // Agregar exercisesInBlock al estado
          newExercisesInBlock.forEach((exerciseInBlock) => {
            if (!state.formState) return;
            state.formState.exercisesInBlock[exerciseInBlock.tempId] =
              exerciseInBlock;
          });

          // Agregar sets al estado
          newSets.forEach((set) => {
            if (!state.formState) return;
            state.formState.sets[set.tempId] = set;
          });

          // Actualizar índices
          Object.assign(state.formState.exercisesByBlock, exercisesByBlock);
          Object.assign(state.formState.setsByExercise, setsByExercise);
        });
      },

      convertBlockToIndividual: () => {
        set((state) => {
          const { currentState, formState } = state;

          if (!formState || !currentState.currentBlockId) return;

          const blockId = currentState.currentBlockId;
          const originalBlock = formState.blocks[blockId];

          if (!originalBlock || originalBlock.type === "individual") return;

          // Obtener ejercicios del bloque
          const exerciseIds = formState.exercisesByBlock[blockId] || [];
          const exercisesInBlock = exerciseIds
            .map((id) => formState.exercisesInBlock[id])
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
            formState.sets,
            formState.setsByExercise
          );

          // Remover bloque original y sus referencias
          delete state.formState.blocks[blockId];
          delete state.formState.exercisesByBlock[blockId];

          // Remover exercisesInBlock originales
          exerciseIds.forEach((exerciseId) => {
            delete state.formState.exercisesInBlock[exerciseId];
            // Remover sets originales
            const setIds = formState.setsByExercise[exerciseId] || [];
            setIds.forEach((setId) => {
              delete state.formState.sets[setId];
            });
            delete state.formState.setsByExercise[exerciseId];
          });

          // Encontrar índice del bloque original en blocksByRoutine
          const originalBlockIndex = formState.blocksByRoutine.findIndex(
            (id) => id === blockId
          );

          // Remover bloque original del array
          state.formState.blocksByRoutine =
            state.formState.blocksByRoutine.filter((id) => id !== blockId);

          // Agregar nuevos bloques al estado
          newBlocks.forEach((block, index) => {
            state.formState.blocks[block.tempId] = block;
            // Insertar en la posición original + índice
            state.formState.blocksByRoutine.splice(
              originalBlockIndex + index,
              0,
              block.tempId
            );
          });

          // Agregar nuevos exercisesInBlock
          newExercisesInBlock.forEach((exerciseInBlock) => {
            state.formState.exercisesInBlock[exerciseInBlock.tempId] =
              exerciseInBlock;
          });

          // Agregar nuevos sets
          newSets.forEach((set) => {
            state.formState.sets[set.tempId] = set;
          });

          // Actualizar índices
          Object.assign(state.formState.exercisesByBlock, newExercisesByBlock);
          Object.assign(state.formState.setsByExercise, newSetsByExercise);

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
          };
        });
      },

      updateRestTime: (restTime) => {
        set((state) => {
          const { currentState, formState } = state;

          if (!formState || !currentState.currentBlockId) return;

          const blockId = currentState.currentBlockId;
          const block = formState.blocks[blockId];

          if (!block) return;

          if (currentState.currentRestTimeType === "between-exercises") {
            // Actualizar descanso entre ejercicios
            state.formState.blocks[blockId] = {
              ...block,
              rest_between_exercises_seconds: restTime,
            };

            // Cambiar tipo de bloque según el descanso
            if (restTime > 0) {
              state.formState.blocks[blockId].type = "circuit";
              state.formState.blocks[blockId].name = "Circuito";
            } else {
              state.formState.blocks[blockId].type = "superset";
              state.formState.blocks[blockId].name = "Superserie";
            }
          } else {
            // Actualizar descanso después del bloque
            state.formState.blocks[blockId] = {
              ...block,
              rest_time_seconds: restTime,
            };
          }
        });
      },

      addToBlock: (selectedExercises) => {
        set((state) => {
          const { currentState, formState } = state;

          if (!formState || !currentState.currentBlockId) return;

          const blockId = currentState.currentBlockId;
          const currentBlock = formState.blocks[blockId];
          console.log({ currentBlock, blockId });
          if (!currentBlock) return;

          // Calcular el order_index para los nuevos ejercicios
          const currentExerciseIds = formState.exercisesByBlock[blockId] || [];
          const startOrderIndex = currentExerciseIds.length;

          // Crear nuevos exercisesInBlock a partir de los ejercicios seleccionados
          const { newExercisesInBlock, newSets, setsByExercise } =
            createExercises(selectedExercises, blockId, startOrderIndex);

          // Agregar nuevos exercisesInBlock al estado
          newExercisesInBlock.forEach((exerciseInBlock) => {
            state.formState.exercisesInBlock[exerciseInBlock.tempId] =
              exerciseInBlock;
          });

          // Actualizar el índice de exercisesByBlock
          state.formState.exercisesByBlock[blockId] = [
            ...(state.formState.exercisesByBlock[blockId] || []),
            ...newExercisesInBlock.map((e) => e.tempId),
          ];

          // Agregar nuevos sets al estado
          newSets.forEach((set) => {
            state.formState.sets[set.tempId] = set;
          });

          // Actualizar el índice de setsByExercise
          Object.assign(state.formState.setsByExercise, setsByExercise);

          // Convertir bloque individual → superserie si ahora tiene más de 1 ejercicio
          const totalExercises =
            state.formState.exercisesByBlock[blockId].length;
          if (currentBlock.type === "individual" && totalExercises > 1) {
            state.formState.blocks[blockId] = {
              ...currentBlock,
              type: "superset",
              name: "Superserie",
              rest_between_exercises_seconds: 0, // Sin descanso = superserie
            };
          }
        });
      },
    },

    exerciseActions: {
      deleteExercise: () => {
        set((state) => {
          const { currentState, formState } = state;

          if (
            !formState ||
            !currentState.currentBlockId ||
            !currentState.currentExerciseInBlockId
          )
            return;

          const blockId = currentState.currentBlockId;
          const exerciseInBlockId = currentState.currentExerciseInBlockId;
          const setsByExercise =
            formState.setsByExercise[exerciseInBlockId] || [];

          // 1. Remover sets asociados
          setsByExercise.forEach((setId) => {
            delete state.formState.sets[setId];
          });

          // 2. Remover del índice setsByExercise
          delete state.formState.setsByExercise[exerciseInBlockId];

          // 3. Remover exerciseInBlock del Record principal
          delete state.formState.exercisesInBlock[exerciseInBlockId];

          // 4. Remover del índice exercisesByBlock
          state.formState.exercisesByBlock[blockId] =
            state.formState.exercisesByBlock[blockId].filter(
              (id) => id !== exerciseInBlockId
            );

          // Si el bloque queda sin ejercicios, eliminar el bloque también
          if (state.formState.exercisesByBlock[blockId].length === 0) {
            // Remover del Record principal
            delete state.formState.blocks[blockId];
            delete state.formState.exercisesByBlock[blockId];

            // Remover del índice blocksByRoutine
            state.formState.blocksByRoutine =
              state.formState.blocksByRoutine.filter((id) => id !== blockId);
          }

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
          };
        });
      },

      replaceExercise: (selectedExercises) => {
        set((state) => {
          const { currentState, formState } = state;

          if (
            !formState ||
            !currentState.currentExerciseInBlockId ||
            selectedExercises.length === 0
          )
            return;

          const exerciseInBlockId = currentState.currentExerciseInBlockId;
          const newExercise = selectedExercises[0]; // Solo el primero

          const exerciseInBlock = formState.exercisesInBlock[exerciseInBlockId];

          if (!exerciseInBlock) return;

          // Actualizar el exerciseInBlock con el nuevo ejercicio
          state.formState.exercisesInBlock[exerciseInBlockId] = {
            ...exerciseInBlock,
            exercise_id: newExercise.id,
            exercise: newExercise,
          };
        });
      },

      updateRepsType: (repsType) => {
        set((state) => {
          const { currentState, formState } = state;
          if (!formState || !currentState.currentExerciseInBlockId || !repsType)
            return;

          const exerciseInBlockId = currentState.currentExerciseInBlockId;
          const setsIds = formState.setsByExercise[exerciseInBlockId] || [];

          setsIds.forEach((setId) => {
            const set = formState.sets[setId];

            if (set) {
              state.formState.sets[setId].reps_type = repsType;
            }
          });
        });
      },
    },

    setActions: {
      addSet: (exerciseInBlockId, repsType) => {
        set((state) => {
          const exerciseInBlock =
            state.formState.exercisesInBlock[exerciseInBlockId];

          if (!exerciseInBlock) return;

          const currentSets = state.formState.setsByExercise[exerciseInBlockId];

          const lastSet =
            state.formState.sets[currentSets[currentSets.length - 1]];

          const newSet: SetInsert & { tempId: string } =
            createNewSetForExercise(
              currentSets.length,
              lastSet?.weight || null,
              lastSet?.reps || null,
              lastSet.reps_range || null,
              repsType
            );

          // Agregar el nuevo set al estado
          state.formState.sets[newSet.tempId] = newSet;
          state.formState.setsByExercise[exerciseInBlockId].push(newSet.tempId);
        });
      },
      updateSet: (setId, updates) => {
        set((state) => {
          const set = state.formState.sets[setId];

          if (!set) return;

          // Obtener el valor original del set ANTES de modificarlo para la comparación
          const originalSet = { ...set };

          // Actualizar el set actual
          state.formState.sets[setId] = { ...set, ...updates };

          // Auto-completar sets siguientes con lógica inteligente
          // 1. Encontrar el exerciseInBlockId del set actual
          const exerciseInBlockId = set.exercise_in_block_id;

          // 2. Obtener todos los sets de ese ejercicio ordenados por order_index
          const setIds =
            state.formState.setsByExercise[exerciseInBlockId] || [];

          const allSets = setIds
            .map((id) => state.formState.sets[id])
            .filter(Boolean)
            .sort((a, b) => a.order_index - b.order_index);

          // 3. Encontrar el índice del set actual
          const currentSetIndex = allSets.findIndex((s) => s.tempId === setId);

          // 4. Obtener sets siguientes (después del actual)
          const nextSets = allSets.slice(currentSetIndex + 1);

          // 5. Auto-completar cada set siguiente
          nextSets.forEach((nextSet) => {
            const autoUpdates: Partial<SetInsert & { tempId: string }> = {};

            // Verificar cada campo que se está actualizando
            Object.entries(updates).forEach(([field, value]) => {
              const currentFieldValue = (nextSet as any)[field];
              const originalFieldValue = (originalSet as any)[field];

              if (field === "reps_range") {
                // Para reps_range, comparar sub-campos individualmente
                const currentMin = currentFieldValue?.min;
                const currentMax = currentFieldValue?.max;
                const originalMin = originalFieldValue?.min;
                const originalMax = originalFieldValue?.max;
                const newMin = (value as any)?.min;
                const newMax = (value as any)?.max;

                // Determinar si debe autocompletar basado en los sub-campos
                const shouldAutoCompleteRange =
                  // Si el range actual está vacío
                  (!currentMin && !currentMax) ||
                  // Si el range actual es igual al original
                  (currentMin === originalMin && currentMax === originalMax) ||
                  // Si solo se está editando min y el max coincide
                  (newMin !== undefined &&
                    newMax === originalMax &&
                    currentMax === originalMax) ||
                  // Si solo se está editando max y el min coincide
                  (newMax !== undefined &&
                    newMin === originalMin &&
                    currentMin === originalMin);

                if (shouldAutoCompleteRange) {
                  (autoUpdates as any)[field] = value;
                }
              } else {
                // Para campos normales (weight, reps, etc.)
                const shouldAutoComplete =
                  // Campo vacío en el set siguiente
                  currentFieldValue === "" ||
                  currentFieldValue === undefined ||
                  currentFieldValue === null ||
                  // Campo igual al valor original (permite cambios incrementales)
                  currentFieldValue === originalFieldValue;

                if (shouldAutoComplete) {
                  (autoUpdates as any)[field] = value;
                }
              }
            });

            // Solo aplicar auto-updates si hay campos para actualizar
            if (Object.keys(autoUpdates).length > 0) {
              state.formState.sets[nextSet.tempId] = {
                ...nextSet,
                ...autoUpdates,
              };
            }
          });
        });
      },
      deleteSet: () => {
        set((state) => {
          const { currentState } = get();

          if (
            !currentState.currentSetId ||
            !currentState.currentExerciseInBlockId
          )
            return;

          const setId = currentState.currentSetId;
          const exerciseInBlockId = currentState.currentExerciseInBlockId;

          // Remover del Record principal
          delete state.formState.sets[setId];

          // Remover del índice setsByExercise
          state.formState.setsByExercise[exerciseInBlockId] =
            state.formState.setsByExercise[exerciseInBlockId].filter(
              (id) => id !== setId
            );
        });
      },
      updateSetType: (setType) => {
        set((state) => {
          const { currentState } = get();

          if (!currentState.currentSetId) return;

          const setId = currentState.currentSetId;
          const set = state.formState.sets[setId];

          if (set) {
            state.formState.sets[setId] = { ...set, set_type: setType };
          }
        });
      },
      updateRpe: (rpe) => {
        set((state) => {
          if (!state.currentState.currentSetId) return;

          const setId = state.currentState.currentSetId;
          const set = state.formState.sets[setId];

          if (set) {
            state.formState.sets[setId] = { ...set, rpe };
          }
        });
      },
      updateTempo: (tempo) => {
        set((state) => {
          if (!state.currentState.currentSetId) return;

          const setId = state.currentState.currentSetId;
          const set = state.formState.sets[setId];

          if (set) {
            state.formState.sets[setId] = { ...set, tempo };
          }
        });
      },
    },
  }))
);

export { useRoutineFormStore };

export const useExerciseModalState = () =>
  useRoutineFormStore((state) => state.exerciseModalState);

export const useMainActions = () =>
  useRoutineFormStore((state) => state.mainActions);

export const useRoutineFormState = () =>
  useRoutineFormStore((state) => state.formState);

export const useBlockActions = () =>
  useRoutineFormStore((state) => state.blockActions);

export const useRoutineSharedActions = () =>
  useRoutineFormStore((state) => state.sharedActions);

export const useSetActions = () =>
  useRoutineFormStore((state) => state.setActions);

export const useRoutineFormCurrentState = () =>
  useRoutineFormStore((state) => state.currentState);

export const useExerciseActions = () =>
  useRoutineFormStore((state) => state.exerciseActions);

export const useRoutineInfoState = () =>
  useRoutineFormStore((state) => state.formState.routine);
