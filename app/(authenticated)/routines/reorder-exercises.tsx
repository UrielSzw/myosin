import { ReorderExercisesV2Feature } from "@/features/reorder-exercises-v2";
import { useRoutineSharedActions } from "@/features/routine-form/hooks/use-routine-form-store";
import {
  useReorderBlockActions,
  useReorderBlocksState,
} from "@/shared/hooks/use-reorder-store";
import { ReorderExercise } from "@/shared/types/reorder";
import { router } from "expo-router";
import React, { useMemo } from "react";

export default function ReorderExercisesScreen() {
  const { exercisesInBlock, block, exercisesIdsInCurrentBlock } =
    useReorderBlocksState();
  const { setExercisesByBlock, setExercisesInBlock, setBlock } =
    useReorderBlockActions();
  const { setNewOrderExercises, setNewOrderExercisesIds } =
    useRoutineSharedActions();

  const handleCancel = () => {
    setExercisesByBlock({});
    setExercisesInBlock({});
    setBlock(null);
    router.back();
  };

  const handleReorder = (reorderedExercises: ReorderExercise[]) => {
    if (!block) return;

    const newExercisesInBlock: Record<
      string,
      ReorderExercise & { tempId: string }
    > = { ...exercisesInBlock };
    const newOrderIds: string[] = [];

    reorderedExercises.forEach((exercise, index) => {
      newExercisesInBlock[exercise.tempId] = {
        ...exercise,
        order_index: index,
      };

      newOrderIds.push(exercise.tempId);
    });

    setNewOrderExercises(newExercisesInBlock);
    setNewOrderExercisesIds(block.tempId, newOrderIds);
    setExercisesInBlock({});
    setExercisesByBlock({});
    setBlock(null);
    router.back();
  };

  const reorderExercises = useMemo(() => {
    return exercisesIdsInCurrentBlock.map((id) => exercisesInBlock[id]);
  }, [exercisesIdsInCurrentBlock, exercisesInBlock]);

  if (!block) return null;

  return (
    <ReorderExercisesV2Feature
      block={block}
      exercises={reorderExercises}
      onCancel={handleCancel}
      onReorder={handleReorder}
    />
  );
}
