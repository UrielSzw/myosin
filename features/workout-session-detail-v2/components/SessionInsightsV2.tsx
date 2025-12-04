import { SessionAnalytics } from "@/features/workout-session-detail-v2/hooks/use-session-detail";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutSessionDetailTranslations as t } from "@/shared/translations/workout-session-detail";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import { Sparkles, Target, Trophy, Zap } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  analytics: SessionAnalytics;
  lang: SupportedLanguage;
};

export const SessionInsightsV2: React.FC<Props> = ({ analytics, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const hasRPE = analytics.averageRPE !== null;
  const hasBestSet = analytics.bestSets.length > 0;
  const hasPRs = analytics.prCount > 0;

  // Don't render if no insights
  if (!hasRPE && !hasBestSet && !hasPRs) {
    return null;
  }

  const bestSet = analytics.bestSets[0];
  const bestSetWeight = bestSet ? fromKg(bestSet.weight, weightUnit, 1) : 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(400)}
      style={styles.container}
    >
      {/* Section Title */}
      <View style={styles.titleRow}>
        <Sparkles size={16} color={colors.primary[500]} />
        <Typography
          variant="body1"
          weight="semibold"
          style={{ color: colors.text, marginLeft: 8 }}
        >
          {t.highlights[lang]}
        </Typography>
      </View>

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
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.insightsContent}>
          {/* Average RPE */}
          {hasRPE && (
            <View style={styles.insightItem}>
              <View
                style={[
                  styles.insightIcon,
                  { backgroundColor: `${colors.primary[500]}15` },
                ]}
              >
                <Zap size={18} color={colors.primary[500]} />
              </View>
              <View style={styles.insightInfo}>
                <Typography variant="caption" color="textMuted">
                  {t.averageRPE[lang]}
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {analytics.averageRPE}
                </Typography>
              </View>
              <View
                style={[
                  styles.percentageBadge,
                  { backgroundColor: `${colors.primary[500]}15` },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{ color: colors.primary[500], fontSize: 10 }}
                >
                  {analytics.plannedVsActual.rpeUsage}% {t.usage[lang]}
                </Typography>
              </View>
            </View>
          )}

          {/* Divider */}
          {hasRPE && hasBestSet && (
            <View
              style={[
                styles.divider,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            />
          )}

          {/* Best Set */}
          {hasBestSet && bestSet && (
            <View style={styles.insightItem}>
              <View
                style={[
                  styles.insightIcon,
                  { backgroundColor: `${colors.success[500]}15` },
                ]}
              >
                <Target size={18} color={colors.success[500]} />
              </View>
              <View style={[styles.insightInfo, { flex: 1 }]}>
                <Typography variant="caption" color="textMuted">
                  {t.bestSet[lang]}
                </Typography>
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {bestSetWeight}
                  {weightUnit} × {bestSet.reps}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  numberOfLines={1}
                  style={{ marginTop: 2 }}
                >
                  {bestSet.exerciseName}
                </Typography>
              </View>
              {bestSet.isPR && (
                <View
                  style={[
                    styles.prBadge,
                    { backgroundColor: `${colors.warning[500]}15` },
                  ]}
                >
                  <Trophy size={12} color={colors.warning[500]} />
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{
                      color: colors.warning[500],
                      fontSize: 10,
                      marginLeft: 4,
                    }}
                  >
                    PR
                  </Typography>
                </View>
              )}
            </View>
          )}

          {/* PRs Count */}
          {hasPRs && (
            <>
              {(hasRPE || hasBestSet) && (
                <View
                  style={[
                    styles.divider,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)",
                    },
                  ]}
                />
              )}
              <View style={styles.prCountRow}>
                <View
                  style={[
                    styles.prCountBadge,
                    { backgroundColor: `${colors.warning[500]}15` },
                  ]}
                >
                  <Trophy size={16} color={colors.warning[500]} />
                  <Typography
                    variant="body1"
                    weight="bold"
                    style={{ color: colors.warning[500], marginLeft: 8 }}
                  >
                    {analytics.prCount}
                  </Typography>
                </View>
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ flex: 1 }}
                >
                  {analytics.prCount === 1
                    ? t.personalRecordSingular[lang]
                    : t.personalRecordPlural[lang]}
                </Typography>
              </View>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  insightsContent: {
    padding: 16,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  insightInfo: {
    gap: 2,
  },
  percentageBadge: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  prBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  prCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  prCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
});
