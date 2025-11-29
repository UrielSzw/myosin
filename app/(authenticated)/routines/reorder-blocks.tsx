import { ReorderBlocksV2Feature } from "@/features/reorder-blocks-v2";
import { useRoutineSharedActions } from "@/features/routine-form-v2/hooks/use-routine-form-store";
import { BlockInsert } from "@/shared/db/schema";
import {
  useReorderBlockActions,
  useReorderBlocksState,
} from "@/shared/hooks/use-reorder-store";
import { router } from "expo-router";
import React from "react";

export default function ReorderBlocksScreen() {
  const { blocks } = useReorderBlocksState();
  const { setBlocks, setExercisesByBlock, setExercisesInBlock } =
    useReorderBlockActions();
  const { setNewOrderBlocks, setNewOrderBlocksIds } = useRoutineSharedActions();

  const handleReorder = (
    reorderedBlocks: (BlockInsert & { tempId: string })[]
  ) => {
    const newReorderedBlocks: Record<
      string,
      BlockInsert & {
        tempId: string;
      }
    > = {};
    const newOrderIds: string[] = [];

    reorderedBlocks.forEach((block, index) => {
      newReorderedBlocks[block.tempId] = {
        ...block,
        order_index: index,
      };
      newOrderIds.push(block.tempId);
    });

    setNewOrderBlocks(newReorderedBlocks);
    setNewOrderBlocksIds(newOrderIds);
    setBlocks({});
    setExercisesByBlock({});
    setExercisesInBlock({});
    router.back();
  };

  const handleCancel = () => {
    setBlocks({});
    setExercisesByBlock({});
    setExercisesInBlock({});
    router.back();
  };

  return (
    <ReorderBlocksV2Feature
      blocks={Object.values(blocks)}
      onReorder={handleReorder}
      onCancel={handleCancel}
    />
  );
}
