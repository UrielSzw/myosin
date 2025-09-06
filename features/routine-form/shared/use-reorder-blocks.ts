import { useReorderBlockActions } from "@/shared/hooks/use-reorder-store";
import { useRoutineFormState } from "../hooks/use-routine-form-store";

export const useReorderBlocks = () => {
  const { blocks, exercisesByBlock, exercisesInBlock } = useRoutineFormState();
  const { setBlocks, setExercisesByBlock, setExercisesInBlock } =
    useReorderBlockActions();

  const initializeReorder = () => {
    setBlocks(blocks);
    setExercisesByBlock(exercisesByBlock);
    setExercisesInBlock(exercisesInBlock);
  };

  return { initializeReorder };
};
