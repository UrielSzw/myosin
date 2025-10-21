import { WorkoutBlockWithExercises } from "@/shared/db/schema/workout-session";
import React from "react";
import { View } from "react-native";
import { SessionBlockItem } from "../session-block-item";

type Props = {
  blocks: WorkoutBlockWithExercises[];
  showRpe: boolean;
};

export const SessionBlocksList: React.FC<Props> = ({ blocks, showRpe }) => {
  return (
    <View>
      {blocks.map((block, index) => (
        <SessionBlockItem
          key={block.id}
          block={block}
          isLast={index === blocks.length - 1}
          showRpe={showRpe}
        />
      ))}
    </View>
  );
};
