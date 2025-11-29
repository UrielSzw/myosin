import { useReorderBlockActions } from "@/shared/hooks/use-reorder-store";
import { useRoutineFormState } from "../hooks/use-routine-form-store";

export const useReorderExercises = () => {
  const { blocks, exercisesByBlock, exercisesInBlock } = useRoutineFormState();
  const { setBlock, setExercisesInBlock, setExercisesIdsInCurrentBlock } =
    useReorderBlockActions();

  const initializeReorder = (blockId: string) => {
    const block = blocks[blockId];

    if (!block) return;

    setBlock(block);
    setExercisesIdsInCurrentBlock(exercisesByBlock[blockId]);
    setExercisesInBlock(exercisesInBlock);
  };

  return { initializeReorder };
};
