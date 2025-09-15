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
    block: (BlockInsert & { tempId: string }) | null;
    exercisesIdsInCurrentBlock: string[];
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
    setBlock: (block: (BlockInsert & { tempId: string }) | null) => void;
    setExercisesIdsInCurrentBlock: (ids: string[]) => void;
  };
};

const useReorderStore = create<Store>()(
  immer((set, get) => ({
    blocksState: {
      blocks: {},
      exercisesInBlock: {},
      exercisesByBlock: {},
      block: null,
      exercisesIdsInCurrentBlock: [],
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
      setBlock: (block) =>
        set((state) => {
          state.blocksState.block = block;
        }),
      setExercisesIdsInCurrentBlock: (ids) =>
        set((state) => {
          state.blocksState.exercisesIdsInCurrentBlock = ids;
        }),
    },
  }))
);

export const useReorderBlocksState = () =>
  useReorderStore((state) => state.blocksState);

export const useReorderBlockActions = () =>
  useReorderStore((state) => state.reorderBlocksActions);
