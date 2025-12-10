import { db } from "@/shared/db/client";
import { exercises } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { eq } from "drizzle-orm";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, Sparkles, Unlock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

// ============================================================================
// Types
// ============================================================================

export type UnlockedExercise = {
  exerciseId: string;
  unlockedByExerciseId: string;
  unlockedByPrId?: string;
};

type Props = {
  unlockedExercises: UnlockedExercise[];
  lang: SupportedLanguage;
  baseDelay?: number;
};

// ============================================================================
// Translations
// ============================================================================

const translations = {
  title: {
    es: "¡Ejercicios Desbloqueados!",
    en: "Exercises Unlocked!",
  },
  subtitle: {
    es: "Has desbloqueado nuevos ejercicios",
    en: "You've unlocked new exercises",
  },
  unlockedBy: {
    es: "Gracias a",
    en: "Thanks to",
  },
  tryItNext: {
    es: "Probalo en tu próximo workout",
    en: "Try it in your next workout",
  },
};

// ============================================================================
// Individual Unlock Card
// ============================================================================

const UnlockCardAnimated: React.FC<{
  exerciseId: string;
  unlockedByExerciseId: string;
  index: number;
  lang: SupportedLanguage;
  baseDelay: number;
}> = ({ exerciseId, unlockedByExerciseId, index, lang, baseDelay }) => {
  const { colors, isDarkMode } = useColorScheme();

  const [exerciseName, setExerciseName] = useState<string>("...");
  const [unlockedByName, setUnlockedByName] = useState<string>("");

  const iconRotate = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);

  // Load exercise names
  useEffect(() => {
    const loadNames = async () => {
      try {
        const [exerciseRow] = await db
          .select({ name: exercises.name })
          .from(exercises)
          .where(eq(exercises.id, exerciseId));

        const [unlockedByRow] = await db
          .select({ name: exercises.name })
          .from(exercises)
          .where(eq(exercises.id, unlockedByExerciseId));

        if (exerciseRow) setExerciseName(exerciseRow.name);
        if (unlockedByRow) setUnlockedByName(unlockedByRow.name);
      } catch {
        // Keep default names
      }
    };
    loadNames();
  }, [exerciseId, unlockedByExerciseId]);

  useEffect(() => {
    // Icon bounce
    iconScale.value = withDelay(
      baseDelay + index * 150,
      withSpring(1, { damping: 6, stiffness: 100 })
    );
    // Icon wiggle
    iconRotate.value = withDelay(
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
          withTiming(1.5, {
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(-1, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, [baseDelay, index, iconRotate, iconScale, shimmerPosition]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3,
    transform: [
      {
        translateX: interpolate(shimmerPosition.value, [-1, 1.5], [-150, 150]),
      },
    ],
  }));

  const cardBg = isDarkMode
    ? "rgba(139, 92, 246, 0.12)"
    : "rgba(139, 92, 246, 0.08)";
  const cardBorder = isDarkMode
    ? "rgba(139, 92, 246, 0.3)"
    : "rgba(139, 92, 246, 0.2)";

  return (
    <Animated.View
      entering={FadeInDown.delay(baseDelay + index * 150)
        .duration(400)
        .springify()
        .damping(12)}
      style={[
        styles.unlockCard,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
        },
      ]}
    >
      {/* Shimmer overlay */}
      <View style={styles.shimmerContainer}>
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(139, 92, 246, 0.4)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      <View style={styles.unlockContent}>
        {/* Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: `${colors.secondary[500]}20` },
            iconStyle,
          ]}
        >
          <Unlock size={20} color={colors.secondary[500]} strokeWidth={2.5} />
        </Animated.View>

        {/* Exercise info */}
        <View style={styles.exerciseInfo}>
          <Typography
            variant="body1"
            weight="bold"
            numberOfLines={1}
            style={{ color: colors.secondary[400] }}
          >
            {exerciseName}
          </Typography>
          {unlockedByName && (
            <Typography variant="caption" color="textMuted" numberOfLines={1}>
              {translations.unlockedBy[lang]} {unlockedByName}
            </Typography>
          )}
        </View>

        {/* Arrow */}
        <ChevronRight size={18} color={colors.textMuted} />
      </View>
    </Animated.View>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const UnlockedExercisesCardV2: React.FC<Props> = ({
  unlockedExercises,
  lang,
  baseDelay = 0,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const t = translations;

  const sparkleOpacity = useSharedValue(0.5);

  useEffect(() => {
    sparkleOpacity.value = withDelay(
      baseDelay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 })
        ),
        -1,
        true
      )
    );
  }, [sparkleOpacity, baseDelay]);

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  if (unlockedExercises.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(baseDelay).duration(500).springify()}
      style={styles.container}
    >
      {/* Blur Background */}
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={20}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDarkMode
                ? "rgba(20, 20, 28, 0.85)"
                : "rgba(255, 255, 255, 0.85)",
            },
          ]}
        />
      )}

      {/* Gradient border effect */}
      <LinearGradient
        colors={
          isDarkMode
            ? ["rgba(139, 92, 246, 0.3)", "rgba(167, 139, 250, 0.1)"]
            : ["rgba(139, 92, 246, 0.2)", "rgba(167, 139, 250, 0.05)"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={sparkleStyle}>
            <Sparkles size={24} color={colors.secondary[500]} />
          </Animated.View>
          <View style={styles.titleContainer}>
            <Typography
              variant="h3"
              weight="bold"
              style={{ color: colors.secondary[400] }}
            >
              {t.title[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {t.subtitle[lang]}
            </Typography>
          </View>
        </View>

        {/* Unlock Cards */}
        <View style={styles.cardsContainer}>
          {unlockedExercises.map((unlock, index) => (
            <UnlockCardAnimated
              key={unlock.exerciseId}
              exerciseId={unlock.exerciseId}
              unlockedByExerciseId={unlock.unlockedByExerciseId}
              index={index}
              lang={lang}
              baseDelay={baseDelay + 200}
            />
          ))}
        </View>

        {/* Footer hint */}
        <Typography
          variant="caption"
          color="textMuted"
          style={styles.footerHint}
        >
          {t.tryItNext[lang]}
        </Typography>
      </View>
    </Animated.View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 12,
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  cardsContainer: {
    gap: 10,
  },
  unlockCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  shimmer: {
    width: 100,
    height: "100%",
  },
  unlockContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseInfo: {
    flex: 1,
    gap: 2,
  },
  footerHint: {
    marginTop: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default UnlockedExercisesCardV2;
