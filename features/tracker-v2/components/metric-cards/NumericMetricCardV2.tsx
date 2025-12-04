import type { MetricDisplayData } from "@/features/tracker-v2/types/visual-states";
import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import {
  getMetricName,
  trackerTranslations as t,
} from "@/shared/translations/tracker";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import * as Icons from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type NumericMetricCardV2Props = {
  metric: TrackerMetricWithQuickActions;
  displayData: MetricDisplayData;
  onPress: () => void;
  lang: SupportedLanguage;
};

export const NumericMetricCardV2: React.FC<NumericMetricCardV2Props> =
  React.memo(({ metric, displayData, onPress, lang }) => {
    const { colors, isDarkMode } = useColorScheme();
    const isCompleted = displayData.state === "completed";

    // Get user's weight unit preference
    const prefs = useUserPreferences();
    const weightUnit = prefs?.weight_unit ?? "kg";

    // Check if this is a weight metric
    const isWeightMetric = metric.slug === "weight";

    // Format numeric value
    const formatValue = (value: number): string => {
      const displayValue = isWeightMetric
        ? fromKg(value, weightUnit, 1)
        : value;
      const rounded = Math.round(displayValue * 100) / 100;
      return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    };

    // Get display unit
    const displayUnit = isWeightMetric ? weightUnit : metric.unit;

    // Get icon component
    const IconComponent = (Icons as any)[displayData.iconName];

    // Progress ring calculations
    const size = 48;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = displayData.progressPercentage || 0;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.7)",
            borderColor: isCompleted
              ? `${metric.color}40`
              : isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 10 : 20}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Glow effect when completed */}
        {isCompleted && (
          <View
            style={[styles.completedGlow, { backgroundColor: metric.color }]}
          />
        )}

        <View style={styles.content}>
          {/* Metric Label */}
          <Typography
            variant="caption"
            weight="medium"
            numberOfLines={1}
            style={{ color: colors.textMuted }}
          >
            {getMetricName(metric, lang)}
          </Typography>

          {/* Icon with Progress Ring */}
          <View style={styles.iconContainer}>
            {displayData.showProgressRing &&
              displayData.progressPercentage !== null && (
                <Svg width={size} height={size} style={styles.progressRing}>
                  {/* Background circle */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={
                      isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
                    }
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={isCompleted ? "#22C55E" : metric.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                </Svg>
              )}
            <View
              style={[
                styles.iconInner,
                {
                  backgroundColor: `${displayData.iconColor}12`,
                },
              ]}
            >
              {IconComponent && (
                <IconComponent size={20} color={displayData.iconColor} />
              )}
            </View>
          </View>

          {/* Value and Unit */}
          <View style={styles.valueContainer}>
            <View style={styles.valueRow}>
              <Typography
                variant="h4"
                weight="bold"
                style={{
                  color: displayData.hasEntry ? colors.text : colors.textMuted,
                }}
              >
                {formatValue(displayData.currentValue)}
              </Typography>
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginLeft: 4 }}
              >
                {displayUnit}
              </Typography>
            </View>

            {/* Goal info */}
            {metric.default_target && !isCompleted && (
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 2 }}
              >
                / {formatValue(metric.default_target)}
              </Typography>
            )}

            {/* Completed badge */}
            {isCompleted && (
              <View
                style={[
                  styles.completedBadge,
                  { backgroundColor: `${metric.color}15` },
                ]}
              >
                <Icons.Check size={10} color={metric.color} strokeWidth={3} />
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{ color: metric.color, fontSize: 10 }}
                >
                  {t.goal[lang]}
                </Typography>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  });

NumericMetricCardV2.displayName = "NumericMetricCardV2";

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  completedGlow: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 4,
  },
  progressRing: {
    position: "absolute",
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    alignItems: "center",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
});
