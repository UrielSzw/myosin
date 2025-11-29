import type { MetricDisplayData } from "@/features/tracker/types/visual-states";
import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { getMetricName } from "@/shared/translations/tracker";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import * as Icons from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type BooleanMetricCardV2Props = {
  metric: TrackerMetricWithQuickActions;
  displayData: MetricDisplayData;
  onPress: () => void;
  lang: "es" | "en";
};

export const BooleanMetricCardV2: React.FC<BooleanMetricCardV2Props> =
  React.memo(({ metric, displayData, onPress, lang }) => {
    const { colors, isDarkMode } = useColorScheme();

    // Get icon component
    const IconComponent = (Icons as any)[displayData.iconName];

    // Is completed (value > 0)
    const isCompleted = displayData.hasEntry && displayData.currentValue > 0;

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

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconInner,
                {
                  backgroundColor: isCompleted
                    ? `${metric.color}15`
                    : `${displayData.iconColor}12`,
                },
              ]}
            >
              {IconComponent && (
                <IconComponent
                  size={24}
                  color={isCompleted ? metric.color : displayData.iconColor}
                />
              )}
            </View>
          </View>

          {/* Value Display */}
          <View style={styles.valueContainer}>
            <Typography
              variant="body1"
              weight="semibold"
              numberOfLines={1}
              style={{
                color: isCompleted ? metric.color : colors.textMuted,
                textAlign: "center",
              }}
            >
              {displayData.displayText}
            </Typography>

            {/* Completed indicator */}
            {isCompleted && (
              <View
                style={[
                  styles.completedBadge,
                  { backgroundColor: `${metric.color}12` },
                ]}
              >
                <Icons.Check size={10} color={metric.color} strokeWidth={3} />
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  });

BooleanMetricCardV2.displayName = "BooleanMetricCardV2";

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
    opacity: 0.12,
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  iconInner: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    alignItems: "center",
  },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
