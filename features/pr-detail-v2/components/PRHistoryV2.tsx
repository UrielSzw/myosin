import type { PRHistoryItem } from "@/features/pr-detail/hooks/use-pr-detail";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import { Award, Medal, Star, Trophy } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  history: PRHistoryItem[];
  lang: string;
}

const getMedalIcon = (position: number) => {
  switch (position) {
    case 1:
      return { Icon: Trophy, color: "#FFD700" };
    case 2:
      return { Icon: Medal, color: "#C0C0C0" };
    case 3:
      return { Icon: Medal, color: "#CD7F32" };
    default:
      return { Icon: Star, color: "#8B8B8B" };
  }
};

const formatDate = (dateStr: string, lang: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const PRHistoryV2: React.FC<Props> = ({ history, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.created_at || "").getTime() -
      new Date(a.created_at || "").getTime()
  );

  const rankedHistory = sortedHistory
    .map((item) => ({
      ...item,
      rank:
        [...history]
          .sort((a, b) => b.estimated_1rm - a.estimated_1rm)
          .findIndex((h) => h.id === item.id) + 1,
    }))
    .slice(0, 10);

  if (rankedHistory.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(300).delay(700)}
        style={styles.header}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${colors.primary[500]}15` },
          ]}
        >
          <Award size={18} color={colors.primary[500]} />
        </View>
        <View>
          <Typography variant="body1" weight="semibold">
            {lang === "es" ? "Historial de PRs" : "PR History"}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {lang === "es" ? "Tus mejores marcas" : "Your best lifts"}
          </Typography>
        </View>
      </Animated.View>

      <View style={styles.timeline}>
        {rankedHistory.map((item, index) => {
          const { Icon, color } = getMedalIcon(item.rank);
          const isTop3 = item.rank <= 3;

          return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(300).delay(750 + index * 50)}
              style={styles.timelineItem}
            >
              {index < rankedHistory.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                  ]}
                />
              )}

              <View
                style={[
                  styles.medalContainer,
                  {
                    backgroundColor: isTop3 ? `${color}20` : "transparent",
                    borderColor: color,
                    borderWidth: isTop3 ? 0 : 1,
                  },
                ]}
              >
                <Icon size={14} color={color} />
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.85)",
                    borderColor: isTop3
                      ? `${color}40`
                      : isDarkMode
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
                  <View style={styles.cardLeft}>
                    <View style={styles.weightRow}>
                      <Typography
                        variant="body1"
                        weight="bold"
                        style={{ color: isTop3 ? color : colors.text }}
                      >
                        {fromKg(item.weight, weightUnit, 1)} {weightUnit}
                      </Typography>
                      <Typography variant="caption" color="textMuted">
                        {" "}
                        x {item.reps} reps
                      </Typography>
                    </View>
                    <Typography variant="caption" color="textMuted">
                      {formatDate(item.created_at || "", lang)}
                    </Typography>
                  </View>

                  <View style={styles.cardRight}>
                    <View
                      style={[
                        styles.rmBadge,
                        {
                          backgroundColor: isTop3
                            ? `${color}20`
                            : `${colors.primary[500]}15`,
                        },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="semibold"
                        style={{
                          color: isTop3 ? color : colors.primary[500],
                          fontSize: 10,
                        }}
                      >
                        1RM
                      </Typography>
                    </View>
                    <Typography
                      variant="body2"
                      weight="bold"
                      style={{ color: isTop3 ? color : colors.primary[500] }}
                    >
                      {fromKg(item.estimated_1rm, weightUnit, 0)}
                    </Typography>
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
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
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 15,
    top: 34,
    bottom: -12,
    width: 2,
    borderRadius: 1,
  },
  medalContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardLeft: {
    gap: 2,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  rmBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
