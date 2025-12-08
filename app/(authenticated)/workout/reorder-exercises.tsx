import {
  ActiveWorkoutExercise,
  useActiveSharedActions,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { ReorderExercisesV2Feature } from "@/features/reorder-exercises-v2";
import { BlockInsert } from "@/shared/db/schema";
import {
  useActiveReorderBlockActions,
  useActiveReorderBlocksState,
} from "@/shared/hooks/use-active-reorder-store";
import { ReorderExercise } from "@/shared/types/reorder";
import { router } from "expo-router";
import React, { useMemo } from "react";

export default function ReorderExercisesActiveScreen() {
  const { exercises, block, exercisesIdsInCurrentBlock } =
    useActiveReorderBlocksState();
  const { clear } = useActiveReorderBlockActions();
  const { setNewOrderExercises, setNewOrderExercisesIds } =
    useActiveSharedActions();

  const handleCancel = () => {
    clear();
    router.back();
  };

  const handleReorder = (reorderedExercises: ReorderExercise[]) => {
    if (!block) return;

    const newExercises: Record<string, ActiveWorkoutExercise> = {
      ...exercises,
    };
    const newOrderIds: string[] = [];

    reorderedExercises.forEach((exercise, index) => {
      // Update the order_index for each exercise
      newExercises[exercise.tempId] = {
        ...(exercise as unknown as ActiveWorkoutExercise),
        order_index: index,
      };
      newOrderIds.push(exercise.tempId);
    });

    setNewOrderExercises(newExercises);
    setNewOrderExercisesIds(block.tempId, newOrderIds);
    clear();
    router.back();
  };

  // Cast ActiveWorkoutExercise to ReorderExercise for display
  const reorderExercises = useMemo(() => {
    return exercisesIdsInCurrentBlock
      .map((id) => exercises[id])
      .filter(Boolean) as unknown as ReorderExercise[];
  }, [exercisesIdsInCurrentBlock, exercises]);

  if (!block) return null;

  // Cast ActiveWorkoutBlock to BlockInsert for the reorder feature
  const blockForReorder = block as unknown as BlockInsert & { tempId: string };

  return (
    <ReorderExercisesV2Feature
      block={blockForReorder}
      exercises={reorderExercises}
      onCancel={handleCancel}
      onReorder={handleReorder}
    />
  );
}
