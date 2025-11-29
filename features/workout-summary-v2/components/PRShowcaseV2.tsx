import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Medal, Sparkles, Trophy } from "lucide-react-native";
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

type PR = {
  exerciseName: string;
  weight: number;
  reps: number;
};

type Props = {
  prs: PR[];
  lang: "es" | "en";
  weightUnit: string;
  baseDelay?: number;
};

// Individual PR Card with trophy animation
const PRCardAnimated: React.FC<{
  pr: PR;
  index: number;
  weightUnit: string;
  lang: "es" | "en";
  baseDelay: number;
}> = ({ pr, index, weightUnit, lang, baseDelay }) => {
  const { colors, isDarkMode } = useColorScheme();
  const trophyRotate = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);
  const trophyScale = useSharedValue(0);

  useEffect(() => {
    // Trophy bounce
    trophyScale.value = withDelay(
      baseDelay + index * 150,
      withSpring(1, { damping: 6, stiffness: 100 })
    );
    // Trophy wiggle
    trophyRotate.value = withDelay(
      baseDelay + index * 150 + 400,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 100, easing: Easing.inOut(Easing.quad) }),
          withTiming(-10, { duration: 100, easing: Easing.inOut(Easing.quad) }),
          withTiming(5, { duration: 100, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 100, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 2000 }) // Pause
        ),
        -1,
        false
      )
    );
    // Shimmer effect
    shimmerPosition.value = withDelay(
      baseDelay + index * 150 + 600,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withTiming(-1, { duration: 0 })
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotate.value}deg` },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shimmerPosition.value * 200 },
      { skewX: "-20deg" },
    ],
    opacity: interpolate(
      shimmerPosition.value,
      [-1, 0, 0.5, 1, 1.5],
      [0, 0.6, 0.8, 0.6, 0]
    ),
  }));

  // Alternate gold/silver for 1st/2nd PR
  const isGold = index === 0;
  const accentColor = isGold ? "#f59e0b" : "#94a3b8";
  const gradientColors: [string, string, string] = isGold
    ? ["rgba(245, 158, 11, 0.15)", "rgba(234, 179, 8, 0.08)", "transparent"]
    : ["rgba(148, 163, 184, 0.1)", "rgba(148, 163, 184, 0.05)", "transparent"];

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(baseDelay + index * 150)}
      style={[
        styles.prCard,
        {
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.9)",
          borderColor: `${accentColor}30`,
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

      {/* Gradient overlay */}
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Shimmer effect */}
      <Animated.View style={[styles.shimmer, shimmerStyle]}>
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255,0.3)",
            "transparent",
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>

      <View style={styles.prContent}>
        {/* Trophy icon */}
        <Animated.View style={[styles.trophyContainer, trophyStyle]}>
          <View
            style={[
              styles.trophyBg,
              { backgroundColor: `${accentColor}20` },
            ]}
          >
            {isGold ? (
              <Trophy size={24} color={accentColor} fill={`${accentColor}40`} />
            ) : (
              <Medal size={24} color={accentColor} />
            )}
          </View>
        </Animated.View>

        {/* PR info */}
        <View style={styles.prInfo}>
          <View style={styles.prBadge}>
            <Sparkles size={10} color={accentColor} />
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: accentColor, marginLeft: 4 }}
            >
              {lang === "es" ? "¡NUEVO PR!" : "NEW PR!"}
            </Typography>
          </View>
          <Typography
            variant="body2"
            weight="semibold"
            numberOfLines={1}
            style={{ color: colors.text, marginTop: 4 }}
          >
            {pr.exerciseName}
          </Typography>
          <Typography variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            {pr.weight} {weightUnit} × {pr.reps} reps
          </Typography>
        </View>
      </View>
    </Animated.View>
  );
};

export const PRShowcaseV2: React.FC<Props> = ({
  prs,
  lang,
  weightUnit: _weightUnit,
  baseDelay = 1500,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  if (!prs || prs.length === 0) return null;

  // Show max 3 PRs
  const displayPrs = prs.slice(0, 3);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(baseDelay)}
      style={styles.container}
    >
      {/* Section header */}
      <View style={styles.headerRow}>
        <Trophy size={18} color="#f59e0b" />
        <Typography
          variant="body1"
          weight="bold"
          style={{ color: colors.text, marginLeft: 8 }}
        >
          {lang === "es" ? "Records Personales" : "Personal Records"}
        </Typography>
        {displayPrs.length > 0 && (
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(245, 158, 11, 0.15)",
              },
            ]}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: "#f59e0b" }}
            >
              {displayPrs.length}
            </Typography>
          </View>
        )}
      </View>

      {/* PR Cards */}
      <View style={styles.cardsContainer}>
        {displayPrs.map((pr, index) => (
          <PRCardAnimated
            key={index}
            pr={pr}
            index={index}
            weightUnit={weightUnit}
            lang={lang}
            baseDelay={baseDelay + 100}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  countBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cardsContainer: {
    gap: 10,
  },
  prCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  prContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
  },
  trophyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  trophyBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  prInfo: {
    flex: 1,
  },
  prBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 60,
  },
});
