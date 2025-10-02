import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const usePRCelebration = () => {
  const { colors } = useColorScheme();

  // Animation values
  const glowPulse = useSharedValue(0);
  const borderSlide = useSharedValue(-100);

  // Trigger celebration
  const triggerCelebration = useCallback(() => {
    // Glow pulse on check button (3 times)
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 600 })
      ),
      3,
      false
    );

    // Border slide in
    borderSlide.value = withTiming(0, { duration: 400 });

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [glowPulse, borderSlide]);

  // Reset all animations
  const resetCelebration = useCallback(() => {
    glowPulse.value = withTiming(0, { duration: 100 });
    borderSlide.value = withTiming(-100, { duration: 200 });
  }, [glowPulse, borderSlide]);

  // Animated styles
  const glowStyle = useAnimatedStyle(() => ({
    shadowColor: colors.warning[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowPulse.value * 0.6,
    shadowRadius: glowPulse.value * 8,
    elevation: glowPulse.value * 5,
  }));

  const borderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: borderSlide.value }],
  }));

  return {
    // Functions
    triggerCelebration,
    resetCelebration,

    // Styles
    glowStyle,
    borderStyle,

    // Colors
    prColor: colors.warning[500],
  };
};
