import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecentSessionsList } from "./elements/recent-sessions-list";
import { SmartPRDisplay } from "./elements/smart-pr-display";
import { SmartVolumeDisplay } from "./elements/smart-volume-display";
import { WeeklyRoutineSchedule } from "./elements/weekly-routine-scheduler";
import { useAnalyticsData } from "./hooks/use-analytics-data";

export const AnalyticsFeature: React.FC = () => {
  const { colors } = useColorScheme();

  const { data, isLoading, error } = useAnalyticsData();

  const handlePRPress = (exerciseId: string, exerciseName?: string) => {
    Alert.alert(
      "PR Timeline",
      `Próximamente: timeline de PRs para ${exerciseName || "ejercicio"}`
    );
  };

  if (error) {
    console.error("[AnalyticsFeature] Error loading data:", error);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 6 }}>
            Analytics
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
          onPRPress={handlePRPress}
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

export default AnalyticsFeature;
