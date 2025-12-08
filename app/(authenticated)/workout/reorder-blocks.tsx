import {
  ActiveWorkoutBlock,
  useActiveSharedActions,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { ReorderBlocksV2Feature } from "@/features/reorder-blocks-v2";
import { BlockInsert } from "@/shared/db/schema";
import { useActiveReorderBlocksState } from "@/shared/hooks/use-active-reorder-store";
import { ReorderExerciseData } from "@/shared/types/reorder";
import { router } from "expo-router";
import React, { useMemo } from "react";

export default function ReorderBlocksActiveScreen() {
  const { blocks, exercises, exercisesByBlock } = useActiveReorderBlocksState();
  const { setNewOrderBlocks, setNewOrderBlocksIds } = useActiveSharedActions();

  const handleReorder = (
    reorderedBlocks: (BlockInsert & { tempId: string })[]
  ) => {
    const newReorderedBlocks: Record<string, ActiveWorkoutBlock> = {};
    const newOrderIds: string[] = [];

    reorderedBlocks.forEach((block, index) => {
      // Cast back to ActiveWorkoutBlock since we know these are from active workout
      newReorderedBlocks[block.tempId] = {
        ...(block as unknown as ActiveWorkoutBlock),
        order_index: index,
      };
      newOrderIds.push(block.tempId);
    });

    setNewOrderBlocks(newReorderedBlocks);
    setNewOrderBlocksIds(newOrderIds);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  // Transform exercises to ReorderExerciseData format
  // Must be before conditional return to follow hooks rules
  const exercisesForReorder = useMemo(() => {
    const result: Record<string, ReorderExerciseData> = {};
    Object.entries(exercises).forEach(([key, exercise]) => {
      result[key] = {
        tempId: exercise.tempId,
        exercise: exercise.exercise,
        order_index: exercise.order_index,
      };
    });
    return result;
  }, [exercises]);

  // Guard against undefined blocks state
  if (!blocks || Object.keys(blocks).length === 0) {
    return null;
  }

  // Cast ActiveWorkoutBlock to BlockInsert for the reorder feature
  // The types are compatible for display purposes
  const blocksForReorder = Object.values(blocks) as unknown as (BlockInsert & {
    tempId: string;
  })[];

  return (
    <ReorderBlocksV2Feature
      blocks={blocksForReorder}
      onReorder={handleReorder}
      onCancel={handleCancel}
      exercisesByBlock={exercisesByBlock}
      exercisesInBlock={exercisesForReorder}
    />
  );
}
