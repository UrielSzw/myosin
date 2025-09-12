import { useActiveWorkoutStats } from "@/features/active-workout/hooks/use-active-workout-store";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const ProgressLineComponent = () => {
  const { colors } = useColorScheme();
  const { totalSetsCompleted, totalSetsPlanned } = useActiveWorkoutStats();

  const progressPercentage =
    ((totalSetsCompleted || 0) * 100) / (totalSetsPlanned || 1);

  const progressAnim = useRef(
    new Animated.Value((width * progressPercentage) / 100)
  ).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (width * progressPercentage) / 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, progressPercentage]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        height: 3,
        width: progressAnim,
        backgroundColor: colors.primary[500],
        bottom: -2,
        borderRadius: 2,
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
      }}
    />
  );
};

export const ProgressLine = React.memo(ProgressLineComponent);
