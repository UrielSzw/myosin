import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { workoutSummaryTranslations as t } from "@/shared/translations/workout-summary";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUp, TrendingUp } from "lucide-react-native";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  improvementsCount: number;
  lang: SupportedLanguage;
  baseDelay?: number;
};

// Animated arrow that moves up
const AnimatedArrow = ({ delay, index }: { delay: number; index: number }) => {
  const translateY = useSharedValue(10);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay + index * 100,
      withSpring(0, { damping: 10, stiffness: 80 })
    );
    opacity.value = withDelay(
      delay + index * 100,
      withTiming(1, { duration: 300 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.arrowWrapper, style]}>
      <ArrowUp size={14} color="#10b981" strokeWidth={3} />
    </Animated.View>
  );
};

export const ImprovementsCardV2: React.FC<Props> = ({
  improvementsCount,
  lang,
  baseDelay = 1800,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const progressWidth = useSharedValue(0);
  const numberScale = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withDelay(
      baseDelay + 200,
      withTiming(1, { duration: 800 })
    );
    numberScale.value = withDelay(
      baseDelay + 100,
      withSpring(1, { damping: 8, stiffness: 100 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
    opacity: interpolate(progressWidth.value, [0, 0.2, 1], [0, 1, 1]),
  }));

  const numberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberScale.value }],
    opacity: numberScale.value,
  }));

  if (improvementsCount <= 0) return null;

  const successColor = colors.success[500];

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(baseDelay)}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(16, 185, 129, 0.2)"
              : "rgba(16, 185, 129, 0.15)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Success gradient overlay */}
        <LinearGradient
          colors={[
            "rgba(16, 185, 129, 0.1)",
            "rgba(16, 185, 129, 0.05)",
            "transparent",
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.content}>
          {/* Left - Icon and arrows */}
          <View style={styles.iconSection}>
            <View
              style={[styles.iconBg, { backgroundColor: `${successColor}15` }]}
            >
              <TrendingUp size={22} color={successColor} />
            </View>
            {/* Animated arrows */}
            <View style={styles.arrowsContainer}>
              {Array.from({ length: Math.min(improvementsCount, 3) }).map(
                (_, i) => (
                  <AnimatedArrow key={i} delay={baseDelay} index={i} />
                )
              )}
            </View>
          </View>

          {/* Center - Text */}
          <View style={styles.textSection}>
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: colors.text }}
            >
              {t.youImproved[lang]}
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 2 }}
            >
              {t.inExercisesVsLastTime[lang]
                .replace("{count}", String(improvementsCount))
                .replace(
                  "{exerciseWord}",
                  improvementsCount === 1
                    ? t.exercisesCount[lang]
                    : t.exercisesCountPlural[lang]
                )}
            </Typography>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBg,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    { backgroundColor: successColor },
                    progressStyle,
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Right - Number */}
          <Animated.View style={[styles.numberSection, numberStyle]}>
            <View
              style={[
                styles.numberBg,
                { backgroundColor: `${successColor}15` },
              ]}
            >
              <Typography
                variant="h4"
                weight="bold"
                style={{ color: successColor }}
              >
                +{improvementsCount}
              </Typography>
            </View>
          </Animated.View>
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
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  iconSection: {
    position: "relative",
    alignItems: "center",
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowsContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    flexDirection: "row",
    gap: 2,
  },
  arrowWrapper: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    flex: 1,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBg: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  numberSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  numberBg: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
