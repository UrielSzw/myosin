import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Zap } from "lucide-react-native";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  streak: number;
  lang: "es" | "en";
  baseDelay?: number;
};

// Individual animated flame
const AnimatedFlame = ({
  index,
  total,
  delay,
}: {
  index: number;
  total: number;
  delay: number;
}) => {
  const scale = useSharedValue(0);
  const flicker = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay + index * 80,
      withSpring(1, { damping: 8, stiffness: 120 })
    );
    flicker.value = withDelay(
      delay + index * 80,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 + Math.random() * 200, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 300 + Math.random() * 200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const flickerScale = interpolate(flicker.value, [0, 1], [0.9, 1.1]);
    return {
      transform: [{ scale: scale.value * flickerScale }],
      opacity: interpolate(scale.value, [0, 0.5, 1], [0, 0.7, 1]),
    };
  });

  // Calculate size based on position - middle flames bigger
  const middle = (total - 1) / 2;
  const distanceFromMiddle = Math.abs(index - middle);
  const sizeMultiplier = 1 - distanceFromMiddle * 0.15;
  const size = Math.round(20 * sizeMultiplier);

  return (
    <Animated.View style={[styles.flameWrapper, style]}>
      <Flame size={size} color="#f59e0b" fill="#f59e0b" />
    </Animated.View>
  );
};

export const StreakFireV2: React.FC<Props> = ({
  streak,
  lang,
  baseDelay = 1200,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const containerScale = useSharedValue(0.95);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    containerScale.value = withDelay(
      baseDelay,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
    glowPulse.value = withDelay(
      baseDelay + 400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: interpolate(containerScale.value, [0.95, 1], [0, 1]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.3, 0.6]),
  }));

  if (streak <= 0) return null;

  // Number of flames to show (max 7)
  const flameCount = Math.min(streak, 7);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(baseDelay)}
      style={[styles.container, containerStyle]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 20 : 40}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Gradient overlay */}
        <LinearGradient
          colors={["rgba(245, 158, 11, 0.1)", "transparent", "rgba(239, 68, 68, 0.05)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Glow effect behind */}
        <Animated.View style={[styles.glowBg, glowStyle]}>
          <View style={styles.glowInner} />
        </Animated.View>

        <View style={styles.content}>
          {/* Left section - Flames */}
          <View style={styles.flamesSection}>
            <View style={styles.flamesRow}>
              {Array.from({ length: flameCount }).map((_, i) => (
                <AnimatedFlame
                  key={i}
                  index={i}
                  total={flameCount}
                  delay={baseDelay}
                />
              ))}
            </View>
          </View>

          {/* Center - Streak number */}
          <View style={styles.numberSection}>
            <Animated.View
              entering={FadeInDown.delay(baseDelay + 200).duration(400)}
              style={styles.numberContainer}
            >
              <Typography
                variant="h1"
                weight="bold"
                style={[styles.streakNumber, { color: "#f59e0b" }]}
              >
                {streak}
              </Typography>
              <View style={styles.labelContainer}>
                <Zap size={12} color="#f59e0b" fill="#f59e0b" />
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{ color: "#f59e0b", marginLeft: 4 }}
                >
                  {lang === "es" ? "RACHA" : "STREAK"}
                </Typography>
              </View>
            </Animated.View>
          </View>

          {/* Right section - Text */}
          <View style={styles.textSection}>
            <Animated.View entering={FadeInDown.delay(baseDelay + 300).duration(400)}>
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {streak === 1
                  ? lang === "es"
                    ? "¡Primer día!"
                    : "First day!"
                  : lang === "es"
                  ? `¡${streak} días seguidos!`
                  : `${streak} days in a row!`}
              </Typography>
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 2 }}
              >
                {lang === "es" ? "Sigue así 💪" : "Keep it up 💪"}
              </Typography>
            </Animated.View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  flamesSection: {
    width: 60,
  },
  flamesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 28,
  },
  flameWrapper: {
    marginHorizontal: -4,
  },
  numberSection: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  numberContainer: {
    alignItems: "center",
  },
  streakNumber: {
    fontSize: 36,
    lineHeight: 40,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
  },
  textSection: {
    flex: 1,
  },
  glowBg: {
    position: "absolute",
    left: 20,
    top: "50%",
    marginTop: -30,
  },
  glowInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f59e0b",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    opacity: 0.3,
  },
});
