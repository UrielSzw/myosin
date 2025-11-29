import { CurrentPR } from "@/features/pr-detail/hooks/use-pr-detail";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import { Calendar, Sparkles, Trophy } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  currentPR: CurrentPR;
  lang: string;
};

const formatRelativeDate = (dateString: string, lang: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return lang === "es" ? "Hoy" : "Today";
  } else if (diffDays === 1) {
    return lang === "es" ? "Ayer" : "Yesterday";
  } else if (diffDays < 7) {
    return lang === "es" ? `Hace ${diffDays} días` : `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return lang === "es"
      ? `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`
      : `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return lang === "es"
      ? `Hace ${months} ${months === 1 ? "mes" : "meses"}`
      : `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return lang === "es"
      ? `Hace ${years} ${years === 1 ? "año" : "años"}`
      : `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const PRHeroCardV2: React.FC<Props> = ({ currentPR, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const bestWeightFormatted = fromKg(currentPR.best_weight, weightUnit, 1);
  const estimated1RMFormatted = fromKg(currentPR.estimated_1rm, weightUnit, 1);

  // Check if PR is recent (within 7 days)
  const isRecent =
    new Date().getTime() - new Date(currentPR.achieved_at).getTime() <
    7 * 24 * 60 * 60 * 1000;

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100)}>
      <View style={styles.card}>
        {/* Background gradient effect */}
        <View
          style={[
            styles.gradientBackground,
            { backgroundColor: colors.primary[500] },
          ]}
        />

        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 40 : 60}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Decorative circles */}
        <View
          style={[
            styles.decorCircle1,
            { backgroundColor: colors.primary[400] },
          ]}
        />
        <View
          style={[
            styles.decorCircle2,
            { backgroundColor: colors.primary[600] },
          ]}
        />

        <View style={styles.content}>
          {/* Trophy Icon */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={styles.trophyContainer}
          >
            <View style={styles.trophyOuter}>
              <View
                style={[
                  styles.trophy,
                  { backgroundColor: "rgba(245, 158, 11, 0.2)" },
                ]}
              >
                <Trophy size={36} color="#f59e0b" />
              </View>
            </View>
          </Animated.View>

          {/* Label */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(250)}
            style={styles.labelContainer}
          >
            <Typography variant="caption" weight="bold" style={styles.label}>
              {lang === "es" ? "PR ACTUAL" : "CURRENT PR"}
            </Typography>
            {isRecent && (
              <View style={styles.newBadge}>
                <Sparkles size={10} color="#10b981" />
                <Typography
                  variant="caption"
                  weight="bold"
                  style={styles.newText}
                >
                  {lang === "es" ? "NUEVO" : "NEW"}
                </Typography>
              </View>
            )}
          </Animated.View>

          {/* Main Weight x Reps */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <View style={styles.mainValue}>
              <Typography
                variant="h1"
                weight="bold"
                style={[styles.weightText, { color: colors.text }]}
              >
                {bestWeightFormatted}
              </Typography>
              <Typography
                variant="h4"
                weight="medium"
                style={{ color: colors.textMuted }}
              >
                {weightUnit} × {currentPR.best_reps}
              </Typography>
            </View>
          </Animated.View>

          {/* 1RM Badge */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(350)}
            style={[
              styles.rmBadge,
              { backgroundColor: `${colors.primary[500]}20` },
            ]}
          >
            <Typography
              variant="caption"
              weight="medium"
              style={{ color: colors.primary[500] }}
            >
              1RM {lang === "es" ? "estimado" : "estimated"}:
            </Typography>
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: colors.primary[500], marginLeft: 6 }}
            >
              {estimated1RMFormatted} {weightUnit}
            </Typography>
          </Animated.View>

          {/* Date */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(400)}
            style={styles.dateRow}
          >
            <Calendar size={14} color={colors.textMuted} />
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginLeft: 6 }}
            >
              {formatRelativeDate(currentPR.achieved_at, lang)}
            </Typography>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  decorCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.1,
  },
  decorCircle2: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.08,
  },
  content: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  trophyContainer: {
    marginBottom: 16,
  },
  trophyOuter: {
    padding: 4,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  trophy: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 2,
    fontSize: 11,
  },
  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  newText: {
    color: "#10b981",
    fontSize: 9,
  },
  mainValue: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 16,
  },
  weightText: {
    fontSize: 56,
    lineHeight: 62,
  },
  rmBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
