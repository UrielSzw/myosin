import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { analyticsTranslations as t } from "@/shared/translations/analytics";
import { Typography } from "@/shared/ui/typography";
import { WeeklyVolumeMap } from "@/shared/utils/volume-calculator";
import { BlurView } from "expo-blur";
import { Dumbbell } from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  weeklyVolume: WeeklyVolumeMap;
  lang: string;
};

type MuscleCategory = {
  key: string;
  label: { es: string; en: string };
  color: string;
};

const MUSCLE_CATEGORIES: MuscleCategory[] = [
  { key: "chest", label: { es: "Pecho", en: "Chest" }, color: "#ef4444" },
  { key: "back", label: { es: "Espalda", en: "Back" }, color: "#3b82f6" },
  {
    key: "shoulders",
    label: { es: "Hombros", en: "Shoulders" },
    color: "#8b5cf6",
  },
  { key: "arms", label: { es: "Brazos", en: "Arms" }, color: "#f59e0b" },
  { key: "legs", label: { es: "Piernas", en: "Legs" }, color: "#10b981" },
  { key: "core", label: { es: "Core", en: "Core" }, color: "#ec4899" },
];

export const VolumeChartV2: React.FC<Props> = ({ weeklyVolume, lang }) => {
  const { colors, isDarkMode } = useColorScheme();

  const chartData = useMemo(() => {
    const data = MUSCLE_CATEGORIES.map((category) => {
      const volume = weeklyVolume[category.key as keyof WeeklyVolumeMap];
      return {
        ...category,
        sets: Math.round(volume?.totalSets || 0),
        frequency: volume?.frequency || 0,
      };
    }).filter((item) => item.sets > 0);

    // Sort by sets descending
    data.sort((a, b) => b.sets - a.sets);

    // Calculate max for percentage
    const maxSets = Math.max(...data.map((d) => d.sets), 1);

    return data.map((item) => ({
      ...item,
      percentage: (item.sets / maxSets) * 100,
    }));
  }, [weeklyVolume]);

  const totalSets = useMemo(
    () => chartData.reduce((sum, item) => sum + item.sets, 0),
    [chartData]
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(400)}>
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
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {t.weeklyVolume[lang]}
          </Typography>
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
            {totalSets} {t.series[lang]}
          </Typography>
        </View>
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

        <View style={styles.chartContainer}>
          {chartData.map((item, index) => (
            <Animated.View
              key={item.key}
              entering={FadeInDown.duration(300).delay(450 + index * 50)}
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
                  {item.label[lang as "es" | "en"]}
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
