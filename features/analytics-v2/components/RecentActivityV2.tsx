import { AnalyticsSessionData } from "@/features/analytics-v2/types/dashboard";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { analyticsTranslations as t } from "@/shared/translations/analytics";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  Check,
  ChevronRight,
  Clock,
  History,
  Timer,
} from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  sessions: AnalyticsSessionData[];
  lang: string;
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatRelativeDate = (dateStr: string, lang: "es" | "en"): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t.today[lang];
  if (diffDays === 1) return t.yesterday[lang];
  if (diffDays < 7) return `${diffDays} ${t.daysAgo[lang]}`;

  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export const RecentActivityV2: React.FC<Props> = ({ sessions, lang }) => {
  const { colors, isDarkMode } = useColorScheme();

  const displaySessions = sessions.slice(0, 4);

  const handleViewAll = () => {
    router.push("/workout-session/workout-session-list" as any);
  };

  if (displaySessions.length === 0) {
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(600)}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View
              style={[
                styles.titleIcon,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <History size={18} color={colors.primary[500]} />
            </View>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ color: colors.text }}
            >
              {t.recentActivity[lang]}
            </Typography>
          </View>
        </View>

        <View
          style={[
            styles.emptyCard,
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
          <Clock size={32} color={colors.textMuted} />
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 12 }}
          >
            {t.noWorkoutsYet[lang]}
          </Typography>
          <Typography
            variant="caption"
            color="textMuted"
            align="center"
            style={{ marginTop: 4 }}
          >
            {t.completeFirstWorkoutProgress[lang]}
          </Typography>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(600)}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.titleIcon,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <History size={18} color={colors.primary[500]} />
          </View>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {t.recentActivity[lang]}
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
            {t.viewHistory[lang]}
          </Typography>
          <ChevronRight size={14} color={colors.primary[500]} />
        </Pressable>
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

        <View style={styles.timeline}>
          {displaySessions.map((session, index) => {
            const isLast = index === displaySessions.length - 1;
            const completionRate = Math.round(
              (session.total_sets_completed / session.total_sets_planned) * 100
            );
            const isComplete = completionRate >= 100;

            return (
              <Animated.View
                key={session.id}
                entering={FadeInDown.duration(300).delay(650 + index * 60)}
              >
                <Pressable
                  onPress={() => {
                    router.push(`/workout-session/${session.id}` as any);
                  }}
                  style={({ pressed }) => [
                    styles.sessionRow,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  {/* Timeline indicator */}
                  <View style={styles.timelineIndicator}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isComplete
                            ? colors.success[500]
                            : colors.primary[500],
                        },
                      ]}
                    >
                      {isComplete && (
                        <Check size={10} color="#fff" strokeWidth={3} />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.line,
                          {
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.08)",
                          },
                        ]}
                      />
                    )}
                  </View>

                  {/* Session content */}
                  <View style={styles.sessionContent}>
                    <View style={styles.sessionHeader}>
                      <Typography
                        variant="body1"
                        weight="semibold"
                        style={{ color: colors.text }}
                        numberOfLines={1}
                      >
                        {session.routine_name}
                      </Typography>
                      <Typography variant="caption" color="textMuted">
                        {formatRelativeDate(session.started_at, lang)}
                      </Typography>
                    </View>

                    <View style={styles.sessionMeta}>
                      <View style={styles.metaItem}>
                        <Timer size={12} color={colors.textMuted} />
                        <Typography variant="caption" color="textMuted">
                          {formatDuration(session.total_duration_seconds)}
                        </Typography>
                      </View>
                      <View
                        style={[
                          styles.metaDivider,
                          {
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.08)",
                          },
                        ]}
                      />
                      <Typography variant="caption" color="textMuted">
                        {session.total_sets_completed}/
                        {session.total_sets_planned} {t.series[lang]}
                      </Typography>
                      {isComplete && (
                        <View
                          style={[
                            styles.completeBadge,
                            { backgroundColor: `${colors.success[500]}15` },
                          ]}
                        >
                          <Typography
                            variant="caption"
                            weight="semibold"
                            style={{
                              color: colors.success[500],
                              fontSize: 10,
                            }}
                          >
                            ✓
                          </Typography>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
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
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    padding: 32,
    alignItems: "center",
  },
  timeline: {
    padding: 16,
  },
  sessionRow: {
    flexDirection: "row",
    gap: 14,
  },
  timelineIndicator: {
    alignItems: "center",
    width: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    minHeight: 30,
  },
  sessionContent: {
    flex: 1,
    paddingBottom: 16,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaDivider: {
    width: 1,
    height: 12,
  },
  completeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
});
