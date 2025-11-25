import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { analyticsTranslations } from "@/shared/translations/analytics";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, View } from "react-native";
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

  console.log("[AnalyticsFeature] Data loaded:", JSON.stringify(data, null, 2));

  return (
    <ScreenWrapper withGradient fullscreen>
      <ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 6 }}>
            {t.analytics[lang]}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {t.insightsSubtitle[lang]}
          </Typography>
        </View>

        {/* Vista semanal de rutinas programadas */}
        <WeeklyRoutineSchedule
          activeRoutines={data?.activeRoutines || []}
          loading={isLoading}
        />

        {/* Volumen semanal inteligente */}
        <SmartVolumeDisplay
          data={data?.weeklyVolume}
          loading={isLoading}
          showTop={4}
        />

        {/* PRs con expansión */}
        <SmartPRDisplay
          data={data?.topPRs || []}
          loading={isLoading}
          showTop={4}
        />

        {/* Sesiones recientes */}
        <RecentSessionsList
          data={data?.recentSessions || []}
          loading={isLoading}
        />

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};
