import {
  BaseExercise,
  BlockInsert,
  ExerciseInBlockInsert,
} from "@/shared/db/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Store = {
  blocksState: {
    blocks: Record<string, BlockInsert & { tempId: string }>;
    exercisesInBlock: Record<
      string,
      ExerciseInBlockInsert & { tempId: string; exercise: BaseExercise }
    >;
    exercisesByBlock: Record<string, string[]>;
  };

  reorderBlocksActions: {
    setBlocks: (
      blocks: Record<string, BlockInsert & { tempId: string }>
    ) => void;
    setExercisesInBlock: (
      exercisesInBlock: Record<
        string,
        ExerciseInBlockInsert & { tempId: string; exercise: BaseExercise }
      >
    ) => void;
    setExercisesByBlock: (exercisesByBlock: Record<string, string[]>) => void;
  };
};

const useReorderStore = create<Store>()(
  immer((set, get) => ({
    blocksState: {
      blocks: {},
      exercisesInBlock: {},
      exercisesByBlock: {},
    },

    reorderBlocksActions: {
      setBlocks: (blocks) =>
        set((state) => {
          state.blocksState.blocks = blocks;
        }),
      setExercisesInBlock: (exercisesInBlock) =>
        set((state) => {
          state.blocksState.exercisesInBlock = exercisesInBlock;
        }),
      setExercisesByBlock: (exercisesByBlock) =>
        set((state) => {
          state.blocksState.exercisesByBlock = exercisesByBlock;
        }),
    },
  }))
);

export const useReorderBlocksState = () =>
  useReorderStore((state) => state.blocksState);

export const useReorderBlockActions = () =>
  useReorderStore((state) => state.reorderBlocksActions);
