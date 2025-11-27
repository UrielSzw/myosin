import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "expo-router";
import { ChevronRight, Clock, History } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SessionData } from "../../types/session";
import { SessionItem } from "./session-item";

type Props = {
  data: SessionData[];
  loading?: boolean;
};

export const RecentSessionsListComponent: React.FC<Props> = ({
  data,
  loading,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;
  const router = useRouter();

  const handleHeaderPress = () => {
    router.push("workout-session/workout-session-list" as any);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <History size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.recentSessions[lang]}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.skeletonRow}>
            <View style={[styles.skeleton, { backgroundColor: colors.gray[200] }]} />
            <View style={[styles.skeletonText, { backgroundColor: colors.gray[200] }]} />
          </View>
        </Card>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <History size={20} color={colors.primary[500]} />
            <Typography variant="h5" weight="semibold">
              {t.recentSessions[lang]}
            </Typography>
          </View>
        </View>
        <Card variant="outlined" padding="lg">
          <View style={styles.emptyState}>
            <Clock size={32} color={colors.gray[400]} />
            <Typography
              variant="body2"
              color="textMuted"
              align="center"
              style={styles.emptyText}
            >
              {t.noRecentSessions[lang]}
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              {t.completeFirstWorkout[lang]}
            </Typography>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <History size={20} color={colors.primary[500]} />
          <Typography variant="h5" weight="semibold">
            {t.recentSessions[lang]}
          </Typography>
        </View>
        <Pressable
          onPress={handleHeaderPress}
          style={({ pressed }) => [
            styles.seeAllButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Typography variant="caption" color="textMuted">
            {data.length} {t.sessions[lang]}
          </Typography>
          <ChevronRight size={14} color={colors.textMuted} />
        </Pressable>
      </View>

      {data.map((session) => (
        <SessionItem key={session.id} session={session} colors={colors} />
      ))}
    </View>
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
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    marginTop: 4,
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
});

export const RecentSessionsList = React.memo(RecentSessionsListComponent);
export default RecentSessionsList;
