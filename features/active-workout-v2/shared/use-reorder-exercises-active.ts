import { useActiveReorderBlockActions } from "@/shared/hooks/use-active-reorder-store";
import { useActiveWorkout } from "../hooks/use-active-workout-store";

export const useReorderExercisesActive = () => {
  const { blocks, exercisesByBlock, exercises } = useActiveWorkout();
  const { setBlock, setExercises, setExercisesIdsInCurrentBlock } =
    useActiveReorderBlockActions();

  const initializeReorder = (blockId: string) => {
    const block = blocks[blockId];

    if (!block) return;

    setBlock(block);
    setExercisesIdsInCurrentBlock(exercisesByBlock[blockId] || []);
    setExercises(exercises);
  };

  return { initializeReorder };
};
