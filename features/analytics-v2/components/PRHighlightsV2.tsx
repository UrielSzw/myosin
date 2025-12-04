import { getLocale, type SupportedLanguage } from "@/shared/types/language";

import { AnalyticsPRData } from "@/features/analytics-v2/types/dashboard";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { analyticsTranslations as t } from "@/shared/translations/analytics";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Award, ChevronRight, Medal, Trophy } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  prs: AnalyticsPRData[];
  lang: SupportedLanguage;
};

const getMedalIcon = (index: number) => {
  switch (index) {
    case 0:
      return { Icon: Trophy, color: "#f59e0b" }; // Gold
    case 1:
      return { Icon: Medal, color: "#94a3b8" }; // Silver
    case 2:
      return { Icon: Award, color: "#cd7f32" }; // Bronze
    default:
      return { Icon: Award, color: "#6366f1" };
  }
};

export const PRHighlightsV2: React.FC<Props> = ({ prs, lang }) => {
  const { colors, isDarkMode } = useColorScheme();

  const displayPRs = prs.slice(0, 3);

  const handleViewAll = () => {
    router.push("/pr-list" as any);
  };

  const handlePRPress = (exerciseId: string) => {
    router.push(`/pr-detail/${exerciseId}` as any);
  };

  if (displayPRs.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(500)}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.titleIcon,
              { backgroundColor: "rgba(245, 158, 11, 0.15)" },
            ]}
          >
            <Trophy size={18} color="#f59e0b" />
          </View>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {t.personalRecords[lang]}
          </Typography>
        </View>

        <Pressable
          onPress={handleViewAll}
          style={({ pressed }) => [
            styles.viewAllButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Typography
            variant="caption"
            weight="semibold"
            style={{ color: colors.primary[500] }}
          >
            {t.viewAll[lang]}
          </Typography>
          <ChevronRight size={14} color={colors.primary[500]} />
        </Pressable>
      </View>

      <View style={styles.cardsContainer}>
        {displayPRs.map((pr, index) => {
          const { Icon, color } = getMedalIcon(index);
          const prDate = new Date(pr.achieved_at);
          const formattedDate = prDate.toLocaleDateString(getLocale(lang), {
            month: "short",
            day: "numeric",
          });

          return (
            <Animated.View
              key={pr.id}
              entering={FadeInDown.duration(300).delay(550 + index * 80)}
            >
              <Pressable
                onPress={() => handlePRPress(pr.exercise_id)}
                style={({ pressed }) => [
                  styles.prCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.85)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
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

                {/* Rank badge */}
                <View
                  style={[styles.rankBadge, { backgroundColor: `${color}15` }]}
                >
                  <Icon size={18} color={color} />
                </View>

                {/* Exercise info */}
                <View style={styles.prInfo}>
                  <Typography
                    variant="body1"
                    weight="semibold"
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {pr.exercise_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textMuted"
                    numberOfLines={1}
                  >
                    {pr.exercise_muscle} • {formattedDate}
                  </Typography>
                </View>

                {/* PR value */}
                <View style={styles.prValue}>
                  <Typography
                    variant="h5"
                    weight="bold"
                    style={{ color: colors.text }}
                  >
                    {pr.best_weight}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    kg × {pr.best_reps}
                  </Typography>
                </View>

                {/* 1RM estimate */}
                <View
                  style={[
                    styles.estimateBadge,
                    { backgroundColor: `${colors.primary[500]}15` },
                  ]}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{ color: colors.primary[500] }}
                  >
                    ~{Math.round(pr.estimated_1rm)}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ color: colors.primary[500], fontSize: 9 }}
                  >
                    1RM
                  </Typography>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  cardsContainer: {
    gap: 10,
  },
  prCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    padding: 14,
    gap: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  prInfo: {
    flex: 1,
    gap: 2,
  },
  prValue: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  estimateBadge: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 48,
  },
});
