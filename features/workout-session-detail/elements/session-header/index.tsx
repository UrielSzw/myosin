import { WorkoutSessionFull } from "@/shared/db/schema/workout-session";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import { ArrowLeft, Calendar, Clock, Target } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SessionAnalytics } from "../../hooks/use-session-detail";

type Props = {
  session: WorkoutSessionFull;
  analytics: SessionAnalytics | null;
  lang: "es" | "en";
};

const formatDate = (dateString: string, lang: "es" | "en"): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const SessionHeader: React.FC<Props> = ({
  session,
  analytics,
  lang,
}) => {
  const { colors } = useColorScheme();
  const router = useRouter();

  const completionRate = Math.round(
    (session.total_sets_completed / session.total_sets_planned) * 100
  );

  const isCompleted = completionRate === 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      {/* Top row: Back button + Title */}
      <View style={styles.topRow}>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color={colors.text} />}
        />

        <View style={styles.titleContainer}>
          <Typography variant="h5" weight="bold" numberOfLines={1}>
            {session.routine.name}
          </Typography>
        </View>

        <View
          style={[
            styles.completionBadge,
            {
              backgroundColor: isCompleted
                ? colors.success[500]
                : colors.primary[500],
            },
          ]}
        >
          <Typography variant="caption" weight="bold" style={styles.completionText}>
            {completionRate}%
          </Typography>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Calendar size={14} color={colors.textMuted} />
          <Typography variant="caption" color="textMuted">
            {formatDate(session.started_at, lang)}
          </Typography>
        </View>

        <View style={[styles.statDot, { backgroundColor: colors.gray[300] }]} />

        <View style={styles.statItem}>
          <Clock size={14} color={colors.textMuted} />
          <Typography variant="caption" color="textMuted">
            {formatDuration(session.total_duration_seconds)}
          </Typography>
        </View>

        <View style={[styles.statDot, { backgroundColor: colors.gray[300] }]} />

        <View style={styles.statItem}>
          <Target size={14} color={colors.textMuted} />
          <Typography variant="caption" color="textMuted">
            {session.total_sets_completed}/{session.total_sets_planned} sets
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  completionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completionText: {
    color: "#ffffff",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginLeft: 48,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 10,
  },
});
