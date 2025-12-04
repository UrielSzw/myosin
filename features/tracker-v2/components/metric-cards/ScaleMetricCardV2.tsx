import type { MetricDisplayData } from "@/features/tracker-v2/types/visual-states";
import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  getMetricName,
  trackerTranslations,
} from "@/shared/translations/tracker";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import * as Icons from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type ScaleMetricCardV2Props = {
  metric: TrackerMetricWithQuickActions;
  displayData: MetricDisplayData;
  onPress: () => void;
  lang: SupportedLanguage;
};

export const ScaleMetricCardV2: React.FC<ScaleMetricCardV2Props> = React.memo(
  ({ metric, displayData, onPress, lang }) => {
    const { colors, isDarkMode } = useColorScheme();
    const t = trackerTranslations;

    // Get icon component
    const IconComponent = (Icons as any)[displayData.iconName];

    // Subtitle for scale level
    const subtitle = displayData.hasEntry
      ? `${t.states.level[lang]} ${Math.round(displayData.currentValue)}`
      : undefined;

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.7)",
            borderColor: isDarkMode
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

        {/* Decorative glow if has entry */}
        {displayData.hasEntry && (
          <View style={[styles.glow, { backgroundColor: metric.color }]} />
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
                  backgroundColor: `${displayData.iconColor}12`,
                },
              ]}
            >
              {IconComponent && (
                <IconComponent size={24} color={displayData.iconColor} />
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
                color: displayData.hasEntry
                  ? displayData.textColor
                  : colors.textMuted,
                textAlign: "center",
              }}
            >
              {displayData.displayText}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 2 }}
              >
                {subtitle}
              </Typography>
            )}
          </View>
        </View>
      </Pressable>
    );
  }
);

ScaleMetricCardV2.displayName = "ScaleMetricCardV2";

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.08,
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
});
