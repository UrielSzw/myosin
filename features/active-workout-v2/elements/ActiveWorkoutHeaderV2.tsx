import { useActiveWorkout } from "@/features/active-workout/hooks/use-active-workout-store";
import { useFinishWorkout } from "@/features/active-workout/hooks/use-finish-workout";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Flag, Loader2, Timer, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ActiveWorkoutHeaderV2 = () => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { session, sets } = useActiveWorkout();
  const { handleFinishWorkout, handleExitWorkout } = useFinishWorkout();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate progress
  const totalSets = Object.keys(sets).length;
  const completedSets = Object.values(sets).filter((s) => s.completed).length;

  // Loading spinner animation
  const spinValue = useSharedValue(0);

  useEffect(() => {
    if (isSaving) {
      spinValue.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      spinValue.value = 0;
    }
  }, [isSaving, spinValue]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinValue.value}deg` }],
  }));

  // Timer effect
  useEffect(() => {
    if (!session?.started_at) return;

    const startTime = new Date(session.started_at).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.started_at]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onFinishPress = async () => {
    setIsSaving(true);
    try {
      await handleFinishWorkout();
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          borderBottomColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)",
        },
      ]}
    >
      {/* Glass background */}
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 25 : 40}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.content}>
        {/* Exit button */}
        <Pressable
          onPress={handleExitWorkout}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <X size={20} color={colors.text} />
        </Pressable>

        {/* Title - aligned left like FormHeaderV2 */}
        <View style={styles.titleContainer}>
          <Typography
            variant="h4"
            weight="bold"
            numberOfLines={1}
            style={{ color: colors.text }}
          >
            {session.routine?.name || "Entrenamiento"}
          </Typography>

          {/* Timer row */}
          <View style={styles.timerRow}>
            <Timer size={12} color={colors.primary[500]} />
            <Typography
              variant="caption"
              weight="medium"
              style={{ color: colors.primary[500], marginLeft: 4 }}
            >
              {formatTime(elapsedTime)}
            </Typography>
            <View
              style={[
                styles.progressBadge,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <Typography
                variant="caption"
                weight="semibold"
                style={{ color: colors.textMuted, fontSize: 10 }}
              >
                {completedSets}/{totalSets}
              </Typography>
            </View>
          </View>
        </View>

        {/* Finish button */}
        <Pressable
          onPress={onFinishPress}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.finishButton,
            {
              backgroundColor: colors.primary[500],
              opacity: isSaving ? 0.7 : pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={styles.finishButtonContent}>
            {isSaving ? (
              <Animated.View style={spinStyle}>
                <Loader2 size={16} color="#fff" />
              </Animated.View>
            ) : (
              <Flag size={16} color="#fff" fill="#fff" />
            )}
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: "#fff", marginLeft: 6 }}
            >
              {isSaving ? "..." : "Fin"}
            </Typography>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  progressBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  finishButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  finishButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
