import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecentSessionsList } from "./elements/recent-sessions-list";
import { SmartPRDisplay } from "./elements/smart-pr-display";
import { SmartVolumeDisplay } from "./elements/smart-volume-display";
import { WeeklyRoutineSchedule } from "./elements/weekly-routine-scheduler";
import { useAnalyticsData } from "./hooks/use-analytics-data";

export const AnalyticsFeature: React.FC = () => {
  const { colors } = useColorScheme();
  const { user } = useAuth();

  const { data, isLoading, error } = useAnalyticsData(user?.id);

  if (error) {
    console.error("[AnalyticsFeature] Error loading data:", error);
  }

  console.log("[AnalyticsFeature] Data loaded:", JSON.stringify(data, null, 2));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 6 }}>
            Analíticas
          </Typography>
          <Typography variant="body2" color="textMuted">
            Insights útiles sobre tu entrenamiento
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
    </SafeAreaView>
  );
};
