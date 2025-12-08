import { useActiveReorderBlockActions } from "@/shared/hooks/use-active-reorder-store";
import { useActiveWorkout } from "../hooks/use-active-workout-store";

export const useReorderBlocksActive = () => {
  const { blocks, exercisesByBlock, exercises } = useActiveWorkout();
  const { setBlocks, setExercisesByBlock, setExercises } =
    useActiveReorderBlockActions();

  const initializeReorder = () => {
    setBlocks(blocks);
    setExercisesByBlock(exercisesByBlock);
    setExercises(exercises);
  };

  return { initializeReorder };
};
