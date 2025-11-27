import { SessionData } from "@/features/analytics/types/session";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import { ChevronRight, Clock, Dumbbell } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getTimeAgo = (dateString: string, lang: string = "es"): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const t = (key: keyof typeof analyticsTranslations) =>
    (analyticsTranslations[key] as Record<string, string>)[lang] ??
    (analyticsTranslations[key] as Record<string, string>)["en"];

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      return t("timeAgoMinutes");
    }
    return t("timeAgoHours").replace("{hours}", String(diffHours));
  } else if (diffDays === 1) {
    return t("timeAgoYesterday");
  } else if (diffDays < 7) {
    return t("timeAgoDays").replace("{days}", String(diffDays));
  } else {
    return date.toLocaleDateString();
  }
};

export const SessionItem: React.FC<{
  session: SessionData;
  colors: any;
}> = ({ session, colors }) => {
  const router = useRouter();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const completionRate = Math.round(
    (session.total_sets_completed / session.total_sets_planned) * 100
  );
  const isCompleted = completionRate === 100;
  const timeAgo = getTimeAgo(session.started_at, lang);

  const handleSessionPress = () => {
    router.push(`/workout-session/${session.id}` as any);
  };

  return (
    <Pressable onPress={handleSessionPress}>
      {({ pressed }) => (
        <Card
          variant="outlined"
          padding="md"
          style={[styles.card, { opacity: pressed ? 0.7 : 1 }]}
        >
          <View style={styles.content}>
            {/* Left: Dumbbell icon with completion indicator */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isCompleted
                    ? colors.success[100]
                    : colors.gray[100],
                },
              ]}
            >
              <Dumbbell
                size={18}
                color={isCompleted ? colors.success[600] : colors.gray[500]}
              />
            </View>

            {/* Middle: Info */}
            <View style={styles.info}>
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={styles.title}
              >
                {session.routine_name}
              </Typography>
              <View style={styles.metaRow}>
                <Typography variant="caption" color="textMuted">
                  {timeAgo}
                </Typography>
                <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
                <Clock size={10} color={colors.textMuted} />
                <Typography variant="caption" color="textMuted">
                  {formatDuration(session.total_duration_seconds)}
                </Typography>
              </View>
            </View>

            {/* Right: Completion + chevron */}
            <View style={styles.rightSection}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isCompleted
                      ? colors.success[100]
                      : completionRate >= 80
                      ? colors.warning[100]
                      : colors.gray[100],
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{
                    color: isCompleted
                      ? colors.success[700]
                      : completionRate >= 80
                      ? colors.warning[700]
                      : colors.gray[600],
                  }}
                >
                  {completionRate}%
                </Typography>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </View>
          </View>
        </Card>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
  },
  title: {
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
