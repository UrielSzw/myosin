import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type OnboardingProgressProps = {
  currentStep: number;
  totalSteps: number;
  activeColor?: string;
};

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  activeColor,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const accentColor = activeColor || colors.primary[500];

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isUpcoming = index > currentStep;

        return (
          <ProgressDot
            key={index}
            isActive={isActive}
            isCompleted={isCompleted}
            isUpcoming={isUpcoming}
            activeColor={accentColor}
            inactiveColor={
              isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"
            }
            completedColor={
              isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)"
            }
            delay={index * 50}
          />
        );
      })}
    </View>
  );
};

type ProgressDotProps = {
  isActive: boolean;
  isCompleted: boolean;
  isUpcoming: boolean;
  activeColor: string;
  inactiveColor: string;
  completedColor: string;
  delay: number;
};

const ProgressDot: React.FC<ProgressDotProps> = ({
  isActive,
  isCompleted,
  activeColor,
  inactiveColor,
  completedColor,
  delay,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isActive ? 32 : 8, {
        damping: 15,
        stiffness: 200,
      }),
      backgroundColor: isActive
        ? activeColor
        : isCompleted
        ? completedColor
        : inactiveColor,
      opacity: withSpring(isActive || isCompleted ? 1 : 0.6, {
        damping: 15,
      }),
    };
  });

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(300)}
      style={[styles.dot, animatedStyle]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingProgress;
