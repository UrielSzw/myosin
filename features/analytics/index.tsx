import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { HeroStats } from "./elements/hero-stats";
import { RecentSessionsList } from "./elements/recent-sessions-list";
import { SmartPRDisplay } from "./elements/smart-pr-display";
import { SmartVolumeDisplay } from "./elements/smart-volume-display";
import { WeeklyRoutineSchedule } from "./elements/weekly-routine-scheduler";
import { useAnalyticsData } from "./hooks/use-analytics-data";

export const AnalyticsFeature: React.FC = () => {
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;

  const { data, isLoading, error } = useAnalyticsData(user?.id);

  if (error) {
    console.error("[AnalyticsFeature] Error loading data:", error);
  }

  return (
    <ScreenWrapper withGradient fullscreen>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" weight="bold">
            {t.analytics[lang]}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {t.insightsSubtitle[lang]}
          </Typography>
        </View>

        {/* Hero Stats - 3 big numbers */}
        <HeroStats data={data} loading={isLoading} />

        {/* Weekly Schedule - Clean calendar view */}
        <WeeklyRoutineSchedule
          activeRoutines={data?.activeRoutines || []}
          loading={isLoading}
        />

        {/* Weekly Volume - Bar chart style */}
        <SmartVolumeDisplay
          data={data?.weeklyVolume}
          loading={isLoading}
          showTop={4}
        />

        {/* Personal Records */}
        <SmartPRDisplay
          data={data?.topPRs || []}
          loading={isLoading}
          showTop={4}
        />

        {/* Recent Sessions */}
        <RecentSessionsList
          data={data?.recentSessions || []}
          loading={isLoading}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  bottomSpacer: {
    height: 120,
  },
});
