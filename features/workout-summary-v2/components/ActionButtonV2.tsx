import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { workoutSummaryTranslations as t } from "@/shared/translations/workout-summary";
import { Typography } from "@/shared/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onPress: () => void;
  lang: "es" | "en";
  baseDelay?: number;
};

export const ActionButtonV2: React.FC<Props> = ({
  onPress,
  lang,
  baseDelay = 2200,
}) => {
  const { colors } = useColorScheme();
  const pulseScale = useSharedValue(1);
  const shimmerPosition = useSharedValue(-1);
  const arrowTranslateX = useSharedValue(0);

  useEffect(() => {
    // Subtle pulse
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Shimmer
    shimmerPosition.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(-1, { duration: 0 })
      ),
      -1,
      false
    );

    // Arrow nudge
    arrowTranslateX.value = withRepeat(
      withSequence(
        withTiming(4, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shimmerPosition.value * 300 },
      { skewX: "-20deg" },
    ],
    opacity: interpolate(
      shimmerPosition.value,
      [-1, 0, 0.5, 1, 1.5],
      [0, 0.5, 0.8, 0.5, 0]
    ),
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowTranslateX.value }],
  }));

  const successColor = colors.success[500];

  return (
    <Animated.View
      entering={FadeInUp.duration(500).delay(baseDelay)}
      style={styles.container}
    >
      <Animated.View style={containerStyle}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          {/* Gradient background */}
          <LinearGradient
            colors={[successColor, "#059669", successColor]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Shimmer overlay */}
          <Animated.View style={[styles.shimmer, shimmerStyle]}>
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: "#ffffff" }}
            >
              {t.done[lang]}
            </Typography>

            <Animated.View style={arrowStyle}>
              <ChevronRight size={22} color="#ffffff" strokeWidth={2.5} />
            </Animated.View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Shadow layer */}
      <View style={[styles.shadow, { backgroundColor: successColor }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 16,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 80,
  },
  shadow: {
    position: "absolute",
    bottom: -4,
    left: 16,
    right: 16,
    height: 20,
    borderRadius: 16,
    opacity: 0.25,
    zIndex: -1,
  },
});
