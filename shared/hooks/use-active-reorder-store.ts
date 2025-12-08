import {
  ActiveWorkoutBlock,
  ActiveWorkoutExercise,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Store = {
  blocksState: {
    blocks: Record<string, ActiveWorkoutBlock>;
    exercises: Record<string, ActiveWorkoutExercise>;
    exercisesByBlock: Record<string, string[]>;
    block: ActiveWorkoutBlock | null;
    exercisesIdsInCurrentBlock: string[];
  };

  reorderBlocksActions: {
    setBlocks: (blocks: Record<string, ActiveWorkoutBlock>) => void;
    setExercises: (exercises: Record<string, ActiveWorkoutExercise>) => void;
    setExercisesByBlock: (exercisesByBlock: Record<string, string[]>) => void;
    setBlock: (block: ActiveWorkoutBlock | null) => void;
    setExercisesIdsInCurrentBlock: (ids: string[]) => void;
    clear: () => void;
  };
};

const useActiveReorderStore = create<Store>()(
  immer((set) => ({
    blocksState: {
      blocks: {},
      exercises: {},
      exercisesByBlock: {},
      block: null,
      exercisesIdsInCurrentBlock: [],
    },

    reorderBlocksActions: {
      setBlocks: (blocks) =>
        set((state) => {
          state.blocksState.blocks = blocks;
        }),
      setExercises: (exercises) =>
        set((state) => {
          state.blocksState.exercises = exercises;
        }),
      setExercisesByBlock: (exercisesByBlock) =>
        set((state) => {
          state.blocksState.exercisesByBlock = exercisesByBlock;
        }),
      setBlock: (block) =>
        set((state) => {
          state.blocksState.block = block;
        }),
      setExercisesIdsInCurrentBlock: (ids) =>
        set((state) => {
          state.blocksState.exercisesIdsInCurrentBlock = ids;
        }),
      clear: () =>
        set((state) => {
          state.blocksState = {
            blocks: {},
            exercises: {},
            exercisesByBlock: {},
            block: null,
            exercisesIdsInCurrentBlock: [],
          };
        }),
    },
  }))
);

export const useActiveReorderBlocksState = () =>
  useActiveReorderStore((state) => state.blocksState);

export const useActiveReorderBlockActions = () =>
  useActiveReorderStore((state) => state.reorderBlocksActions);
