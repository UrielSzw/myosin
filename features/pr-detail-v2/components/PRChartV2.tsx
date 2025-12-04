import type { PRHistoryItem } from "@/features/pr-detail-v2/hooks/use-pr-detail";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { prDetailTranslations as t } from "@/shared/translations/pr-detail";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { getLocale, type SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import { TrendingUp } from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  history: PRHistoryItem[];
  lang: SupportedLanguage;
};

export const PRChartV2: React.FC<Props> = ({ history, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const chartData = useMemo(() => {
    if (history.length === 0) return [];

    const sorted = [...history].sort(
      (a, b) =>
        new Date(a.created_at || "").getTime() -
        new Date(b.created_at || "").getTime()
    );

    return sorted.map((item, index) => ({
      value: fromKg(item.estimated_1rm, weightUnit, 0),
      label:
        index === 0 || index === sorted.length - 1
          ? new Date(item.created_at || "").toLocaleDateString(
              getLocale(lang),
              { month: "short", day: "numeric" }
            )
          : "",
      dataPointText:
        index === sorted.length - 1
          ? `${fromKg(item.estimated_1rm, weightUnit, 0)}`
          : undefined,
    }));
  }, [history, weightUnit, lang]);

  const minValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    const min = Math.min(...chartData.map((d) => d.value));
    return Math.max(0, min - 10);
  }, [chartData]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 100;
    const max = Math.max(...chartData.map((d) => d.value));
    return max + 10;
  }, [chartData]);

  if (chartData.length < 2) {
    return (
      <Animated.View
        entering={FadeInDown.duration(300).delay(600)}
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
        <View style={styles.emptyContent}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <TrendingUp size={24} color={colors.primary[500]} />
          </View>
          <Typography variant="body2" color="textMuted" align="center">
            {sharedUiTranslations.needAtLeast2PRs[lang]}
          </Typography>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(600)}
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

      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <TrendingUp size={18} color={colors.primary[500]} />
          </View>
          <View>
            <Typography variant="body1" weight="semibold">
              {t.progression1RM[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {sharedUiTranslations.estimatedOverTime[lang]}
            </Typography>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            height={160}
            width={280}
            curved
            curveType={0}
            areaChart
            hideDataPoints={false}
            dataPointsColor={colors.primary[500]}
            dataPointsRadius={4}
            thickness={3}
            color={colors.primary[500]}
            startFillColor={colors.primary[500]}
            endFillColor={colors.primary[500]}
            startOpacity={0.3}
            endOpacity={0.05}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            yAxisTextStyle={{
              color: colors.textMuted,
              fontSize: 10,
            }}
            xAxisLabelTextStyle={{
              color: colors.textMuted,
              fontSize: 10,
            }}
            noOfSections={4}
            maxValue={maxValue}
            yAxisOffset={minValue}
            adjustToWidth
            isAnimated
            animationDuration={600}
            textShiftY={-8}
            textShiftX={-5}
            textFontSize={10}
            textColor={colors.primary[500]}
          />
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.primary[500] },
              ]}
            />
            <Typography variant="caption" color="textMuted">
              1RM ({weightUnit})
            </Typography>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  content: {
    padding: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    alignItems: "center",
    marginLeft: -20,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContent: {
    padding: 40,
    alignItems: "center",
    gap: 16,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
