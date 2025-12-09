/**
 * VolumeChart - Unified volume display component
 *
 * Modern design with blur effects and animations.
 * Used in analytics and routine form preview.
 */

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { analyticsTranslations } from "@/shared/translations/analytics";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Dumbbell } from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// =============================================================================
// TYPES
// =============================================================================

export interface MuscleVolumeData {
  category: string;
  sets: number;
  percentage?: number;
}

export interface VolumeChartProps {
  /** Volume data array */
  volumeData: MuscleVolumeData[];
  /** Total sets count */
  totalSets: number;
  /** Language for labels */
  lang: SupportedLanguage;
  /** Optional title override */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Whether to show header (default: true) */
  showHeader?: boolean;
  /** Animation delay offset in ms (default: 0) */
  animationDelay?: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

// Map of category key to color - labels come from translations
const MUSCLE_CATEGORY_COLORS: Record<string, string> = {
  Pecho: "#ef4444",
  Espalda: "#3b82f6",
  Hombros: "#8b5cf6",
  Brazos: "#f59e0b",
  Piernas: "#10b981",
  Core: "#ec4899",
  Otro: "#6b7280",
};

// Also support English keys from WeeklyVolumeMap
const CATEGORY_KEY_MAP: Record<string, string> = {
  chest: "Pecho",
  back: "Espalda",
  shoulders: "Hombros",
  arms: "Brazos",
  legs: "Piernas",
  core: "Core",
  other: "Otro",
};

// Map normalized key to translation key
const CATEGORY_TRANSLATION_KEY_MAP: Record<
  string,
  keyof typeof analyticsTranslations.muscleCategories
> = {
  Pecho: "chest",
  Espalda: "back",
  Hombros: "shoulders",
  Brazos: "arms",
  Piernas: "legs",
  Core: "core",
  Otro: "other",
};

// =============================================================================
// COMPONENT
// =============================================================================

export const VolumeChart: React.FC<VolumeChartProps> = ({
  volumeData,
  totalSets,
  lang,
  title,
  subtitle,
  showHeader = true,
  animationDelay = 0,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  const chartData = useMemo(() => {
    // Normalize category keys and merge with category config
    const normalizedData = volumeData.map((item) => {
      const normalizedKey = CATEGORY_KEY_MAP[item.category] || item.category;
      const translationKey = CATEGORY_TRANSLATION_KEY_MAP[normalizedKey];
      const label = translationKey
        ? analyticsTranslations.muscleCategories[translationKey]
        : { es: normalizedKey, en: normalizedKey };

      return {
        key: normalizedKey,
        label,
        color: MUSCLE_CATEGORY_COLORS[normalizedKey] || "#6b7280",
        sets: Math.round(item.sets),
      };
    });

    // Filter out zero sets and sort by sets descending
    const filtered = normalizedData
      .filter((item) => item.sets > 0)
      .sort((a, b) => b.sets - a.sets);

    // Calculate percentages based on max
    const maxSets = Math.max(...filtered.map((d) => d.sets), 1);

    return filtered.map((item) => ({
      ...item,
      percentage: (item.sets / maxSets) * 100,
    }));
  }, [volumeData]);

  if (chartData.length === 0) {
    return null;
  }

  const displayTitle = title || analyticsTranslations.weeklyVolume[lang];

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(animationDelay)}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View
              style={[
                styles.titleIcon,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <Dumbbell size={18} color={colors.primary[500]} />
            </View>
            <View>
              <Typography
                variant="h6"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {displayTitle}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="textMuted">
                  {subtitle}
                </Typography>
              )}
            </View>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
          >
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: colors.primary[500] }}
            >
              {totalSets} {analyticsTranslations.sets[lang]}
            </Typography>
          </View>
        </View>
      )}

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

        <View style={styles.chartContainer}>
          {chartData.map((item, index) => (
            <Animated.View
              key={item.key}
              entering={FadeInDown.duration(300).delay(
                animationDelay + 50 + index * 50
              )}
              style={styles.barRow}
            >
              <View style={styles.labelContainer}>
                <View
                  style={[styles.colorDot, { backgroundColor: item.color }]}
                />
                <Typography
                  variant="body2"
                  weight="medium"
                  style={{ color: colors.text }}
                >
                  {item.label[lang]}
                </Typography>
              </View>

              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barBackground,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.valueContainer}>
                <Typography
                  variant="body2"
                  weight="bold"
                  style={{ color: item.color }}
                >
                  {item.sets}
                </Typography>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

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
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  chartContainer: {
    padding: 16,
    gap: 14,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  labelContainer: {
    width: 85,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 12,
  },
  valueContainer: {
    width: 30,
    alignItems: "flex-end",
  },
});
