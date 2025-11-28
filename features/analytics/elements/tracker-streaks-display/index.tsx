import { TrackerStreak } from "@/features/analytics/service/trackerAnalyticsService";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import {
  Beef,
  Droplets,
  Flame,
  Footprints,
  Moon,
  Pill,
  Scale,
  Smile,
  Zap,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

const METRIC_ICONS: Record<string, React.FC<any>> = {
  Droplets,
  Beef,
  Flame,
  Footprints,
  Moon,
  Scale,
  Smile,
  Zap,
  Pill,
};

type Props = {
  data: TrackerStreak[];
  loading?: boolean;
};

export const TrackerStreaksDisplay: React.FC<Props> = ({
  data,
  loading = false,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Flame size={20} color={colors.warning[500]} />
            <Typography variant="h5" weight="semibold">
              {t.consistencyStreaks?.[lang] || "Rachas de Consistencia"}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.skeletonRow}>
            <View
              style={[styles.skeleton, { backgroundColor: colors.gray[200] }]}
            />
            <View
              style={[
                styles.skeletonText,
                { backgroundColor: colors.gray[200] },
              ]}
            />
          </View>
        </Card>
      </View>
    );
  }

  // Filter to show only metrics with current streak > 0
  const activeStreaks = data.filter((s) => s.currentStreak > 0);

  if (activeStreaks.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Flame size={20} color={colors.warning[500]} />
          <Typography variant="h5" weight="semibold">
            {t.consistencyStreaks?.[lang] || "Rachas de Consistencia"}
          </Typography>
        </View>
      </View>

      {activeStreaks.map((streak) => (
        <StreakItem
          key={streak.metricId}
          streak={streak}
          colors={colors}
          lang={lang}
        />
      ))}
    </View>
  );
};

// Individual streak item - same pattern as PRItem
const StreakItem: React.FC<{
  streak: TrackerStreak;
  colors: any;
  lang: string;
}> = ({ streak, colors, lang }) => {
  const IconComponent = METRIC_ICONS[streak.metricIcon] || Zap;

  return (
    <Card variant="outlined" padding="md" style={styles.card}>
      <View style={styles.content}>
        {/* Left: Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: streak.metricColor + "20" },
          ]}
        >
          <IconComponent size={18} color={streak.metricColor} />
        </View>

        {/* Middle: Info */}
        <View style={styles.info}>
          <Typography
            variant="body1"
            weight="semibold"
            numberOfLines={1}
            style={styles.title}
          >
            {streak.metricName}
          </Typography>
          <View style={styles.metaRow}>
            <Typography variant="caption" color="textMuted">
              {lang === "es" ? "Mejor:" : "Best:"} {streak.longestStreak}{" "}
              {streak.longestStreak === 1
                ? lang === "es"
                  ? "día"
                  : "day"
                : lang === "es"
                ? "días"
                : "days"}
            </Typography>
          </View>
        </View>

        {/* Right: Streak badge */}
        <View
          style={[styles.streakBadge, { backgroundColor: colors.warning[500] }]}
        >
          <Typography variant="body1" weight="bold" style={styles.streakNumber}>
            {streak.currentStreak}
          </Typography>
          <Typography variant="caption" style={styles.streakUnit}>
            🔥
          </Typography>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skeleton: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  skeletonText: {
    flex: 1,
    height: 16,
    borderRadius: 4,
  },
  card: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    minWidth: 55,
    justifyContent: "center",
  },
  streakNumber: {
    color: "#ffffff",
    fontSize: 16,
  },
  streakUnit: {
    fontSize: 14,
  },
});
