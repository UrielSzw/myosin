import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { HabitsCompletionGrid } from "./elements/habits-completion-grid";
import { HeroStats } from "./elements/hero-stats";
import { RecentSessionsList } from "./elements/recent-sessions-list";
import { SmartPRDisplay } from "./elements/smart-pr-display";
import { SmartVolumeDisplay } from "./elements/smart-volume-display";
import { TrackerStreaksDisplay } from "./elements/tracker-streaks-display";
import { WeeklyRoutineSchedule } from "./elements/weekly-routine-scheduler";
import { WeightProgressChart } from "./elements/weight-progress-chart";
import { useAnalyticsData } from "./hooks/use-analytics-data";
import { useTrackerAnalytics } from "./hooks/use-tracker-analytics";

export const AnalyticsFeature: React.FC = () => {
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = analyticsTranslations;

  const { data, isLoading, error } = useAnalyticsData(user?.id);
  const {
    data: trackerData,
    isLoading: trackerLoading,
    error: trackerError,
  } = useTrackerAnalytics(user?.id);

  if (error) {
    console.error("[AnalyticsFeature] Error loading data:", error);
  }
  if (trackerError) {
    console.error(
      "[AnalyticsFeature] Error loading tracker data:",
      trackerError
    );
  }

  // Check if we have any tracker data to show
  const hasTrackerData =
    trackerData &&
    (trackerData.streaks.length > 0 ||
      trackerData.weightProgress.hasWeightMetric ||
      trackerData.habits.length > 0);

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

        {/* ===== TRACKER INSIGHTS SECTION ===== */}
        {(hasTrackerData || trackerLoading) && (
          <>
            {/* Tracker Section Divider */}
            <View style={styles.sectionDivider}>
              <Typography variant="h3" weight="bold">
                {t.trackerInsights[lang]}
              </Typography>
              <Typography variant="body2" color="textMuted">
                {t.trackerInsightsSubtitle[lang]}
              </Typography>
            </View>

            {/* Consistency Streaks */}
            {(trackerLoading || (trackerData?.streaks?.length ?? 0) > 0) && (
              <TrackerStreaksDisplay
                data={trackerData?.streaks || []}
                loading={trackerLoading}
              />
            )}

            {/* Weight Progress Chart */}
            {(trackerLoading ||
              trackerData?.weightProgress?.hasWeightMetric) && (
              <WeightProgressChart
                data={
                  trackerData?.weightProgress || {
                    hasWeightMetric: false,
                    dataPoints: [],
                    currentWeight: null,
                    weightChange: null,
                    trend: "stable",
                  }
                }
                loading={trackerLoading}
              />
            )}

            {/* Daily Habits Completion Grid */}
            {(trackerLoading || (trackerData?.habits?.length ?? 0) > 0) && (
              <HabitsCompletionGrid
                data={trackerData?.habits || []}
                loading={trackerLoading}
              />
            )}
          </>
        )}

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
  sectionDivider: {
    marginTop: 16,
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.15)",
  },
  bottomSpacer: {
    height: 120,
  },
});
