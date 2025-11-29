import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { AddExerciseButtonV2 } from "./AddExerciseButtonV2";
import { EmptyStateV2 } from "./EmptyStateV2";

type Props = {
  children: React.ReactNode;
  exercisesInBlockCount: number;
  onAddExercise: () => void;
};

export const BlocksListV2: React.FC<Props> = ({
  children,
  exercisesInBlockCount,
  onAddExercise,
}) => {
  if (exercisesInBlockCount === 0) {
    return <EmptyStateV2 onAddExercise={onAddExercise} />;
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.blocksContainer}>{children}</View>

      <AddExerciseButtonV2 onPress={onAddExercise} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  blocksContainer: {
    gap: 0,
  },
});
