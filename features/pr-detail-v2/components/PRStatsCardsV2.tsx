import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import type { SupportedLanguage } from "@/shared/types/language";import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { prDetailTranslations as t } from "@/shared/translations/pr-detail";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import { Clock, Flame, TrendingUp } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  totalProgress: number;
  timeSpan: string;
  totalPRs: number;
  lang: SupportedLanguage;
};

export const PRStatsCardsV2: React.FC<Props> = ({
  totalProgress,
  timeSpan,
  totalPRs,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const progressFormatted = fromKg(Math.abs(totalProgress), weightUnit, 1);
  const progressText =
    totalProgress >= 0 ? `+${progressFormatted}` : `-${progressFormatted}`;
  const progressColor =
    totalProgress >= 0 ? colors.success[500] : colors.warning[500];

  const stats = [
    {
      icon: TrendingUp,
      label: t.progress[lang],
      value: progressText,
      unit: weightUnit,
      color: progressColor,
      delay: 450,
    },
    {
      icon: Clock,
      label: t.period[lang],
      value: timeSpan,
      unit: "",
      color: colors.primary[500],
      delay: 500,
    },
    {
      icon: Flame,
      label: t.records[lang],
      value: totalPRs.toString(),
      unit: "",
      color: "#f59e0b",
      delay: 550,
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <Animated.View
          key={stat.label}
          entering={FadeInDown.duration(300).delay(stat.delay)}
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

          <View style={styles.cardContent}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${stat.color}15` },
              ]}
            >
              <stat.icon size={18} color={stat.color} />
            </View>

            <Typography
              variant="caption"
              color="textMuted"
              style={styles.label}
            >
              {stat.label}
            </Typography>

            <View style={styles.valueRow}>
              <Typography
                variant="body1"
                weight="bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </Typography>
              {stat.unit && (
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginLeft: 2 }}
                >
                  {stat.unit}
                </Typography>
              )}
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  label: {
    marginBottom: 4,
    fontSize: 11,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
